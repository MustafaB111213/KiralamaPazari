from django.urls import path
from . import views

urlpatterns = [
    # Kullanıcı işlemleri
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('profile/', views.get_profile, name='profile'),

    # Ürün listeleme ve oluşturma
    path('products/', views.list_products, name='product-list'),
    path('products/create/', views.create_product, name='product-create'),

    # Ürün detay, güncelleme, silme (tek bir view ile)
    path('products/<int:product_id>/', views.product_detail_operations, name='product-detail'),

    # Kategoriler
    path('categories/', views.list_categories, name='category-list'),

    # Favoriler
    path('favorites/toggle/', views.toggle_favorite),
    path('favorites/', views.get_favorites),

    # Sepet
    path('cart/toggle/', views.toggle_cart),

    # Yorumlar
    path('products/<int:product_id>/comments/', views.product_comments),

    # Benzer ürünler (isteğe bağlı ayrı endpoint olarak kalabilir)
    path('products/<int:product_id>/similar/', views.similar_products),

    # urls.py
    path('cart/', views.get_cart_items),  # ← yeni eklendi
    
    path('start-chat/', views.start_chat),
    path('chat/<int:chat_id>/', views.get_messages),
    path('chat/<int:chat_id>/send/', views.send_message),
    path('chats/', views.user_chats),

]
