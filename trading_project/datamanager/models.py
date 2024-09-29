# datamanager/models.py

from django.db import models

class DataSource(models.Model):
    name = models.CharField(max_length=100)
    config = models.JSONField()  # Stores configuration for different data sources

class StockData(models.Model):
    ticker = models.CharField(max_length=10)
    date = models.DateTimeField()
    open = models.DecimalField(max_digits=10, decimal_places=2)
    high = models.DecimalField(max_digits=10, decimal_places=2)
    low = models.DecimalField(max_digits=10, decimal_places=2)
    close = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.BigIntegerField()

class OptionData(models.Model):
    underlying = models.CharField(max_length=10)
    expiration = models.DateField()
    strike = models.DecimalField(max_digits=10, decimal_places=2)
    option_type = models.CharField(max_length=4, choices=[('CALL', 'Call'), ('PUT', 'Put')])
    date = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.BigIntegerField()
    open_interest = models.BigIntegerField()

class ForexData(models.Model):
    pair = models.CharField(max_length=10)
    date = models.DateTimeField()
    open = models.DecimalField(max_digits=10, decimal_places=5)
    high = models.DecimalField(max_digits=10, decimal_places=5)
    low = models.DecimalField(max_digits=10, decimal_places=5)
    close = models.DecimalField(max_digits=10, decimal_places=5)
    volume = models.BigIntegerField()

class CryptoData(models.Model):
    symbol = models.CharField(max_length=10)
    date = models.DateTimeField()
    open = models.DecimalField(max_digits=20, decimal_places=8)
    high = models.DecimalField(max_digits=20, decimal_places=8)
    low = models.DecimalField(max_digits=20, decimal_places=8)
    close = models.DecimalField(max_digits=20, decimal_places=8)
    volume = models.BigIntegerField()