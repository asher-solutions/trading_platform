"""
URL configuration for trading_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# trading_project/urls.py

from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='hero.html'), name='home'),
    path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
    path('admin/', admin.site.urls),
    path('hello-webpack/', TemplateView.as_view(template_name='hello_webpack.html')),
    path('api/', include([
        # path('user/', include('user.urls')),
        path('', include('user.urls')),  # Changed this line
        path('portfolio/', include('portfolio.urls')),
        path('datamanager/', include('datamanager.urls')),
        path('tradingapi/', include('tradingapi.urls')),
        path('developer/', include('developer.urls')),
        path('settings/', include('settings.urls')),
    ])),
    # path('accounts/login/', auth_views.LoginView.as_view(), name='login'),
    # path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('accounts/', include('django.contrib.auth.urls')),
    re_path(r'^.*', TemplateView.as_view(template_name='base.html')),
]