from django.contrib import admin
from django.db.models import Count
from django.utils.html import format_html
from unfold.admin import ModelAdmin
from .models import User

@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'date_of_birth', 'brokerage', 'subscription_tier')
    list_filter = ('brokerage', 'subscription_tier')
    search_fields = ('username', 'email', 'first_name', 'last_name')

    def changelist_view(self, request, extra_context=None):
        # Add a pie chart for subscription tiers
        subscription_stats = (
            User.objects.values('subscription_tier')
            .annotate(count=Count('id'))
            .order_by('subscription_tier')
        )

        # Prepare data for the pie chart
        labels = [stat['subscription_tier'] for stat in subscription_stats]
        data = [stat['count'] for stat in subscription_stats]

        # Create a simple pie chart using HTML and inline CSS
        chart_html = f"""
        <div style="width: 300px; height: 300px;">
            <canvas id="subscriptionChart"></canvas>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            var ctx = document.getElementById('subscriptionChart').getContext('2d');
            new Chart(ctx, {{
                type: 'pie',
                data: {{
                    labels: {labels},
                    datasets: [{{
                        data: {data},
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                    }}]
                }},
                options: {{
                    responsive: true,
                    title: {{
                        display: true,
                        text: 'User Distribution by Subscription Tier'
                    }}
                }}
            }});
        </script>
        """

        extra_context = extra_context or {}
        extra_context['subscription_chart'] = format_html(chart_html)
        return super().changelist_view(request, extra_context=extra_context)