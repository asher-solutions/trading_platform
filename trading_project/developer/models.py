# developer/models.py

from django.db import models
from django.conf import settings

class Component(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    code = models.TextField()
    category = models.CharField(max_length=50)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Model(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    components = models.ManyToManyField(Component, through='ModelComponent')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=[
        ('DRAFT', 'Draft'),
        ('BETA', 'Beta'),
        ('ALPHA', 'Alpha'),
        ('PRODUCTION', 'Production')
    ])
    is_public = models.BooleanField(default=False)
    version = models.PositiveIntegerField(default=1)
    parent_version = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='child_versions')

class ModelComponent(models.Model):
    model = models.ForeignKey(Model, on_delete=models.CASCADE)
    component = models.ForeignKey(Component, on_delete=models.CASCADE)
    position_x = models.IntegerField()
    position_y = models.IntegerField()

class Connection(models.Model):
    model = models.ForeignKey(Model, on_delete=models.CASCADE)
    from_component = models.ForeignKey(ModelComponent, on_delete=models.CASCADE, related_name='connections_from')
    to_component = models.ForeignKey(ModelComponent, on_delete=models.CASCADE, related_name='connections_to')

class SharedModel(models.Model):
    model = models.ForeignKey(Model, on_delete=models.CASCADE)
    shared_with = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    can_edit = models.BooleanField(default=False)
    shared_at = models.DateTimeField(auto_now_add=True)