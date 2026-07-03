from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAdminUser, AllowAny 
from django.shortcuts import get_object_or_404
from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, CartItemSerializer
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication

class UnsafeSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Bypasses the strict cross-site header validation checks safely for local tests

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    # Enable internal search backends
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        # 1. SOFT DELETE FILTER: Admins see everything, buyers only see active items
        if self.request.user and self.request.user.is_staff:
            queryset = Product.objects.all().order_by('-created_at')
        else:
            queryset = Product.objects.filter(is_active=True).order_by('-created_at')
        
        # 2. Extract Category Node securely from request parameters
        category_id = self.request.query_params.get('category', None)
        if category_id and category_id != "all":
            queryset = queryset.filter(category_id=category_id)
            
        # 3. Apply search filters across the remaining dataset
        return queryset

    def destroy(self, request, *args, **kwargs):
        """
        Intercepts the DELETE action. Soft-deletes the product by switching 
        is_active to False to safely bypass Foreign Key constraints on old orders.
        """
        product = self.get_object()
        product.is_active = False
        product.save()
        return Response(
            {"success": "Product pulled off the active market listing view models cleanly."},
            status=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- NEW CART OPERATIONS SYSTEM ---

class CartViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # Both members and anonymous guests can interact here
    authentication_classes = [JWTAuthentication, UnsafeSessionAuthentication]

    def _get_or_create_cart(self, request):
        """
        Internal utility mapping incoming requests to unified Cart containers
        """
        # Scenario 1: User is securely authenticated via login session
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)

            session_key = request.session.session_key
            if session_key:
                guest_cart = Cart.objects.filter(session_key=session_key).exclude(id=cart.id).first()
                if guest_cart:
                    for guest_item in guest_cart.items.all():
                        user_item, item_created = CartItem.objects.get_or_create(
                            cart=cart, product=guest_item.product
                        )
                        if item_created:
                            user_item.quantity = guest_item.quantity
                        else:
                            user_item.quantity += guest_item.quantity
                        user_item.save()
                    guest_cart.delete()

            return cart

        # Scenario 2: User is an anonymous guest window-shopping
        if not request.session.session_key:
            request.session.create()
            request.session.create()
            # CRITICAL FIX: Write directly to the session dictionary to force 
            # Django to persist this specific session key back to the browser.
            request.session['session_forced'] = True
            request.session.modified = True
        
        session_key = request.session.session_key
        cart, created = Cart.objects.get_or_create(session_key=session_key)
        return cart

    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        GET /api/cart/current/ - Pulls active cart items and total calculations
        """
        cart = self._get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='add')
    def add_item(self, request):
        """
        POST /api/cart/add/ - Adds a product or increments quantity if already exists
        """
        cart = self._get_or_create_cart(request)
        product_id = request.data.get('product_id')
        try:
            quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            quantity = 1

        if not product_id:
            return Response({"error": "product_id parameters required"}, status=status.HTTP_400_BAD_REQUEST)

        # Make sure buyers cannot add an inactive product to their cart
        product = get_object_or_404(Product, id=product_id, is_active=True)
        
        # Pull existing item record or initialize a clean one
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
            
        cart_item.save()
        
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['patch'], url_path='update/(?P<item_id>\d+)')
    def update_quantity(self, request, item_id=None):
        """
        PATCH /api/cart/update/<item_id>/ - Explicitly sets or alters quantity values
        """
        cart = self._get_or_create_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = request.data.get('quantity')

        if quantity is None:
            return Response({"error": "Quantity modification context required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return Response({"error": "Invalid quantity value provided."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            cart_item.delete()  # Automatically clean row nodes if selection reaches zero
        else:
            cart_item.quantity = quantity
            cart_item.save()

        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['delete'], url_path='remove/(?P<item_id>\d+)')
    def remove_item(self, request, item_id=None):
        """
        DELETE /api/cart/remove/<item_id>/ - Completely deletes an item line from the cart
        """
        cart = self._get_or_create_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='checkout')
    def checkout(self, request):
        """
        POST /api/cart/checkout/ - Transforms active cart state records into legal Orders
        """
        cart = self._get_or_create_cart(request)
        
        if not cart.items.exists():
            return Response({"error": "Cannot process checkouts on vacant cart containers."}, status=status.HTTP_400_BAD_REQUEST)

        # Extract contact and logistics payloads from the frontend request body
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')
        shipping_address = request.data.get('shipping_address')
        city = request.data.get('city')
        state = request.data.get('state', 'Lagos')
        payment_ref = request.data.get('payment_reference')

        # --- DIAGNOSTIC LOGGER: Prints out values to your terminal logs ---
        print("\n--- INCOMING CHECKOUT PAYLOAD DIAGNOSTICS ---")
        print(f"email: {repr(email)}")
        print(f"first_name: {repr(first_name)}")
        print(f"last_name: {repr(last_name)}")
        print(f"phone_number: {repr(phone_number)}")
        print(f"shipping_address: {repr(shipping_address)}")
        print(f"city: {repr(city)}")
        print(f"state: {repr(state)}")
        print("----------------------------------------------\n")

        # Dynamically evaluate which exact parameters are empty strings or None
        missing_fields = []
        payload_eval = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "phone_number": phone_number,
            "shipping_address": shipping_address,
            "city": city
        }
        
        for key, val in payload_eval.items():
            if not val or str(val).strip() == "":
                missing_fields.append(key)

        if missing_fields:
            return Response(
                {"error": f"Incomplete parameters provided. Missing keys: {', '.join(missing_fields)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Initialize permanent Order Instance
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            shipping_address=shipping_address,
            city=city,
            state=state,
            total_amount=cart.total_price,
            is_paid=True if payment_ref else False, 
            payment_reference=payment_ref,
            status='processing' if payment_ref else 'pending'
        )

        # 2. Transfer CartItems into OrderItems & Deprecate Model Stock Metrics
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                price_at_purchase=cart_item.product.price, 
                quantity=cart_item.quantity
            )
            
            # Deduct stock metrics safely if track records are established
            if hasattr(cart_item.product, 'stock') and cart_item.product.stock >= cart_item.quantity:
                cart_item.product.stock -= cart_item.quantity
                cart_item.product.save()

        # 3. Flush the temporary Cart data completely
        cart.items.all().delete()

        return Response({
            "success": "Order engine captured submission records cleanly.",
            "order_number": order.order_number,
            "total_amount": float(order.total_amount)
        }, status=status.HTTP_201_CREATED)
    
    # views.py (Authentication Control Layer)
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
import requests

class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name = request.data.get("name", "")
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Mandatory credentials missing."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({"error": "A profile containing this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Separate full name securely if needed
        first_name = name.split(" ")[0] if " " in name else name
        last_name = name.split(" ")[1] if " " in name else ""

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "token": str(refresh.access_token),
            "user": {"email": user.email, "name": f"{user.first_name} {user.last_name}".strip()}
        }, status=status.HTTP_201_CREATED)


class GoogleExchangeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        google_access_token = request.data.get("access_token")
        
        if not google_access_token:
            return Response({"error": "Google verification token parameter missing."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Broadcast validation verification directly to Google's resource endpoints
        google_api_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={google_access_token}"
        google_response = requests.get(google_api_url)

        if google_response.status_code != 200:
            return Response({"error": "Invalid token context received from Google auth authority."}, status=status.HTTP_400_BAD_REQUEST)

        user_info = google_response.json()
        email = user_info.get("email")
        first_name = user_info.get("given_name", "")
        last_name = user_info.get("family_name", "")

        # 2. Extract or lazily instantiate the local Profile Instance
        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name
            }
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "token": str(refresh.access_token),
            "user": {"email": user.email, "name": f"{user.first_name} {user.last_name}".strip()},
            "is_new_profile": created
        }, status=status.HTTP_200_OK)