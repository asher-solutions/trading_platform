// static/js/backtesting/backtest_config_form.js
class BacktestConfigForm {
    constructor(formId, onSubmit) {
        this.form = document.getElementById(formId);
        this.onSubmit = onSubmit;
        this.initForm();
    }

    initForm() {
        this.form.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="models" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Models</label>
                    <select id="models" name="models" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="model1">Model 1</option>
                        <option value="model2">Model 2</option>
                        <option value="model3">Model 3</option>
                    </select>
                </div>
                <div>
                    <label for="tickers" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tickers</label>
                    <input type="text" id="tickers" name="tickers" placeholder="AAPL, GOOGL, MSFT" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                </div>
                <div>
                    <label for="timeframes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Timeframes</label>
                    <select id="timeframes" name="timeframes" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="1d">1 Day</option>
                        <option value="1h">1 Hour</option>
                        <option value="15min">15 Minutes</option>
                    </select>
                </div>
                <div>
                    <label for="interval" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Interval</label>
                    <select id="interval" name="interval" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="1min">1 Minute</option>
                        <option value="5min">5 Minutes</option>
                        <option value="15min">15 Minutes</option>
                    </select>
                </div>
            </div>
            <div class="mt-4 flex items-center space-x-2">
                <input type="checkbox" id="includePrePostMarket" name="includePrePostMarket" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                <label for="includePrePostMarket" class="text-sm text-gray-700 dark:text-gray-300">Include Pre/Post Market Data</label>
            </div>
            <button type="submit" class="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Run Backtest
            </button>
        `;

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const config = {
            models: formData.get('models'),
            tickers: formData.get('tickers').split(',').map(t => t.trim()),
            timeframes: formData.get('timeframes'),
            interval: formData.get('interval'),
            includePrePostMarket: formData.get('includePrePostMarket') === 'on'
        };
        this.onSubmit(config);
    }

    setLoading(isLoading) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Running Backtest...' : 'Run Backtest';
    }
}