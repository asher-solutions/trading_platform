# trading_project/views.py

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from developer.models import Model, SharedModel, Component
from developer.forms import ComponentForm
from django.http import HttpResponseForbidden
from portfolio.models import Trade

def home(request):
    return render(request, 'hero.html')

def about(request):
    return render(request, 'about.html')

def model_editor(request):
    component_categories = {
        'Enter Strategies': ['Strategy A', 'Strategy B'],
        'Exit Strategies': ['Strategy X', 'Strategy Y'],
        'Signal Models': ['Model 1', 'Model 2'],
        'Data Loader': ['Loader A', 'Loader B'],
        'Market Scanner': ['Scanner 1', 'Scanner 2'],
        'Environment Conditions': ['Condition A', 'Condition B'],
        'Custom': ['Custom 1', 'Custom 2'],
    }

    user_models = [
        {
            'name': 'Model A',
            'versions': [
                {'version': 'v1.0', 'status': 'beta'},
                {'version': 'v1.1', 'status': 'alpha'},
            ]
        },
        {
            'name': 'Model B',
            'versions': [
                {'version': 'v1.0', 'status': 'production'},
            ]
        },
    ]

    context = {
        'component_categories': component_categories,
        'user_models': user_models,
    }

    return render(request, 'model_editor.html', context)

@login_required
def model_performance(request, model_id):
    model = Model.objects.get(id=model_id)
    trades = Trade.objects.filter(portfolio__user=request.user, model=model).order_by('-date')

    # Calculate performance metrics
    total_trades = trades.count()
    winning_trades = trades.filter(profit_loss__gt=0).count()
    losing_trades = trades.filter(profit_loss__lt=0).count()
    win_rate = (winning_trades / total_trades) * 100 if total_trades > 0 else 0

    total_profit_loss = sum(trade.profit_loss for trade in trades)
    average_profit_loss = total_profit_loss / total_trades if total_trades > 0 else 0

    # Calculate drawdown
    cumulative_pnl = [0]
    for trade in trades:
        cumulative_pnl.append(cumulative_pnl[-1] + trade.profit_loss)
    max_drawdown = min(0, min(cumulative_pnl))

    context = {
        'model': model,
        'total_trades': total_trades,
        'winning_trades': winning_trades,
        'losing_trades': losing_trades,
        'win_rate': win_rate,
        'total_profit_loss': total_profit_loss,
        'average_profit_loss': average_profit_loss,
        'max_drawdown': max_drawdown,
        'trades': trades[:50],  # Limit to last 50 trades for display
        'cumulative_pnl': cumulative_pnl[1:],  # Remove the initial 0
    }

    return render(request, 'pages/model_performance.html', context)

@login_required
def component_library(request):
    if request.method == 'POST':
        form = ComponentForm(request.POST)
        if form.is_valid():
            component = form.save(commit=False)
            component.created_by = request.user
            component.save()
            return redirect('component_library')
    else:
        form = ComponentForm()

    public_components = Component.objects.filter(is_public=True)
    user_components = Component.objects.filter(created_by=request.user, is_public=False)

    return render(request, 'pages/component_library.html', {
        'form': form,
        'public_components': public_components,
        'user_components': user_components
    })

@login_required
def model_editor(request, model_id=None):
    if model_id:
        model = get_object_or_404(Model, id=model_id)
        if model.user != request.user and not SharedModel.objects.filter(model=model, shared_with=request.user).exists():
            return HttpResponseForbidden("You don't have permission to access this model.")
    else:
        model = Model.objects.create(user=request.user, name="New Model")
    return render(request, 'pages/model_editor.html', {'model_id': model.id})

@login_required
def version_history(request, model_id):
    model = get_object_or_404(Model, id=model_id)
    if model.user != request.user and not SharedModel.objects.filter(model=model, shared_with=request.user).exists():
        return HttpResponseForbidden("You don't have permission to access this model.")

    versions = Model.objects.filter(user=model.user, name=model.name).order_by('-version')
    return render(request, 'pages/version_history.html', {'model': model, 'versions': versions})

@login_required
def shared_models(request):
    shared_models = SharedModel.objects.filter(shared_with=request.user)
    return render(request, 'pages/shared_models.html', {'shared_models': shared_models})

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

@login_required
def portfolio(request):
    return render(request, 'pages/portfolio.html')

@login_required
def performance(request):
    return render(request, 'pages/performance.html')

@login_required
def developer(request):
    return render(request, 'pages/developer.html')