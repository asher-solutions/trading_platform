# user/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
from datetime import date

def limit_age_18():
    today = date.today()
    return date(year=today.year - 18, month=today.month, day=today.day)

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    date_of_birth = models.DateField(validators=[MinValueValidator(limit_value=limit_age_18)])
    brokerage = models.CharField(max_length=100)
    brokerage_username = models.CharField(max_length=100)
    brokerage_password = models.CharField(max_length=100)  # Note: In production, use encryption for storing sensitive data
    subscription_tier = models.CharField(max_length=20, choices=[
        ('STANDARD', 'Standard'),
        ('PREMIUM', 'Premium'),
        ('PREMIUM_PLUS', 'Premium Plus')
    ])
    agreed_to_terms = models.BooleanField(default=False)

    def __str__(self):
        return self.username