# tradingapi/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BrokerAccount
from .trading_api import BaseTradingAPI, ib_decorator

class TradingAPIViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_trading_api(self, request):
        broker_account = BrokerAccount.objects.get(user=request.user)
        if broker_account.broker_name == 'Interactive Brokers':
            return ib_decorator(BaseTradingAPI)()
        # Add more conditions for other brokers
        raise ValueError("Unsupported broker")

    @action(detail=False, methods=['post'])
    def place_order(self, request):
        trading_api = self.get_trading_api(request)
        # Extract order details from request.data
        result = trading_api.place_order(symbol, quantity, order_type, price)
        return Response(result, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def account_info(self, request):
        trading_api = self.get_trading_api(request)
        result = trading_api.get_account_info()
        return Response(result)

    @action(detail=False, methods=['get'])
    def positions(self, request):
        trading_api = self.get_trading_api(request)
        result = trading_api.get_positions()
        return Response(result)

    @action(detail=False, methods=['get'])
    def orders(self, request):
        trading_api = self.get_trading_api(request)
        result = trading_api.get_orders()
        return Response(result)

    @action(detail=False, methods=['post'])
    def cancel_order(self, request):
        trading_api = self.get_trading_api(request)
        order_id = request.data.get('order_id')
        result = trading_api.cancel_order(order_id)
        return Response(result)