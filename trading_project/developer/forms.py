# developer/forms.py

from django import forms
from .models import Component

class ComponentForm(forms.ModelForm):
    class Meta:
        model = Component
        fields = ['name', 'description', 'code', 'category', 'is_public']