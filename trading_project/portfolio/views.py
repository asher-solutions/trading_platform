# portfolio/views.py

from rest_framework import viewsets, permissions
from .models import Portfolio, Trade, StockPortfolio, OptionsPortfolio, ForexPortfolio, RealEstatePortfolio
from .serializers import PortfolioSerializer, TradeSerializer, StockPortfolioSerializer, OptionsPortfolioSerializer, ForexPortfolioSerializer, RealEstatePortfolioSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class TradeViewSet(viewsets.ModelViewSet):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(portfolio__user=self.request.user)

class StockPortfolioViewSet(viewsets.ModelViewSet):
    queryset = StockPortfolio.objects.all()
    serializer_class = StockPortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class OptionsPortfolioViewSet(viewsets.ModelViewSet):
    queryset = OptionsPortfolio.objects.all()
    serializer_class = OptionsPortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class ForexPortfolioViewSet(viewsets.ModelViewSet):
    queryset = ForexPortfolio.objects.all()
    serializer_class = ForexPortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class RealEstatePortfolioViewSet(viewsets.ModelViewSet):
    queryset = RealEstatePortfolio.objects.all()
    serializer_class = RealEstatePortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)