# settings/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserSettingsViewSet

router = DefaultRouter()
router.register(r'user-settings', UserSettingsViewSet, basename='user-settings')

urlpatterns = [
    path('', include(router.urls)),
]