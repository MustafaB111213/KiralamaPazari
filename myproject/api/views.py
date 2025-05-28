from .models import Message  
from django.db.models import Q
import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import auth, credentials
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import CartItem, ChatRoom, Item, Message
from .serializers import ItemSerializer
from .models import Favorite

from .models import Comment
from .serializers import CommentSerializer

from difflib import SequenceMatcher
from rest_framework.parsers import JSONParser

# Firebase Admin tek seferlik başlatma
cred = credentials.Certificate("google-service-account.json")
firebase_admin.initialize_app(cred)

@api_view(['GET'])
def list_products(request):
    search_query = request.GET.get('search', '')
    category_filter = request.GET.get('category', '')

    items = Item.objects.all()

    # 🔒 GİRİŞ YAPMIŞ KULLANICIYSA KENDİ ÜRÜNLERİNİ FİLTRELE
    user = get_user_from_request(request)
    if user:
        items = items.exclude(owner=user)

    if search_query:
        items = items.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__icontains=search_query)
        )

    if category_filter:
        items = items.filter(category__iexact=category_filter)

    items = items.order_by('-id')
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def list_categories(request):
    cats = (
        Item.objects
        .values_list('category', flat=True)
        .distinct()
        .order_by('category')
    )
    return Response(cats)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_product_detail(request, product_id):
    product = get_object_or_404(Item, id=product_id)
    serializer = ItemSerializer(product)

    # 🔐 Giriş yapan kullanıcı ürünü ekleyen mi?
    user = get_user_from_request(request)
    is_owner = user == product.owner if user else False

    # Benzer ürünleri bul
    all_items = Item.objects.exclude(id=product_id)
    similar_items = []

    for item in all_items:
        category_score = 1.0 if item.category == product.category else 0.0
        title_score = SequenceMatcher(None, product.title.lower(), item.title.lower()).ratio()
        combined_score = (category_score * 0.6) + (title_score * 0.4)

        if combined_score > 0.4:
            similar_items.append((combined_score, item))

    similar_items.sort(key=lambda x: x[0], reverse=True)
    top_similar = [x[1] for x in similar_items[:4]]
    similar_serialized = ItemSerializer(top_similar, many=True)

    return Response({
        "product": serializer.data,
        "similar_products": similar_serialized.data,
        "is_owner": is_owner  # 👈 Yeni alan
    })

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create_product(request):
    firebase_token = request.headers.get("Authorization", "").replace("Bearer ", "")
    owner = None
    if firebase_token:
        try:
            decoded_token = auth.verify_id_token(firebase_token)
            uid = decoded_token['uid']
            owner = User.objects.filter(username=uid).first()
        except Exception:
            pass
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=owner)
        return Response({'message': 'Ürün başarıyla eklendi.', 'data': serializer.data})
    return Response(serializer.errors, status=400)

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_profile(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({"error": "Token eksik"}, status=400)
    token = auth_header.split(' ')[1]
    try:
        decoded = auth.verify_id_token(token)
        user = User.objects.filter(username=decoded['uid']).first()
        if not user:
            return JsonResponse({"error": "Kullanıcı bulunamadı"}, status=404)
        items = Item.objects.filter(owner=user).order_by('-id')
        return JsonResponse({
            "firstName": user.first_name,
            "lastName":  user.last_name,
            "email":     user.email,
            "items":     ItemSerializer(items, many=True).data
        }, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def register_user(request):
    firebase_token = request.data.get('firebase_token')
    first_name     = request.data.get('firstName')
    last_name      = request.data.get('lastName')

    if not firebase_token:
        return JsonResponse({"error": "Token yok"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        decoded = auth.verify_id_token(firebase_token)

        # Güvenli email çekme
        email = decoded.get('email', '')
        if not isinstance(email, str):
            email = ''

        user, created = User.objects.get_or_create(
            username=decoded['uid'],
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name
            }
        )
        msg = "Kayıt başarılı" if created else "Kullanıcı zaten var"
        return JsonResponse({"message": msg, "uid": user.username}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
@api_view(['POST'])
def login_user(request):
    firebase_token = request.data.get('firebase_token')
    if not firebase_token:
        return JsonResponse({"error": "Token yok"}, status=400)

    try:
        decoded = auth.verify_id_token(firebase_token)

        # Güvenli email çekme
        raw_email = decoded.get('email', '')
        email = raw_email if isinstance(raw_email, str) else ''

        user = User.objects.filter(username=decoded['uid']).first()
        if not user:
            return JsonResponse({"error": "Kullanıcı bulunamadı"}, status=404)

        return JsonResponse({
            "message": "Giriş başarılı",
            "uid": user.username,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "email": user.email or email
        }, status=200)

    except auth.InvalidIdTokenError:
        return JsonResponse({"error": "Geçersiz Firebase token"}, status=400)
    except auth.ExpiredIdTokenError:
        return JsonResponse({"error": "Süresi geçmiş Firebase token"}, status=401)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(['POST'])
def toggle_favorite(request):
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=403)

    item_id = request.data.get('item_id')
    item = get_object_or_404(Item, id=item_id)

    favorite, created = Favorite.objects.get_or_create(user=user, item=item)
    if not created:
        favorite.delete()
        return Response({'status': 'removed'})
    return Response({'status': 'added'})

@api_view(['GET'])
def get_favorites(request):
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=403)

    favorites = Favorite.objects.filter(user=user).select_related('item')
    items = [f.item for f in favorites]
    serialized = ItemSerializer(items, many=True)
    return Response(serialized.data)


def get_user_from_request(request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.replace("Bearer ", "")
    try:
        decoded = firebase_auth.verify_id_token(token)
        uid = decoded.get("uid")
        return User.objects.get(username=uid)
    except Exception as e:
        print("Firebase token error:", str(e))
        return None
    
@api_view(['POST'])
def toggle_cart(request):
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=403)

    item_id = request.data.get('item_id')
    item = get_object_or_404(Item, id=item_id)

    # 🔒 KENDİ ÜRÜNÜNÜ EKLEME KISITI
    if item.owner == user:
        return Response({'error': 'Kendi ürününüzü sepete ekleyemezsiniz'}, status=400)

    cart_item, created = CartItem.objects.get_or_create(user=user, item=item)
    if not created:
        cart_item.delete()
        return Response({'status': 'removed'})
    return Response({'status': 'added'})



@api_view(['GET', 'POST'])
def product_comments(request, product_id):
    if request.method == 'GET':
        comments = Comment.objects.filter(item_id=product_id).order_by('-created_at')
        return Response(CommentSerializer(comments, many=True).data)

    if request.method == 'POST':
        user = get_user_from_request(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=403)

        text = request.data.get("text")
        rating = request.data.get("rating")

        if not text or not rating:
            return Response({'error': 'Yorum veya puan eksik'}, status=400)

        Comment.objects.create(
            user=user,
            item_id=product_id,
            text=text,
            rating=rating
        )

        return Response({'message': 'Yorum eklendi'}, status=201)

@api_view(['GET'])
@permission_classes([AllowAny])
def similar_products(request, product_id):
    try:
        product = Item.objects.get(id=product_id)
        similar = Item.objects.filter(category=product.category).exclude(id=product.id)[:6]
        serializer = ItemSerializer(similar, many=True)
        return Response(serializer.data)
    except Item.DoesNotExist:
        return Response({'error': 'Ürün bulunamadı'}, status=404)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    user = request.user
    item = get_object_or_404(Item, id=product_id, owner=user)
    item.delete()
    return Response({'message': 'Ürün silindi'}, status=204)

@api_view(['GET', 'PUT', 'DELETE'])
def product_detail_operations(request, product_id):
    try:
        product = get_object_or_404(Item, id=product_id)
    except:
        return Response({'error': 'Ürün bulunamadı'}, status=404)

    # ✅ ÜRÜN GETİRME + BENZER ÜRÜNLERİ HESAPLAMA
    if request.method == 'GET':
        serializer = ItemSerializer(product)

        # Benzer ürünleri bul
        all_items = Item.objects.exclude(id=product_id)
        similar_items = []

        for item in all_items:
            category_score = 1.0 if item.category == product.category else 0.0
            title_score = SequenceMatcher(None, product.title.lower(), item.title.lower()).ratio()
            combined_score = (category_score * 0.6) + (title_score * 0.4)

            if combined_score > 0.4:
                similar_items.append((combined_score, item))

        similar_items.sort(key=lambda x: x[0], reverse=True)
        top_similar = [x[1] for x in similar_items[:4]]
        similar_serialized = ItemSerializer(top_similar, many=True)

        return Response({
            "product": serializer.data,
            "similar_products": similar_serialized.data
        })

    # ✅ ÜRÜN GÜNCELLEME
    if request.method == 'PUT':
        serializer = ItemSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Güncellendi', 'data': serializer.data})
        return Response(serializer.errors, status=400)

    # ✅ ÜRÜN SİLME
    if request.method == 'DELETE':
        user = get_user_from_request(request)
        if product.owner != user:
            return Response({'error': 'Yetkisiz'}, status=403)
        product.delete()
        return Response({'message': 'Ürün silindi'}, status=204)


# views.py
@api_view(['GET'])
def get_cart_items(request):
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=403)

    cart_items = CartItem.objects.filter(user=user).select_related('item')
    items = [ci.item for ci in cart_items]
    serialized = ItemSerializer(items, many=True)
    return Response(serialized.data)
@api_view(['POST'])
@parser_classes([JSONParser])
def start_chat(request):
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=403)

    item_id = request.data.get('item_id')
    if not item_id:
        return Response({'error': 'item_id eksik'}, status=400)

    item = get_object_or_404(Item, id=item_id)
    seller = item.owner

    if user == seller:
        return Response({"error": "Kendi ürününüzle sohbet başlatamazsınız."}, status=400)

    room, created = ChatRoom.objects.get_or_create(item=item, buyer=user, seller=seller)
    return Response({"chat_id": room.id})

