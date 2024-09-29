# portfolio/serializers.py

from rest_framework import serializers
from .models import Portfolio, Trade, StockPortfolio, OptionsPortfolio, ForexPortfolio, RealEstatePortfolio

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = '__all__'

class PortfolioSerializer(serializers.ModelSerializer):
    trades = TradeSerializer(many=True, read_only=True)
    win_loss_ratio = serializers.FloatField(read_only=True)

    class Meta:
        model = Portfolio
        fields = '__all__'

class StockPortfolioSerializer(PortfolioSerializer):
    class Meta:
        model = StockPortfolio
        fields = '__all__'

class OptionsPortfolioSerializer(PortfolioSerializer):
    class Meta:
        model = OptionsPortfolio
        fields = '__all__'

class ForexPortfolioSerializer(PortfolioSerializer):
    class Meta:
        model = ForexPortfolio
        fields = '__all__'

class RealEstatePortfolioSerializer(PortfolioSerializer):
    class Meta:
        model = RealEstatePortfolio
        fields = '__all__'