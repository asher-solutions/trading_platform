# settings/models.py

from django.db import models
from django.conf import settings

class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    theme = models.CharField(max_length=20, choices=[('LIGHT', 'Light'), ('DARK', 'Dark')], default='LIGHT')
    email_notifications = models.BooleanField(default=True)
    two_factor_auth = models.BooleanField(default=False)