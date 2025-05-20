from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    owner      = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model  = Item
        fields = [
            'id',
            'title',
            'description',
            'price_per_day',
            'image',
            'category',
            'created_at',
            'owner',
            'owner_name',
        ]

    def get_owner_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}" if obj.owner else "Bilinmiyor"