@api_view(['GET'])
def get_messages(request, chat_id):
    user = get_user_from_request(request)
    if not user:
        return Response({"error": "Unauthorized"}, status=403)

    room = get_object_or_404(ChatRoom, id=chat_id)
    if user not in [room.buyer, room.seller]:
        return Response({"error": "Yetkisiz erişim."}, status=403)

    messages = room.messages.order_by('created_at')
    return Response([
    {
        "sender": msg.sender.first_name,
        "content": msg.content,
        "created_at": msg.created_at,
        "is_self": msg.sender == user
    }
    for msg in messages
])



@api_view(['POST'])
@parser_classes([JSONParser])
def send_message(request, chat_id):
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=403)

    room = get_object_or_404(ChatRoom, id=chat_id)
    if user not in [room.buyer, room.seller]:
        return Response({'error': 'Yetkisiz erişim'}, status=403)

    content = request.data.get("content", "").strip()
    if not content:
        return Response({'error': 'Mesaj içeriği boş'}, status=400)

    Message.objects.create(room=room, sender=user, content=content)
    return Response({'message': 'Mesaj gönderildi'}, status=201)

@api_view(['GET'])
def user_chats(request):
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=403)

    rooms = ChatRoom.objects.filter(Q(buyer=user) | Q(seller=user)).select_related('item', 'buyer', 'seller')
    
    result = []
    for room in rooms:
        last_msg = room.messages.order_by('-created_at').first()
        result.append({
            'chat_id': room.id,
            'item_title': room.item.title,
            'other_user': room.buyer.first_name if room.seller == user else room.seller.first_name,
            'last_message': last_msg.content if last_msg else '',
            'last_sender': last_msg.sender.first_name if last_msg else '',
            'unread': last_msg and last_msg.sender != user  # basit unread mantığı
        })
    
    return Response(result)
