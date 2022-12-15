from django.db import models
from colorfield.fields import ColorField
from django.contrib.auth.models import AbstractUser


# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True, null=True)
    avatar = models.ImageField(null=True, default="avatar.svg")
    # USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username


class Product(models.Model):
    number = models.CharField(unique=True, max_length=255)
    description = models.TextField()
    cost_price = models.DecimalField(max_digits=5, decimal_places=2)
    selling_price = models.DecimalField(max_digits=5, decimal_places=2)
    unit = models.CharField(max_length=255)
    skip_counter = models.BooleanField(default=False)
    supplier = models.ForeignKey('Supplier', on_delete=models.SET_NULL, null=True)
    photo = models.ImageField(null=True, default="avatar.svg")
    color_code = models.TextField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-updated', '-created']


class Supplier(models.Model):
    name = models.CharField(max_length=255, null=True, unique=True, blank=True)

    def __str__(self):
        return self.name