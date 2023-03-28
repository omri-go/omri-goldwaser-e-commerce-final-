from logging import exception
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.contrib.auth.models import User
from .models import UserProfile, Product, CATEGORY_CHOICES, ProductsInCart, PRODUCT_STATUS, ProductsBought, ProductReview
from .serializers import *

import random

from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from rest_framework import views
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError

#import openai

try:
    from .secret_key import OPENAI_KEY    
except ImportError:
    # Handle import error here
    OPENAI_KEY = ""

@api_view(['GET', 'POST'])
def users_list(request):
    if request.method == 'GET':
        auth_header = request.META.get('HTTP_AUTHORIZATION', None)
        token = _get_token(auth_header)
        user = _get_user_from_token(token)

        # the user isn't logged in, return nothing        
        if user==None:    
            data = UserProfile.objects.none()        
        # the user is a superuser, return everything
        elif user.is_superuser:
            data = UserProfile.objects.all()
        # regular user return only his data
        else:            
            data = UserProfile.objects.get(name=user.username)            
            data = UserProfile.objects.filter(name=user.username)

        serializer = UserSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)  


    elif request.method == 'POST':
        username = request.data.get('name')        
        email = request.data.get('email')
        document = request.data.get('document')
        phone = request.data.get('phone') 
        password = request.data.get('password')         

        # validate the username
        try:
            UnicodeUsernameValidator()(username)
        except ValidationError as e:
            error = "Invalid password: "
            for er in e: error += er + "\n"
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST) 

        if User.objects.filter(username=username).exists():
            return Response({'error': "Username already exists. Choose another one."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate the password against the default Django validators
        try:    
            validate_password(password)
        except Exception as e:         
            error = "Invalid password: "
            for er in e: error += er + "\n"
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)             

        user = User.objects.create_user(username, email, password=password)
        profile = UserProfile.objects.create(user=user, name=username, email=email, document=document, phone=phone)

        user.save()            
        profile.save()            
        return Response(status=status.HTTP_201_CREATED)

@api_view(['PUT', 'DELETE'])
def users_detail(request, username):    
    try:        
        user = UserProfile.objects.get(name=username)
    except UserProfile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data,context={'request': request})
        # validate the username
        try:
            UnicodeUsernameValidator()(username)
        except ValidationError as e:
            error = "Invalid password: "
            for er in e: error += er + "\n"
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST) 

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

def _get_user_from_token(token):    
    try:
        token_obj = Token.objects.get(key=token)
        user = User.objects.get(id=token_obj.user_id)
        return user        
    except Token.DoesNotExist:
        return None

# get token from header
def _get_token(auth_header):
    if auth_header is not None and 'Token' in auth_header:
        try:
            # split the header to retrieve the token
            token = auth_header.split(' ')[1]
            return token
        except IndexError:
            return None
    else:
        return None
         

# get product data
def _get_products_list(request, category=None,status=None):
        auth_header = request.META.get('HTTP_AUTHORIZATION', None)
        token = _get_token(auth_header)
        user = _get_user_from_token(token)        

        data = Product.objects.all()

        if category!=None:            
            data = data.filter(category=category)
        
        serializer = ProductsSerializer(data, context={'request': request}, many=True) 

        # add reviews to all products
        for p_dic in serializer.data:
            p_dic["reviews"]=[]
            prod = Product.objects.get(id=p_dic["id"])
            if(ProductReview.objects.filter(product=prod).exists()):
                reviews = ProductReview.objects.filter(product=prod)
                for r in reviews:
                    a = {}
                    a['reviewer'] = r.user_profile.name
                    a['review'] = r.review 
                    p_dic["reviews"].append(a)

        # the user isn't logged in, return all products
        if user==None or user.is_superuser:                      
            return Response(serializer.data)
        else:
            # update the status of all products, bought or not                       
            user_profile= UserProfile.objects.get(name = user.username)            
            #products_in_shopping_cart = user_profile.get_products_in_cart()  
            products_bought = user_profile.get_bought_products()  
            # update the serialized data with a status          
            # at this point products_in_shopping_cart has all products of the user, so this adds the products status
            output_data = serializer.data
            for p_dict in output_data:
                p_dict['status']='' # this is the NO_STATUS, show nothing
                #for cart_p in products_in_shopping_cart:
                #    if p_dict['id']==cart_p.id:
                #        p_dict['status']=PRODUCT_STATUS['IN_CART'].value
                for bought_p in products_bought:
                    if p_dict['id']==bought_p.id:
                        p_dict['status']=PRODUCT_STATUS['BOUGHT'].value
            # filter data based on status
            if status!='all':                
                filtered_s_data = []
                for d in output_data:
                    if d['status']=='' and status=='None': filtered_s_data.append(d)
                    #elif d['status']=='In Cart' and status=="In Cart": filtered_s_data.append(d)
                    elif d['status']=='Bought' and status=="Bought": filtered_s_data.append(d)
                output_data = filtered_s_data
            
            return Response(output_data)    

