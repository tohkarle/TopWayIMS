from django import forms
from django.forms import ModelForm
from .models import Product, User
from django.contrib.auth.forms import UserCreationForm


class ProductForm(ModelForm):
    class Meta:
        model = Product
        fields = '__all__'


class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']