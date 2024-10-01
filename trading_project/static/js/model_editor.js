// static/js/model_editor.js
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const builderPanel = document.getElementById('builder-panel');
    const modelsList = document.getElementById('models-list');
    const compileBtn = document.getElementById('compile-btn');
    const saveBtn = document.getElementById('save-btn');
    const backtestBtn = document.getElementById('backtest-btn');

    let placedComponents = [];
    let connections = [];

    const componentTree = {
        'Enter Strategies': ['Strategy A', 'Strategy B'],
        'Exit Strategies': ['Strategy X', 'Strategy Y'],
        'Signal Models': ['Model 1', 'Model 2'],
        'Data Loader': ['Loader A', 'Loader B'],
        'Market Scanner': ['Scanner 1', 'Scanner 2'],
        'Environment Conditions': ['Condition A', 'Condition B'],
        'Custom': ['Custom 1', 'Custom 2'],
    };

    function renderSidebar() {
        sidebar.innerHTML = '';
        Object.entries(componentTree).forEach(([category, components]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'mb-4';
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'flex items-center justify-between w-full text-left font-semibold text-gray-700 dark:text-gray-300';
            categoryBtn.textContent = category;
            categoryBtn.onclick = () => toggleCategory(category);
            categoryDiv.appendChild(categoryBtn);

            const componentList = document.createElement('ul');
            componentList.className = 'ml-4 mt-2 space-y-2 hidden';
            componentList.id = `category-${category}`;
            components.forEach(component => {
                const li = document.createElement('li');
                li.className = 'p-2 bg-white dark:bg-gray-700 rounded shadow cursor-move';
                li.textContent = component;
                li.draggable = true;
                li.ondragstart = (e) => handleDragStart(e, component, category);
                componentList.appendChild(li);
            });
            categoryDiv.appendChild(componentList);
            sidebar.appendChild(categoryDiv);
        });
    }

    function toggleCategory(category) {
        const componentList = document.getElementById(`category-${category}`);
        componentList.classList.toggle('hidden');
    }

    function handleDragStart(e, component, category) {
        e.dataTransfer.setData('text/plain', component);
        e.dataTransfer.setData('category', category);
    }

    function initializeBuilderPanel() {
        builderPanel.ondragover = (e) => e.preventDefault();
        builderPanel.ondrop = handleDrop;
    }

    function handleDrop(e) {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text');
        const componentCategory = e.dataTransfer.getData('category');
        const rect = builderPanel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newComponent = { id: Date.now().toString(), type: componentType, category: componentCategory, position: { x, y } };
        placedComponents.push(newComponent);
        renderComponent(newComponent);
    }

    function renderComponent(comp) {
        const componentEl = document.createElement('div');
        componentEl.className = 'absolute p-4 rounded-lg shadow-md border-2 border-transparent transition-all duration-200 ease-in-out transform hover:scale-105 select-none';
        componentEl.style.left = `${comp.position.x}px`;
        componentEl.style.top = `${comp.position.y}px`;
        componentEl.style.width = '100px';
        componentEl.style.height = '100px';
        componentEl.style.backgroundColor = getCategoryColor(comp.category);
        componentEl.textContent = comp.type;
        componentEl.ondblclick = () => handleComponentDoubleClick(comp.id);
        componentEl.onmousedown = (e) => handleComponentMove(e, comp.id);
        builderPanel.appendChild(componentEl);
    }

    function getCategoryColor(category) {
        const colors = {
            'Enter Strategies': 'rgba(191, 219, 254, 0.7)',
            'Exit Strategies': 'rgba(167, 243, 208, 0.7)',
            'Signal Models': 'rgba(254, 240, 138, 0.7)',
            'Data Loader': 'rgba(216, 180, 254, 0.7)',
            'Market Scanner': 'rgba(251, 207, 232, 0.7)',
            'Environment Conditions': 'rgba(191, 219, 254, 0.7)',
            'Custom': 'rgba(209, 213, 219, 0.7)'
        };
        return colors[category] || 'rgba(209, 213, 219, 0.7)';
    }

    function handleComponentDoubleClick(id) {
        console.log(`Open dropdown form menu for component ${id}`);
        // Implement dropdown form menu logic here
    }

    function handleComponentMove(e, id) {
        const component = placedComponents.find(c => c.id === id);
        const componentEl = builderPanel.querySelector(`[data-id="${id}"]`);
        let startX = e.clientX - component.position.x;
        let startY = e.clientY - component.position.y;

        function onMouseMove(e) {
            component.position.x = e.clientX - startX;
            component.position.y = e.clientY - startY;
            componentEl.style.left = `${component.position.x}px`;
            componentEl.style.top = `${component.position.y}px`;
            updateConnections();
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function updateConnections() {
        // Implement connection update logic here
    }

    function initializeActionBar() {
        compileBtn.onclick = handleCompile;
        saveBtn.onclick = handleSave;
        backtestBtn.onclick = handleBacktest;
    }

    function handleCompile() {
        console.log('Compiling model...');
        // Implement compilation logic here
    }

    function handleSave() {
        console.log('Saving model...');
        // Implement save logic here
    }

    function handleBacktest() {
        console.log('Backtesting model...');
        // Implement backtest logic here
    }

    function renderModelsList() {
        // Implement models list rendering here
    }

    // Initialize the Model Editor
    renderSidebar();
    initializeBuilderPanel();
    initializeActionBar();
    renderModelsList();
});