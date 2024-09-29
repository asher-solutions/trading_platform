# tradingapi/models.py

from django.db import models

class BrokerAccount(models.Model):
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)
    broker_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=100)
    api_key = models.CharField(max_length=255)
    api_secret = models.CharField(max_length=255)