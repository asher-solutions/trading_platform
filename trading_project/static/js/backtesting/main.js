// static/js/backtesting/main.js
document.addEventListener('DOMContentLoaded', () => {
    const backtestHistory = new BacktestHistory('backtest-history');
    const backtestConfigForm = new BacktestConfigForm('backtest-form', runBacktest);
    const backtestResults = new BacktestResults('backtest-results');

    backtestHistory.fetchHistory();

    async function runBacktest(config) {
        backtestConfigForm.setLoading(true);
        try {
            const response = await fetch('/api/backtesting/run/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify(config)
            });
            const results = await response.json();
            backtestResults.renderResults(results);
            backtestHistory.fetchHistory(); // Refresh history after new backtest
        } catch (error) {
            console.error('Error running backtest:', error);
            alert('An error occurred while running the backtest. Please try again.');
        } finally {
            backtestConfigForm.setLoading(false);
        }
    }

    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
});