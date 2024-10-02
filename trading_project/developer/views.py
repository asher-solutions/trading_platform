# developer/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Component, Model, ModelComponent, Connection, SharedModel
from .serializers import (
    ComponentSerializer,
    ModelSerializer,
    ModelComponentSerializer,
    ConnectionSerializer,
    SharedModelSerializer
)
import json
from django.http import JsonResponse
import pandas as pd
import numpy as np
from django.contrib.auth import get_user_model

User = get_user_model()

class ComponentViewSet(viewsets.ModelViewSet):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ModelViewSet(viewsets.ModelViewSet):
    serializer_class = ModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Model.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def export_model(self, request, pk=None):
        model = self.get_object()
        model_data = {
            'name': model.name,
            'description': model.description,
            'components': [
                {
                    'type': mc.component.name,
                    'x': mc.position_x,
                    'y': mc.position_y,
                    'config': json.loads(mc.component.code)
                } for mc in model.modelcomponent_set.all()
            ],
            'connections': [
                {
                    'from': c.from_component.component.name,
                    'to': c.to_component.component.name
                } for c in model.connection_set.all()
            ]
        }
        return JsonResponse(model_data)

    @action(detail=False, methods=['post'])
    def import_model(self, request):
        model_data = request.data
        new_model = Model.objects.create(
            user=request.user,
            name=model_data['name'],
            description=model_data.get('description', '')
        )

        component_map = {}
        for comp_data in model_data['components']:
            component = Component.objects.get(name=comp_data['type'])
            model_component = ModelComponent.objects.create(
                model=new_model,
                component=component,
                position_x=comp_data['x'],
                position_y=comp_data['y']
            )
            component_map[comp_data['type']] = model_component

        for conn_data in model_data['connections']:
            Connection.objects.create(
                model=new_model,
                from_component=component_map[conn_data['from']],
                to_component=component_map[conn_data['to']]
            )

        return Response({'id': new_model.id}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def run_backtest(self, request, pk=None):
        pass
        # model = self.get_object()
        # start_date = request.data.get('start_date')
        # end_date = request.data.get('end_date')
        # symbol = request.data.get('symbol')

        # # Fetch historical data (you'll need to implement this function)
        # historical_data = fetch_historical_data(symbol, start_date, end_date)

        # # Run the model on historical data (you'll need to implement this function)
        # results = run_model_on_data(model, historical_data)

        # # Calculate performance metrics
        # total_return = ((results['portfolio_value'][-1] / results['portfolio_value'][0]) - 1) * 100
        # sharpe_ratio = calculate_sharpe_ratio(results['returns'])
        # max_drawdown = calculate_max_drawdown(results['portfolio_value'])

        # return Response({
        #     'total_return': total_return,
        #     'sharpe_ratio': sharpe_ratio,
        #     'max_drawdown': max_drawdown,
        #     'equity_curve': results['portfolio_value'].tolist(),
        #     'trades': results['trades']
        # }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def create_new_version(self, request, pk=None):
        original_model = self.get_object()
        new_version = Model.objects.create(
            user=request.user,
            name=original_model.name,
            description=original_model.description,
            version=original_model.version + 1,
            parent_version=original_model
        )

        # Copy components and connections
        for model_component in original_model.modelcomponent_set.all():
            ModelComponent.objects.create(
                model=new_version,
                component=model_component.component,
                position_x=model_component.position_x,
                position_y=model_component.position_y
            )

        for connection in original_model.connection_set.all():
            Connection.objects.create(
                model=new_version,
                from_component=connection.from_component,
                to_component=connection.to_component
            )

        return Response({'id': new_version.id, 'version': new_version.version}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def share_model(self, request, pk=None):
        model = self.get_object()
        shared_with_username = request.data.get('shared_with')
        can_edit = request.data.get('can_edit', False)

        try:
            shared_with_user = User.objects.get(username=shared_with_username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        shared_model, created = SharedModel.objects.get_or_create(
            model=model,
            shared_with=shared_with_user,
            defaults={'can_edit': can_edit}
        )

        if not created:
            shared_model.can_edit = can_edit
            shared_model.save()

        return Response({'status': 'Model shared successfully'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def shared_with_me(self, request):
        shared_models = SharedModel.objects.filter(shared_with=request.user)
        serializer = SharedModelSerializer(shared_models, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_component(self, request, pk=None):
        model = self.get_object()
        component_data = request.data
        component = Component.objects.create(**component_data)
        ModelComponent.objects.create(model=model, component=component, position_x=component_data.get('x', 0), position_y=component_data.get('y', 0))
        return Response({'status': 'Component added'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def remove_component(self, request, pk=None):
        model = self.get_object()
        component_id = request.data.get('component_id')
        ModelComponent.objects.filter(model=model, component_id=component_id).delete()
        return Response({'status': 'Component removed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def add_connection(self, request, pk=None):
        model = self.get_object()
        from_component_id = request.data.get('from_component_id')
        to_component_id = request.data.get('to_component_id')
        from_component = ModelComponent.objects.get(model=model, component_id=from_component_id)
        to_component = ModelComponent.objects.get(model=model, component_id=to_component_id)
        Connection.objects.create(model=model, from_component=from_component, to_component=to_component)
        return Response({'status': 'Connection added'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def remove_connection(self, request, pk=None):
        model = self.get_object()
        connection_id = request.data.get('connection_id')
        Connection.objects.filter(model=model, id=connection_id).delete()
        return Response({'status': 'Connection removed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def save_model(self, request, pk=None):
        model = self.get_object()
        components_data = request.data.get('components', [])
        connections_data = request.data.get('connections', [])

        # Clear existing components and connections
        model.modelcomponent_set.all().delete()
        model.connection_set.all().delete()

        # Create new components
        for comp_data in components_data:
            component = Component.objects.create(name=comp_data['type'])
            ModelComponent.objects.create(
                model=model,
                component=component,
                position_x=comp_data['x'],
                position_y=comp_data['y']
            )

        # Create new connections
        for conn_data in connections_data:
            from_component = ModelComponent.objects.get(model=model, component__name=conn_data['from'])
            to_component = ModelComponent.objects.get(model=model, component__name=conn_data['to'])
            Connection.objects.create(
                model=model,
                from_component=from_component,
                to_component=to_component
            )

        return Response({'status': 'Model saved successfully'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def load_model(self, request, pk=None):
        model = self.get_object()
        components = model.modelcomponent_set.all()
        connections = model.connection_set.all()

        components_data = [
            {
                'id': comp.id,
                'type': comp.component.name,
                'x': comp.position_x,
                'y': comp.position_y
            } for comp in components
        ]

        connections_data = [
            {
                'id': conn.id,
                'from': conn.from_component.component.name,
                'to': conn.to_component.component.name
            } for conn in connections
        ]

        return Response({
            'components': components_data,
            'connections': connections_data
        }, status=status.HTTP_200_OK)

class ModelComponentViewSet(viewsets.ModelViewSet):
    queryset = ModelComponent.objects.all()
    serializer_class = ModelComponentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

def calculate_sharpe_ratio(returns, risk_free_rate=0.02):
    excess_returns = returns - risk_free_rate / 252  # Assuming daily returns
    return np.sqrt(252) * excess_returns.mean() / excess_returns.std()

def calculate_max_drawdown(equity_curve):
    peak = equity_curve[0]
    max_drawdown = 0
    for value in equity_curve:
        if value > peak:
            peak = value
        drawdown = (peak - value) / peak
        if drawdown > max_drawdown:
            max_drawdown = drawdown
    return max_drawdown * 100