from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.registerPage, name="register"),

    path('', views.home, name='home'),
    path('products/', views.productsPage, name='products'),
    path('create-product/', views.createProduct, name='create-product'),
    path('update-product/<str:pk>/', views.updateProduct, name='update-product'),
]
