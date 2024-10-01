# temp views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def home(request):
    return render(request, 'hero.html')

def about(request):
    return render(request, 'about.html')

@login_required
def model_editor(request):
    return render(request, 'pages/model_editor.html')

@login_required
def backtesting(request):
    return render(request, 'pages/backtesting.html')

@login_required
def data_exploration(request):
    return render(request, 'pages/data_exploration.html')

@login_required
def leaderboards(request):
    return render(request, 'pages/leaderboards.html')

@login_required
def settings(request):
    return render(request, 'pages/settings.html')

@login_required
def command_center(request):
    return render(request, 'pages/command_center.html')