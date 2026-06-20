from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    # Counts how many products belong to this category dynamically
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'product_count']


class ProductSerializer(serializers.ModelSerializer):
    # This embeds the clean category name directly into the product JSON payload
    category_name = serializers.CharField(source='category.name', read_only=True)

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