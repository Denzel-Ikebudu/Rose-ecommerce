from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}  # Automatically writes the slug as you type the name!


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_available', 'created_at')
    list_filter = ('is_available', 'category', 'created_at')
    list_editable = ('price', 'stock', 'is_available')  # Lets you update prices directly from the list view!
    prepopulated_fields = {'slug': ('name',)}