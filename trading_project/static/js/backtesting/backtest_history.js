// static/js/backtesting/backtest_history.js
class BacktestHistory {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }

    async fetchHistory() {
        try {
            const response = await fetch('/api/backtesting/history/');
            const data = await response.json();
            this.renderHistory(data);
        } catch (error) {
            console.error('Error fetching backtest history:', error);
        }
    }

    renderHistory(history) {
        const table = document.createElement('table');
        table.className = 'w-full border-collapse';

        table.innerHTML = `
            <thead>
                <tr class="bg-gray-200 dark:bg-gray-700">
                    <th class="p-2 text-left">Model</th>
                    <th class="p-2 text-left">Version</th>
                    <th class="p-2 text-left">Status</th>
                    <th class="p-2 text-left">Date</th>
                    <th class="p-2 text-left">Performance</th>
                </tr>
            </thead>
            <tbody>
                ${history.map(item => `
                    <tr class="border-b dark:border-gray-600">
                        <td class="p-2">${item.modelName}</td>
                        <td class="p-2">${item.version}</td>
                        <td class="p-2">
                            <span class="px-2 py-1 text-white rounded-full text-xs ${this.getStatusColor(item.status)}">
                                ${item.status}
                            </span>
                        </td>
                        <td class="p-2">${item.date}</td>
                        <td class="p-2">${item.performance.toFixed(2)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        this.element.innerHTML = '';
        this.element.appendChild(table);
    }

    getStatusColor(status) {
        const colors = {
            'beta': 'bg-yellow-500',
            'alpha': 'bg-blue-500',
            'production': 'bg-green-500'
        };
        return colors[status] || 'bg-gray-500';
    }
}