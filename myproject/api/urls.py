from django.urls import path
from . import views

urlpatterns = [
    path('register/',   views.register_user,   name='register'),
    path('login/',      views.login_user,      name='login'),
    path('profile/',    views.get_profile,     name='profile'),
    path('products/',   views.list_products,   name='product-list'),
    path('products/create/', views.create_product, name='product-create'),
    path('products/<int:product_id>/', views.get_product_detail, name='product-detail'),
    path('categories/', views.list_categories, name='category-list'),

    path('favorites/toggle/', views.toggle_favorite),
    path('favorites/', views.get_favorites),

]