@api_view(['GET', 'POST'])
def products_list(request, category=None):
    if request.method == 'GET':                
        return _get_products_list(request, category)

    elif request.method == 'POST':      
        product_name = request.data.get('name')        
        price = int(request.data.get('price'))
        category = str(request.data.get('category'))        
        description = request.data.get('description')         

        if category=='': category=CATEGORY_CHOICES[0][0]

        if price<0:
            return Response({'error': "Price must be a positive number"}, status=status.HTTP_400_BAD_REQUEST)             
        if category not in [choice[0] for choice in CATEGORY_CHOICES]:
            return Response({'error': "Given category isn't in the database list of categories"}, status=status.HTTP_400_BAD_REQUEST)                         
        
        
        profile = Product.objects.create(name=product_name, price=price, category=category, description=description)        
        profile.save()            
        return Response(status=status.HTTP_201_CREATED)


@api_view(['GET'])
def products_by_category(request,category, status): 
    if category=='all': category=None #this means there's no filter based on category       
    if request.method == 'GET':
        return _get_products_list(request,category,status)



@api_view(['PUT', 'DELETE'])
def products_detail(request, product_id):  
    product_id = int(product_id)
    try:        
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':        
        serializer = ProductsSerializer(product, data=request.data,context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':        
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def submit_review(request, product_id):  
    product_id = int(product_id)      
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    token = request.data['token']
    user = _get_user_from_token(token)
    user_profile = UserProfile.objects.get(user = user)        

    # add review if
    if 'review' in request.data and request.data['review']!="": # the user wrote a review
        if not ProductReview.objects.filter(product=product).filter(user_profile =user_profile): # a review by the user doesn't already exists                
            ProductReview.objects.create(product=product, user_profile =user_profile, review = request.data["review"])        

    return Response(status=status.HTTP_204_NO_CONTENT)
    


class LoginView(views.APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)

            return Response({'token': token.key, 'is_superuser': user.is_superuser})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



         
# get user data based on authentification token
class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_superuser': user.is_superuser,
        }
        return Response(data)        
    


@api_view(['POST'])
def checkout2(request):         
    # get user
    token = request.data['headers']['Authorization'].split(' ')[1]
    user = _get_user_from_token(token)    
    # the user isn't logged in, return nothing        
    if user==None:            
        return Response({'error': 'Must be logged in to checkout'}, status=status.HTTP_401_UNAUTHORIZED)        
    user_profile = UserProfile.objects.get(user = user)    
    
    # get products to buy
    products_to_buy = []
    products_to_buy_from_client = request.data['headers']['products_to_buy']
    for p in products_to_buy_from_client:
        products_to_buy.append(Product.objects.get(id = p['id']))

    # buy products
    products_bought, created = ProductsBought.objects.get_or_create(user_profile=user_profile)    
    for p in products_to_buy:        
        products_bought.products.add(p)        

    return Response(status=status.HTTP_200_OK)      


@api_view(['POST'])
def chatbot(request):         

    #openai.api_key = OPENAI_KEY
    #messages = [
    #    {"role": "system", 
    #        "content": "You are an AI salesman trying to sell books, cars and lamps."},
    #]

    #def chatbot_send_to_openai(input):
    #    if input:
    #        messages.append({"role": "user", "content": input})
    #        try:
    #            chat = openai.ChatCompletion.create(
    #                model="gpt-3.5-turbo", messages=messages
    #            )            
    #            reply = chat.choices[0].message.content
    #            messages.append({"role": "assistant", "content": reply})
    #            return reply
    #        except:
    #            return "there was an error with OpenAI"

    #if OPENAI_KEY=="":
    #    # you need to put your openai key in secret_key.py with OPENAI_KEY=<your openai key> in the same folder as this file
    #    data = {'text': 'My admin forgot to config me :('} 
    #else:                
    #    reply = chatbot_send_to_openai(request.data['text'])
    #    data = {'text': reply} 
    
    data = {'text': "commented out because of an issue with docker"} 
    return Response(data=data, status=status.HTTP_200_OK)


