import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('processing', 'Processing Blend'),
        ('shipped', 'Shipped / In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    # Links to user if logged in, blank if guest checkout
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    
    # Unique tracking code for customer lookups (e.g., ROSE-A1B2-C3D4)
    order_number = models.CharField(max_length=50, unique=True, editable=False)
    
    # Customer Details (Collected during checkout payload)
    email = models.EmailField()
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    # Logistics / Delivery Coordinates
    shipping_address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, default="Lagos")
    
    # Financial Matrix
    total_amount = models.DecimalField(max_length=12, decimal_places=2, max_digits=12)
    is_paid = models.BooleanField(default=False)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate a clean, unique tracking signature token on instantiation
            self.order_number = f"ROSE-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} - {self.first_name} {self.last_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.SET_NULL, null=True)
    
    # Historical Snapshot Fields: Crucial for auditing financial records
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name if self.product else 'Archived Item'} inside {self.order.order_number}"

    @property
    def subtotal(self):
        return self.price_at_purchase * self.quantity

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, help_text="URL-friendly identifier (e.g., herbal-teas)")

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    is_active = models.BooleanField(default=True, help_text="Uncheck this instead of deleting the product to pull it off the frontend shop layout.")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True, help_text="Describe the benefits, ingredients, and usage instructions.")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return self.name
    
class Cart(models.Model):
    # If the user is logged in, bind to their auth profile
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='cart')
    
    # If a guest checkout, bind to Django's session tracking string
    session_key = models.CharField(max_length=40, null=True, blank=True, unique=True, db_index=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"Cart belonging to Member: {self.user.username}"
        return f"Anonymous Guest Cart: {self.session_key[:10]}..."

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    # Establish a structural link back to the parent Cart
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    
    # Connect directly to your existing Product model
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    
    # Quantity logic with a safety validator preventing zero or negative values
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # A cart cannot have duplicate rows for the exact same product type
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def subtotal(self):
        return self.product.price * self.quantity