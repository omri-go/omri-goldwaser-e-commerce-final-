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
    #path('api/add_product_to_cart/<int:product_id>', views.add_product_to_cart),
    #path('api/remove_product_from_cart/<int:product_id>', views.remove_product_from_cart),

    path('api/submit_review/<str:product_id>', views.submit_review),

    #path('api/checkout', views.checkout),
    path('api/checkout2', views.checkout2),
    
    path('api/login', views.LoginView.as_view()),       
    
    # TODO check which of those can be removed
    path('api/get_user_data', views.UserProfileView.as_view()),
    #re_path(r'^api/users2$', views.getUsers2.as_view()),

    path('api/chatbot', views.chatbot),
    

    
       
    
]