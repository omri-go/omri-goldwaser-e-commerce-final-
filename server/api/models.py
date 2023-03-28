from django.db import models
from django.contrib.auth.models import User
from enum import Enum

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField("Name", max_length=240)
    email = models.EmailField()
    document = models.CharField("Document", max_length=20)
    phone = models.CharField(max_length=20)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def get_products_in_cart(self):
        try:
            shopping_cart = ProductsInCart.objects.get(user_profile=self)
            return shopping_cart.products.all()
        except ProductsInCart.DoesNotExist:
            return []
        
    def get_bought_products(self):
        try:
            bought_products = ProductsBought.objects.get(user_profile=self)
            return bought_products.products.all()
        except ProductsBought.DoesNotExist:
            return []        

    def __str__(self):
        return self.name

CATEGORY_CHOICES = [
    ('book', 'Book'),
    ('car', 'Car'),
    ('lamp', 'Lamp'),
]

class Product(models.Model):    
    name = models.CharField(max_length=100)    
    price = models.FloatField()
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='book')
    description = models.CharField(max_length=100)      

    def __str__(self):
        return self.name

# the products status. wheter the user bought it or not
class PRODUCT_STATUS(Enum):
    NO_STATUS = 'None'
    IN_CART = 'In Cart'
    BOUGHT = 'Bought'

class ProductsInCart(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product)

    def __str__(self):
        return f"{self.user_profile}: {', '.join(str(product) for product in self.products.all())}"

class ProductsBought(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product)

    def __str__(self):
        return f"{self.user_profile}: {', '.join(str(product) for product in self.products.all())}"        

class ProductReview(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE) # this is the reviewing user
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    review = models.CharField(max_length=2000)