# not used anymore 
# get user data based on authentification token
#class getUsers2(APIView):
#    authentication_classes = [TokenAuthentication]
#    permission_classes = [IsAuthenticated]

#    def get(self, request):
#        user = request.user
#        if user.is_superuser:
#            data = UserProfile.objects.all()
#        else:            
#            data = UserProfile.objects.filter(user=user)

#        serializer = UserSerializer(data, context={'request': request}, many=True)        
#        return Response(serializer.data)

# not used anymore    
#@api_view(['GET'])
#def checkout(request):    
#    auth_header = request.META.get('HTTP_AUTHORIZATION', None)
#    token = _get_token(auth_header)
#    user = _get_user_from_token(token)

#    # the user isn't logged in, return nothing        
#    if user==None:    
#        return Response({'error': 'Must be logged in to checkout'}, status=status.HTTP_401_UNAUTHORIZED)    
    
#    user_profile = UserProfile.objects.get(user = user)

#    # if the query is empty there are no products in the cart
#    if not ProductsInCart.objects.filter(user_profile=user_profile):
#        return Response({'error': 'No products to buy'}, status=status.HTTP_401_UNAUTHORIZED)
    
#    products_in_cart = ProductsInCart.objects.get(user_profile=user_profile) 
#    products_bought, created = ProductsBought.objects.get_or_create(user_profile=user_profile)    
#    for p in products_in_cart.products.all():        
#        products_bought.products.add(p)
    
#    p_in_cart = ProductsInCart.objects.filter(user_profile=user_profile)
#    if p_in_cart: p_in_cart.delete()

#    return Response(status=status.HTTP_200_OK)      

#@api_view(['POST'])
#def add_product_to_cart(request,product_id):
#    try:        
#        product = Product.objects.get(id=product_id)
#    except Product.DoesNotExist:
#        return Response(status=status.HTTP_404_NOT_FOUND)

#    token = request.data.get('token')
#    try:
#        token_obj = Token.objects.get(key=token)
#        user = User.objects.get(id=token_obj.user_id)
#        if user.is_superuser:
#            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

#        user_profile = UserProfile.objects.get(user = user)
#    except Token.DoesNotExist:
#        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
#    if ProductsInCart.objects.filter(user_profile=user_profile, products=product).exists():
#        # can't buy the same product twice. this should be dealt with on the front end
#        return Response({'error': 'Cant buy the same product twice'}, status=status.HTTP_401_UNAUTHORIZED)

#    # add products to the shopping cart
#    cart, created = ProductsInCart.objects.get_or_create(user_profile=user_profile)
#    cart.products.add(product)
#    return Response(status=status.HTTP_200_OK)

#@api_view(['POST'])
#def remove_product_from_cart(request,product_id):
#    # get product
#    try:        
#        product_to_remove = Product.objects.get(id=product_id)
#    except Product.DoesNotExist:
#        return Response(status=status.HTTP_404_NOT_FOUND)
    
#    # get UserProfile based on the token
#    token = request.data.get('token')
#    try:
#        token_obj = Token.objects.get(key=token)
#        user = User.objects.get(id=token_obj.user_id)
#        user_profile = UserProfile.objects.get(user = user)
#    except Token.DoesNotExist:
#        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
#    products_in_cart = ProductsInCart.objects.get(user_profile=user_profile)
#    # TODO
#    #  if product not in cart:
#    #     return Response({'error': 'Trying to remove a product thats not in the cart'}, status=status.HTTP_401_UNAUTHORIZED)
    
#    products_set = products_in_cart.products.all()
#    products_set = products_set.exclude(id=product_to_remove.id)

#    # Update the products_in_cart field with the updated set of products
#    products_in_cart.products.set(products_set)  

#    products_in_cart.products.remove(product_to_remove)
#    return Response(status=status.HTTP_200_OK)      
