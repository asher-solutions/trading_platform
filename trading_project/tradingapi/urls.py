# tradingapi/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TradingAPIViewSet

router = DefaultRouter()
router.register(r'trading', TradingAPIViewSet, basename='trading')

urlpatterns = [
    path('', include(router.urls)),
]