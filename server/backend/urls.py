from django.contrib import admin
from django.urls import path, re_path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),    

    re_path(r'^api/users$', views.users_list),
    path('api/users/<str:username>', views.users_detail),

    re_path(r'^api/products$', views.products_list),        
    path('api/products/<str:product_id>', views.products_detail),
    path('api/products_by_category/<str:category>/<str:status>', views.products_by_category),

    path('api/submit_review/<str:product_id>', views.submit_review),

    path('api/checkout2', views.checkout2),
    
    path('api/login', views.LoginView.as_view()),       
    
    path('api/get_user_data', views.UserProfileView.as_view()),
   
    path('api/chatbot', views.chatbot),
    

    
       
    
]