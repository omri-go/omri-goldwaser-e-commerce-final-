from rest_framework import serializers
from .models import UserProfile, Product

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'name', 'email', 'document', 'phone', 'registrationDate')

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'category', 'description')