import firebase_admin
from firebase_admin import auth, credentials
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework import status

# Firebase Admin başlatma (bir kez)
# google-service-account.json dosyası yolunu ayarla
cred = credentials.Certificate("google-service-account.json")
firebase_admin.initialize_app(cred)

@api_view(['POST'])
def register_user(request):
    """
    Beklenen POST verisi:
    {
      "firebase_token": "xyz123"
    }
    """
    firebase_token = request.data.get('firebase_token')

    if not firebase_token:
        return JsonResponse({"error": "Token yok"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Firebase token doğrula
        decoded_token = auth.verify_id_token(firebase_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', '')

        # Django User olup olmadığına bak
        user, created = User.objects.get_or_create(username=uid, defaults={"email": email})
        if created:
            # Yeni oluşturuldu
            return JsonResponse({"message": "Kayıt başarılı", "uid": uid}, status=200)
        else:
            # Zaten var
            return JsonResponse({"message": "Kullanıcı zaten var", "uid": uid}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@api_view(['POST'])
def login_user(request):
    """
    Beklenen POST verisi:
    {
      "firebase_token": "xyz123"
    }
    """
    firebase_token = request.data.get('firebase_token')
    if not firebase_token:
        return JsonResponse({"error": "Token yok"}, status=400)

    try:
        decoded_token = auth.verify_id_token(firebase_token)
        uid = decoded_token['uid']

        # Kullanıcı var mı?
        user = User.objects.filter(username=uid).first()
        if user:
            return JsonResponse({"message": "Giriş başarılı", "uid": uid}, status=200)
        else:
            return JsonResponse({"error": "Kullanıcı bulunamadı"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
