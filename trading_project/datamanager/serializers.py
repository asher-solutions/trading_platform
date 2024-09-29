# datamanager/serializers.py

from rest_framework import serializers
from .models import DataSource, StockData, OptionData, ForexData, CryptoData

class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = '__all__'

class StockDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockData
        fields = '__all__'

class OptionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptionData
        fields = '__all__'

class ForexDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForexData
        fields = '__all__'

class CryptoDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CryptoData
        fields = '__all__'