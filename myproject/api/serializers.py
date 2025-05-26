from rest_framework import serializers
from .models import Item
from .models import Comment

class ItemSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    owner      = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model  = Item
        fields = [
            'id', 'title', 'description', 'price_per_day', 'image',
            'category', 'created_at', 'owner', 'owner_name', 'return_policy'  # Yeni
        ]

    def get_owner_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}" if obj.owner else "Bilinmiyor"

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user_name', 'text', 'rating', 'created_at']