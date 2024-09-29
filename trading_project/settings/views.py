# settings/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import UserSettings
from .serializers import UserSettingsSerializer

User = get_user_model()

class UserSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSettings.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'success': 'Password changed successfully'})

    @action(detail=False, methods=['post'])
    def change_email(self, request):
        user = request.user
        new_email = request.data.get('new_email')

        if User.objects.filter(email=new_email).exists():
            return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

        user.email = new_email
        user.save()
        return Response({'success': 'Email changed successfully'})

    @action(detail=False, methods=['post'])
    def delete_account(self, request):
        user = request.user
        password = request.data.get('password')

        if not user.check_password(password):
            return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({'success': 'Account deleted successfully'})

    @action(detail=False, methods=['get'])
    def export_data(self, request):
        # Implement data export logic here
        # This could involve generating a CSV or PDF file with user data
        return Response({'message': 'Data export not implemented yet'})