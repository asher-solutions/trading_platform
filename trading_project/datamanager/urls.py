# datamanager/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DataSourceViewSet, StockDataViewSet, OptionDataViewSet, ForexDataViewSet, CryptoDataViewSet

router = DefaultRouter()
router.register(r'data-sources', DataSourceViewSet)
router.register(r'stock-data', StockDataViewSet)
router.register(r'option-data', OptionDataViewSet)
router.register(r'forex-data', ForexDataViewSet)
router.register(r'crypto-data', CryptoDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
]