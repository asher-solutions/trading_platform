# user/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models import User
from .serializers import UserSerializer
from .forms import UserRegistrationForm  # You'll need to create this form
from django.shortcuts import render, redirect

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['register', 'login']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['get', 'post'])
    def register(self, request):
        if request.method == 'GET':
            form = UserRegistrationForm()
            return render(request, 'registration/register.html', {'form': form})
        elif request.method == 'POST':
            # serializer = self.get_serializer(data=request.data)
            # if serializer.is_valid():
            #     user = serializer.save()
            #     return Response(serializer.data, status=status.HTTP_201_CREATED)
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            form = UserRegistrationForm(request.POST)
            if form.is_valid():
                user = form.save()
                login(request, user)
                return redirect('pages/command_center')  # or wherever you want to redirect after registration
            return render(request, 'registration/register.html', {'form': form})

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        logout(request)
        return Response({'success': 'Logged out successfully'})
