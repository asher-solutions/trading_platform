# portfolio/models.py

from django.db import models
from django.conf import settings

class Portfolio(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolio')
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    risk_level = models.CharField(max_length=20, choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High')])
    liquidity = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    buying_power = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    margin = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

    @property
    def win_loss_ratio(self):
        return self.wins / self.losses if self.losses > 0 else self.wins

class Trade(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='trades')
    date = models.DateTimeField()
    symbol = models.CharField(max_length=10)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=[('BUY', 'Buy'), ('SELL', 'Sell')])
    profit_loss = models.DecimalField(max_digits=10, decimal_places=2)

class StockPortfolio(Portfolio):
    # Add stock-specific fields here
    pass

class OptionsPortfolio(Portfolio):
    # Add options-specific fields here
    pass

class ForexPortfolio(Portfolio):
    # Add forex-specific fields here
    pass

class RealEstatePortfolio(Portfolio):
    # Add real estate-specific fields here
    pass