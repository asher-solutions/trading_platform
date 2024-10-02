# user/forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    date_of_birth = forms.DateField(required=True, help_text='Required. Format: YYYY-MM-DD')
    brokerage = forms.CharField(max_length=100, required=True)
    subscription_tier = forms.ChoiceField(choices=[
        ('STANDARD', 'Standard'),
        ('PREMIUM', 'Premium'),
        ('PREMIUM_PLUS', 'Premium Plus')
    ], required=True)

    class Meta:
        model = User
        fields = ["username", "email", 'password1', 'password2', "first_name", "last_name", "date_of_birth", "brokerage", "subscription_tier"]
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
        }
    def save(self, commit=True):
        user = super(UserRegistrationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.date_of_birth = self.cleaned_data['date_of_birth']
        user.brokerage = self.cleaned_data['brokerage']
        user.subscription_tier = self.cleaned_data['subscription_tier']
        if commit:
            user.save()
        return user
    # def save(self, commit=True):
    #     user = super(UserRegistrationForm, self).save(commit=False)
    #     user.email = self.cleaned_data["email"]
    #     if commit:
    #         user.save()
    #     return user