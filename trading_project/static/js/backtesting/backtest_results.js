// static/js/backtesting/backtest_results.js
class BacktestResults {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }

    renderResults(results) {
        this.element.innerHTML = `
            <h2 class="text-2xl font-semibold mb-4">Backtest Results</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Price Chart</h3>
                    <canvas id="priceChart"></canvas>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Volume Chart</h3>
                    <canvas id="volumeChart"></canvas>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Profit/Loss Chart</h3>
                    <canvas id="profitLossChart"></canvas>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Equity Line Chart</h3>
                    <canvas id="equityChart"></canvas>
                </div>
            </div>
            <div class="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Backtest Statistics</h3>
                <table class="w-full">
                    <tbody>
                        ${Object.entries(results.statistics).map(([key, value]) => `
                            <tr>
                                <td class="font-medium">${key}</td>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.createCharts(results);
        this.element.classList.remove('hidden');
    }

    createCharts(results) {
        this.createPriceChart(results.priceData);
        this.createVolumeChart(results.volumeData);
        this.createProfitLossChart(results.profitLossData);
        this.createEquityChart(results.equityData);
    }

    createPriceChart(data) {
        const ctx = document.getElementById('priceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.date),
                datasets: [{
                    label: 'Price',
                    data: data.map(d => d.price),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }
                }
            }
        });
    }

    createVolumeChart(data) {
        const ctx = document.getElementById('volumeChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.date),
                datasets: [{
                    label: 'Volume',
                    data: data.map(d => d.volume),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }
                }
            }
        });
    }

    createProfitLossChart(data) {
        const ctx = document.getElementById('profitLossChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.date),
                datasets: [{
                    label: 'Profit/Loss',
                    data: data.map(d => d.profitLoss),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }
                }
            }
        });
    }

    createEquityChart(data) {
        const ctx = document.getElementById('equityChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.date),
                datasets: [{
                    label: 'Equity',
                    data: data.map(d => d.equity),
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }
                }
            }
        });
    }
}