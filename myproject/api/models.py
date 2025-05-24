from django.db import models
from django.contrib.auth.models import User

class Item(models.Model):
    title         = models.CharField(max_length=100)
    description   = models.TextField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    image         = models.ImageField(upload_to='product_images/')
    category      = models.CharField(max_length=50, default="Genel")
    owner         = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'item')

    def __str__(self):
        return f"{self.user.username} favorited {self.item.title}"
