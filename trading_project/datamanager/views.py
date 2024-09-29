# datamanager/views.py

from rest_framework import viewsets, permissions
from .models import DataSource, StockData, OptionData, ForexData, CryptoData
from .serializers import DataSourceSerializer, StockDataSerializer, OptionDataSerializer, ForexDataSerializer, CryptoDataSerializer

class DataSourceViewSet(viewsets.ModelViewSet):
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

class StockDataViewSet(viewsets.ModelViewSet):
    queryset = StockData.objects.all()
    serializer_class = StockDataSerializer
    permission_classes = [permissions.IsAuthenticated]

class OptionDataViewSet(viewsets.ModelViewSet):
    queryset = OptionData.objects.all()
    serializer_class = OptionDataSerializer
    permission_classes = [permissions.IsAuthenticated]

class ForexDataViewSet(viewsets.ModelViewSet):
    queryset = ForexData.objects.all()
    serializer_class = ForexDataSerializer
    permission_classes = [permissions.IsAuthenticated]

class CryptoDataViewSet(viewsets.ModelViewSet):
    queryset = CryptoData.objects.all()
    serializer_class = CryptoDataSerializer
    permission_classes = [permissions.IsAuthenticated]