from django.urls import include, path
from . import views


urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('profile/', views.get_profile, name='profile'),
    path('products/<int:product_id>/', views.get_product_detail, name='product-detail'),
    path('products/create/', views.create_product),
    path('products/', views.list_products),

]
