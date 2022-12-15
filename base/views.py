from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core.paginator import Paginator
from django.db.models import Q, F
from django.contrib import messages
from .models import Product, User, Supplier
from .forms import ProductForm, SignUpForm
from django.db.models.query import QuerySet


# Create your views here.


def loginPage(request):
    page = 'login'

    # If user is loged in, and tries to go to the login page, redirect the user to home page.
    if request.user.is_authenticated:
        return redirect('home')

    # This means 'if users enter their information and send the information to the backend'.
    if request.method == 'POST':
        username_or_email = request.POST.get('username_or_email')
        password = request.POST.get('password')

        user = authenticate(request, username_or_email = username_or_email, password = password)

        if user is not None:
            # login() adds the session of the user in the database, and allows the user to be loged in.
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Username or password does not exist.')

    context = {'page' : page}
    return render(request, 'base/login_register.html', context)


def logoutUser(request):
    logout(request)
    return redirect('home')


def registerPage(request):
    page = 'register'
    form = SignUpForm()

    if request.method == 'POST':
        # In this case, request.POST returns all the sign-up information from the user in QueryDict.
        form = SignUpForm(request.POST)
        if form.is_valid():
            # Basically accessing the data for customization before saving it to the database - If you call save() with commit=False, then it will return an object that hasn’t yet been saved to the database. In this case, it’s up to you to call save() on the resulting model instance. This is useful if you want to do custom processing on the object before saving it, or if you want to use one of the specialized model saving options.
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'An error has occurred during registration.')

    context = {
        'page' : page,
        'form' : form,
    }
    return render(request, 'base/login_register.html', context)


@login_required(login_url='login')
def home(request):
    context = {}
    return render(request, 'base/home.html', context)


@login_required(login_url='login')
def productsPage(request):
    products = Product.objects.all()

    # For inital table pagination upon entring 'products'.
    paginator = Paginator(products, 10)
    page_number = request.GET.get('page') if request.GET.get('page') != None else '1'
    page = paginator.get_page(page_number)

    # For deleting one product only.
    if 'delete'in request.GET:
        product_number = request.GET.getlist('delete')
        Product.objects.filter(number__in=product_number).delete()

    # For table search and pagination.
    if 'q' in request.GET :
        return JsonResponse(productTable(request))
    
    context = {
        'page' : page,
        'products' : products
    }
    return render(request, 'base/products.html', context)


@login_required(login_url='login')
def productTable(request):

    # Filter products based on search query 'q'.
    suppliers = Supplier.objects.all()
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    try:
        products = Product.objects.filter(
            Q(number__icontains=q) |
            Q(description__icontains=q) |
            Q(supplier__name__icontains=q)|
            Q(cost_price=float(q)) |
            Q(selling_price=float(q)) |
            Q(unit__icontains=q)
        )
    except ValueError:
        products = Product.objects.filter(
            Q(number__icontains=q) |
            Q(description__icontains=q) |
            Q(supplier__name__icontains=q) |
            Q(unit__icontains=q)
        )

    # Sort products based on sort query 'sort'.
    sort = request.GET.get('sort') if request.GET.get('sort') != None else ''
    if sort:
        print(type(sort))
        print(sort)
        products = products.order_by(sort)
        print(products)
    
    paginator = Paginator(products, 10)
    page_number = request.GET.get('page') if request.GET.get('page') != None else '1'
    page = paginator.get_page(page_number)
    print(paginator.num_pages)

    response ={
        "number" : page.number,
        "total_number" : paginator.num_pages,
        "page_range" : list(page.paginator.page_range),
        "object_list" : list(page.object_list.values_list()),
        "suppliers" : list(suppliers.values_list()),
    }
    return response


@login_required(login_url='login')
def createProduct(request):
    form = ProductForm()
    products = Product.objects.all()
    suppliers = Supplier.objects.all()

    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('products')
        else:
            messages.error(request, 'Invalid input. Please try again.')

    context = {
        'form' : form,
        'products' : products,
        'suppliers' : suppliers,
    }
    return render(request, 'base/product_form.html', context)


@login_required(login_url='login')
def updateProduct(request, pk):
    product = Product.objects.get(id=pk)
    form = ProductForm(instance=product)
    suppliers = Supplier.objects.all()
    selected_supplier = product.supplier.name

    # When the user updates the details of the Room, similar things happen as when user creates a Room.
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('products')
        else:
            messages.error(request, 'Invalid input. Please try again.')

    context = {
        'product' : product,
        'form' : form,
        'suppliers' : suppliers,
        'selected_supplier' : selected_supplier,
    }
    return render(request, 'base/product_form.html', context)