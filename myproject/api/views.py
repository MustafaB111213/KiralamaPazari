import firebase_admin
from firebase_admin import auth, credentials
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny

# Firebase Admin başlatma (bir kez)
# google-service-account.json dosyası yolunu ayarla
cred = credentials.Certificate("google-service-account.json")
firebase_admin.initialize_app(cred)

@api_view(['POST'])
def register_user(request):
    """
    Beklenen POST verisi:
    {
      "firebase_token": "xyz123",
      "firstName": "Mustafa",
      "lastName": "Yılmaz"
    }
    """
    firebase_token = request.data.get('firebase_token')
    first_name = request.data.get('firstName')
    last_name = request.data.get('lastName')

    if not firebase_token:
        return JsonResponse({"error": "Token yok"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        decoded_token = auth.verify_id_token(firebase_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', '')

        user, created = User.objects.get_or_create(username=uid, defaults={
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
        })

        if created:
            return JsonResponse({"message": "Kayıt başarılı", "uid": uid}, status=200)
        else:
            return JsonResponse({"message": "Kullanıcı zaten var", "uid": uid}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def login_user(request):
    """
    Beklenen POST verisi:
    {
      "firebase_token": "xyz123"
    }
    Cevap JSON:
    {
      "message": "Giriş başarılı",
      "uid": "wznigd...",
      "firstName": "Mustafa",
      "lastName": "Yılmaz",
      "email": "moss@gmail.com"
    }
    """
    firebase_token = request.data.get('firebase_token')
    if not firebase_token:
        return JsonResponse({"error": "Token yok"}, status=400)

    try:
        decoded_token = auth.verify_id_token(firebase_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', '')

        user = User.objects.filter(username=uid).first()
        if not user:
            return JsonResponse({"error": "Kullanıcı bulunamadı"}, status=404)

        # Burada şablon amaçlı döneceğimiz veri
        return JsonResponse({
            "message": "Giriş başarılı",
            "uid": uid,
            "firstName": user.first_name or "",
            "lastName": user.last_name or "",
            "email": user.email or email,
        }, status=200)

    except auth.InvalidIdTokenError:
        return JsonResponse({"error": "Geçersiz Firebase token"}, status=400)
    except auth.ExpiredIdTokenError:
        return JsonResponse({"error": "Süresi geçmiş Firebase token"}, status=401)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_profile(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({"error": "Token eksik"}, status=400)

    firebase_token = auth_header.split(' ')[1]

    try:
        decoded_token = auth.verify_id_token(firebase_token)
        uid = decoded_token['uid']

        user = User.objects.filter(username=uid).first()
        if user:
            return JsonResponse({
                "firstName": user.first_name,
                "lastName": user.last_name,
                "email": user.email,
            }, status=200)
        else:
            return JsonResponse({"error": "Kullanıcı bulunamadı"}, status=404)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)