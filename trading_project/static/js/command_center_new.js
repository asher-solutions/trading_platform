// static/js/command_center.js
document.addEventListener('DOMContentLoaded', () => {
    const panelsContainer = document.getElementById('panels-container');

    // INITIALIZE 4 PANELS
    const panelCount = 4;
    function initializePanels() {
        for (let i = 0; i < panelCount; i++) {
            const panel = createPanel();
            panelsContainer.appendChild(panel);
            initializePanel(panel);
        }
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.className = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden relative flex';
        panel.innerHTML = `
            <div class="w-1/3 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col">
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
                <div class="flex space-x-2 mb-4">
                    <button class="buy-btn flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Buy</button>
                    <button class="sell-btn flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Sell</button>
                </div>
                <div class="mt-auto">
                    <div class="flex items-center justify-between">
                        <span class="mode-label text-sm font-medium text-gray-700 dark:text-gray-300">Manual</span>
                        <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" name="toggle" id="toggle" class="mode-toggle sr-only peer">
                            <div class="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-2/3 relative">
                <div class="tradingview-widget-container h-full">
                    <div class="tradingview-widget-container__widget h-full"></div>
                </div>
            </div>
        `;
        return panel;
    }

    function initializePanel(panel) {
        const modeToggle = panel.querySelector('.mode-toggle');
        const modeLabel = panel.querySelector('.mode-label');
        const tickerInput = panel.querySelector('.ticker-input');
        const quantitySelect = panel.querySelector('.quantity-select');
        const orderTypeSelect = panel.querySelector('.order-type-select');
        const buyBtn = panel.querySelector('.buy-btn');
        const sellBtn = panel.querySelector('.sell-btn');
        const widgetContainer = panel.querySelector('.tradingview-widget-container__widget');

        modeToggle.addEventListener('change', () => {
            const isAuto = modeToggle.checked;
            modeLabel.textContent = isAuto ? 'Auto' : 'Manual';
            tickerInput.disabled = isAuto;
            quantitySelect.disabled = isAuto;
            orderTypeSelect.disabled = isAuto;
            buyBtn.disabled = isAuto;
            sellBtn.disabled = isAuto;

            if (isAuto) {
                buyBtn.classList.add('opacity-50', 'cursor-not-allowed');
                sellBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                buyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                sellBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });

        tickerInput.addEventListener('change', () => updateWidget(widgetContainer, tickerInput.value));
        buyBtn.addEventListener('click', () => executeTrade('buy', tickerInput.value, quantitySelect.value, orderTypeSelect.value));
        sellBtn.addEventListener('click', () => executeTrade('sell', tickerInput.value, quantitySelect.value, orderTypeSelect.value));

        updateWidget(widgetContainer, 'AAPL');
    }

    function updateWidget(container, symbol) {
        // Remove existing widget if any
        container.innerHTML = '';

        // Create new script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.async = true;

        // Set widget options
        const widgetOptions = {
            "width": "100%",
            "height": "100%",
            "symbol": `NASDAQ:${symbol}`, // change later for different exchanges
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "allow_symbol_change": false,
            "save_image": false,
            // "watchlist": [
            //     "NASDAQ:NVDA",
            //     "MSFT",
            //     "AMEX:SPY"
            // ],
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        };

        script.innerHTML = JSON.stringify(widgetOptions);

        // Append the script to the container
        container.appendChild(script);
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

    // // Initialize with one panel
    // addPanel();

    // Initialize with 4 panels
    initializePanels();
});