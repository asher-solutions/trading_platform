// static/js/command_center.js
document.addEventListener('DOMContentLoaded', () => {
    const panelsContainer = document.getElementById('panels-container');
    const addPanelBtn = document.getElementById('add-panel-btn');
    let panelCount = 0;

    addPanelBtn.addEventListener('click', () => {
        if (panelCount < 4) {
            addPanel();
        }
    });

    function addPanel() {
        panelCount++;
        const panel = createPanel();
        panelsContainer.appendChild(panel);
        initializePanel(panel);

        if (panelCount === 4) {
            addPanelBtn.style.display = 'none';
        }
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative';
        panel.innerHTML = `
            <button class="absolute top-2 left-2 z-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <div class="flex h-full">
                <div class="w-1/3 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ticker</label>
                        <input type="text" class="ticker-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Enter ticker">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                        <select class="quantity-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="auto">Auto</option>
                            <option value="1">1</option>
                            <option value="10">10</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Type</label>
                        <select class="order-type-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="auto">Auto</option>
                            <option value="market">Market</option>
                            <option value="limit">Limit</option>
                            <option value="stop">Stop</option>
                        </select>
                    </div>
                    <div class="flex space-x-2">
                        <button class="buy-btn flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Buy</button>
                        <button class="sell-btn flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Sell</button>
                    </div>
                </div>
                <div class="w-2/3 relative">
                    <div class="chart-container" style="height: 400px;"></div>
                </div>
            </div>
        `;
        return panel;
    }

    function initializePanel(panel) {
        const closeBtn = panel.querySelector('button');
        const tickerInput = panel.querySelector('.ticker-input');
        const quantitySelect = panel.querySelector('.quantity-select');
        const orderTypeSelect = panel.querySelector('.order-type-select');
        const buyBtn = panel.querySelector('.buy-btn');
        const sellBtn = panel.querySelector('.sell-btn');
        const chartContainer = panel.querySelector('.chart-container');

        closeBtn.addEventListener('click', () => {
            panelsContainer.removeChild(panel);
            panelCount--;
            addPanelBtn.style.display = 'flex';
        });

        tickerInput.addEventListener('change', () => updateChart(chartContainer, tickerInput.value));
        buyBtn.addEventListener('click', () => executeTrade('buy', tickerInput.value, quantitySelect.value, orderTypeSelect.value));
        sellBtn.addEventListener('click', () => executeTrade('sell', tickerInput.value, quantitySelect.value, orderTypeSelect.value));

        // Initialize chart with a default ticker
        updateChart(chartContainer, 'AAPL');
    }

    function updateChart(container, symbol) {
        // Clear existing chart
        container.innerHTML = '';

        const chart = LightweightCharts.createChart(container, {
            width: container.clientWidth,
            height: container.clientHeight,
            layout: {
                backgroundColor: '#ffffff',
                textColor: 'rgba(33, 56, 77, 1)',
            },
            grid: {
                vertLines: {
                    color: 'rgba(197, 203, 206, 0.5)',
                },
                horzLines: {
                    color: 'rgba(197, 203, 206, 0.5)',
                },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            priceScale: {
                borderColor: 'rgba(197, 203, 206, 1)',
            },
            timeScale: {
                borderColor: 'rgba(197, 203, 206, 1)',
            },
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: 'rgba(255, 144, 0, 1)',
            downColor: '#000',
            borderDownColor: '#000',
            borderUpColor: 'rgba(255, 144, 0, 1)',
            wickDownColor: '#000',
            wickUpColor: 'rgba(255, 144, 0, 1)',
        });

        fetch(`/api/datamanager/market-data/?symbol=${symbol}`)
            .then(response => response.json())
            .then(data => {
                const chartData = data.map(d => ({
                    time: d.date,
                    open: parseFloat(d.open),
                    high: parseFloat(d.high),
                    low: parseFloat(d.low),
                    close: parseFloat(d.close)
                }));
                candleSeries.setData(chartData);
            })
            .catch(error => console.error('Error fetching market data:', error));
    }

    async function executeTrade(action, symbol, quantity, orderType) {
        try {
            const response = await fetch('/api/tradingapi/execute-trade/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    action,
                    symbol,
                    quantity,
                    orderType
                })
            });
            const result = await response.json();
            if (response.ok) {
                alert(`Trade executed successfully: ${result.message}`);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error executing trade:', error);
            alert(`Failed to execute trade: ${error.message}`);
        }
    }

    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    // Initialize with one panel
    addPanel();
});