# portfolio/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet, TradeViewSet, StockPortfolioViewSet, OptionsPortfolioViewSet, ForexPortfolioViewSet, RealEstatePortfolioViewSet

router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet)
router.register(r'trades', TradeViewSet)
router.register(r'stock-portfolios', StockPortfolioViewSet)
router.register(r'options-portfolios', OptionsPortfolioViewSet)
router.register(r'forex-portfolios', ForexPortfolioViewSet)
router.register(r'real-estate-portfolios', RealEstatePortfolioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]