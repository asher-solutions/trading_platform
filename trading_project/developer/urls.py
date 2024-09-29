# developer/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComponentViewSet, ModelViewSet, ModelComponentViewSet, ConnectionViewSet

router = DefaultRouter()
router.register(r'components', ComponentViewSet)
router.register(r'models', ModelViewSet, basename='model')
router.register(r'model-components', ModelComponentViewSet)
router.register(r'connections', ConnectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]