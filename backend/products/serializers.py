from rest_framework import serializers
from .models import Category, Product, Cart, CartItem

class CategorySerializer(serializers.ModelSerializer):
    # Counts how many products belong to this category dynamically
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'product_count']


class ProductSerializer(serializers.ModelSerializer):
    # This embeds the clean category name directly into the product JSON payload
    category_name = serializers.CharField(source='category.name', read_only=True)
    slug = serializers.CharField(required=False)

    class Meta:
        model = Product
        fields = [
            'id', 
            'category', 
            'category_name', 
            'name', 
            'slug', 
            'description', 
            'price', 
            'stock', 
            'is_available', 
            'image', 
            'created_at', 
            'updated_at'
        ]


# --- NEW CART SYSTEM SERIALIZERS ---

class CartItemSerializer(serializers.ModelSerializer):
    # Read-only configuration returns the full nested botanical product details to Next.js
    product = ProductSerializer(read_only=True)
    # Write-only configuration allows your frontend to simply pass an integer ID when writing data
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']

    def validate_product_id(self, value):
        # Prevent manual entry payloads pointing to broken database index instances
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError("Target product node does not exist in inventory records.")
        return value


class CartSerializer(serializers.ModelSerializer):
    # Pulls all related CartItem rows linked to this specific Cart container instance
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'created_at', 'updated_at']