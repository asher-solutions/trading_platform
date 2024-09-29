# developer/serializers.py

from rest_framework import serializers
from .models import Component, Model, ModelComponent, Connection

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = '__all__'

class ModelComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelComponent
        fields = '__all__'

class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = '__all__'

class ModelSerializer(serializers.ModelSerializer):
    components = ModelComponentSerializer(source='modelcomponent_set', many=True, read_only=True)
    connections = ConnectionSerializer(many=True, read_only=True)

    class Meta:
        model = Model
        fields = '__all__'