# urls.py (Your Django App Routing File)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CartViewSet, CategoryViewSet, RegisterUserView, GoogleExchangeView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    # Handshake Authentication API routes
    path('auth/register/', RegisterUserView.as_view(), name='api_register'),
    path('auth/google-exchange/', GoogleExchangeView.as_view(), name='api_google_exchange'),
]