# developer/views.py

from rest_framework import viewsets, permissions
from .models import Component, Model, ModelComponent, Connection
from .serializers import ComponentSerializer, ModelSerializer, ModelComponentSerializer, ConnectionSerializer

class ComponentViewSet(viewsets.ModelViewSet):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ModelViewSet(viewsets.ModelViewSet):
    serializer_class = ModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Model.objects.filter(user=self.request.user)

class ModelComponentViewSet(viewsets.ModelViewSet):
    queryset = ModelComponent.objects.all()
    serializer_class = ModelComponentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]