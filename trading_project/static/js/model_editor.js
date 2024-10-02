const categoryColors = {
    'Enter Strategies': 'rgba(191, 219, 254)',
    'Exit Strategies': 'rgba(167, 243, 208, 0.87)',
    'Signal Models': 'rgba(254, 240, 138, 0.7)',
    'Data Loader': 'rgba(216, 180, 254, 0.7)',
    'Market Scanner': 'rgba(251, 207, 232, 0.7)',
    'Environment Conditions': 'rgba(191, 219, 254, 0.7)',
    'Custom': 'rgba(209, 213, 219, 0.7)'
};

class ModelEditor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.components = [];
        this.connections = [];
        this.isDragging = false;
        this.draggedComponent = null;
        this.selectedComponents = new Set();
        this.zoom = 1;
        this.panOffset = { x: 0, y: 0 };
        this.gridSize = 20;
        this.history = [];
        this.historyIndex = -1;
        this.isConnecting = false;
        this.connectionStart = null;
        this.connectionEnd = null;
        this.selectedConnection = null;

        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));

        document.getElementById('zoom-in').addEventListener('click', () => this.zoom *= 1.1);
        document.getElementById('zoom-out').addEventListener('click', () => this.zoom /= 1.1);
        document.getElementById('undo').addEventListener('click', this.undo.bind(this));
        document.getElementById('redo').addEventListener('click', this.redo.bind(this));
        document.getElementById('connect').addEventListener('click', this.startConnecting.bind(this));
        document.getElementById('delete').addEventListener('click', this.deleteSelected.bind(this));
        document.getElementById('clear').addEventListener('click', this.showClearConfirmation.bind(this));
        document.getElementById('fullscreen').addEventListener('click', this.toggleFullscreen.bind(this));

        document.getElementById('cancel-clear').addEventListener('click', this.hideClearConfirmation.bind(this));
        document.getElementById('confirm-clear').addEventListener('click', this.clearEditor.bind(this));

        const componentItems = document.querySelectorAll('.component-item');
        componentItems.forEach(item => {
            item.addEventListener('dragstart', this.handleDragStart.bind(this));
            item.addEventListener('dragend', this.handleDragEnd.bind(this));
        });

        this.canvas.addEventListener('dragover', this.handleDragOver.bind(this));
        this.canvas.addEventListener('drop', this.handleDrop.bind(this));
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawConnections();
        this.drawComponents();
        requestAnimationFrame(this.render.bind(this));
    }

    drawGrid() {
        const gridSize = this.gridSize * this.zoom;
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        for (let x = this.panOffset.x % gridSize; x < this.canvas.width; x += gridSize) {
            this.ctx.moveTo(Math.floor(x) + 0.5, 0);
            this.ctx.lineTo(Math.floor(x) + 0.5, this.canvas.height);
        }
        for (let y = this.panOffset.y % gridSize; y < this.canvas.height; y += gridSize) {
            this.ctx.moveTo(0, Math.floor(y) + 0.5);
            this.ctx.lineTo(this.canvas.width, Math.floor(y) + 0.5);
        }
        this.ctx.stroke();
    }

    drawComponents() {
        this.components.forEach(component => {
            this.ctx.fillStyle = this.selectedComponents.has(component.id) ? '#90caf9' : categoryColors[component.category];
            const x = (component.position.x + this.panOffset.x) * this.zoom;
            const y = (component.position.y + this.panOffset.y) * this.zoom;
            const width = 100 * this.zoom;
            const height = 50 * this.zoom;
            this.ctx.fillRect(x, y, width, height);
            this.ctx.fillStyle = '#000000';
            this.ctx.font = `${12 * this.zoom}px Arial`;
            this.ctx.fillText(component.type, x + 5 * this.zoom, y + 20 * this.zoom);
        });
    }

    drawConnections() {
        this.connections.forEach(conn => {
            const from = this.components.find(c => c.id === conn.from);
            const to = this.components.find(c => c.id === conn.to);
            if (from && to) {
                const fromPos = this.getAnchorPosition(from, conn.fromAnchor);
                const toPos = this.getAnchorPosition(to, conn.toAnchor);
                this.ctx.strokeStyle = conn.color;
                this.ctx.lineWidth = 2 * this.zoom;
                this.ctx.beginPath();
                this.ctx.moveTo(fromPos.x, fromPos.y);
                this.ctx.lineTo(toPos.x, toPos.y);
                this.ctx.stroke();

                // Draw arrowhead
                const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
                this.ctx.beginPath();
                this.ctx.moveTo(toPos.x, toPos.y);
                this.ctx.lineTo(toPos.x - 10 * Math.cos(angle - Math.PI / 6), toPos.y - 10 * Math.sin(angle - Math.PI / 6));
                this.ctx.lineTo(toPos.x - 10 * Math.cos(angle + Math.PI / 6), toPos.y - 10 * Math.sin(angle + Math.PI / 6));
                this.ctx.closePath();
                this.ctx.fill();
            }
        });
    }

    handleMouseDown(event) {
        const pos = this.getCanvasPosition(event);
        this.isDragging = true;
        this.dragStart = pos;
        const clickedComponent = this.getComponentAtPosition(pos);
        if (clickedComponent) {
            if (event.ctrlKey || event.metaKey) {
                this.toggleComponentSelection(clickedComponent);
            } else {
                this.selectedComponents.clear();
                this.selectedComponents.add(clickedComponent.id);
            }
            this.draggedComponent = clickedComponent;
        } else {
            this.selectedComponents.clear();
        }
    }

    handleMouseMove(event) {
        if (!this.isDragging) return;
        const pos = this.getCanvasPosition(event);
        const dx = (pos.x - this.dragStart.x) / this.zoom;
        const dy = (pos.y - this.dragStart.y) / this.zoom;
        if (this.draggedComponent) {
            this.selectedComponents.forEach(id => {
                const component = this.components.find(c => c.id === id);
                component.position.x += dx;
                component.position.y += dy;
            });
        } else {
            this.panOffset.x += dx;
            this.panOffset.y += dy;
        }
        this.dragStart = pos;

        if (this.isConnecting && this.connectionStart) {
            this.connectionEnd = pos;
        }
    }

    handleMouseUp(event) {
        this.isDragging = false;
        this.draggedComponent = null;
        if (this.isConnecting && this.connectionStart) {
            const endComponent = this.getComponentAtPosition(this.getCanvasPosition(event));
            if (endComponent && endComponent.id !== this.connectionStart.id) {
                this.createConnection(this.connectionStart, endComponent);
            }
            this.isConnecting = false;
            this.connectionStart = null;
            this.connectionEnd = null;
        }
    }

    handleWheel(event) {
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        const pos = this.getCanvasPosition(event);
        this.zoomAtPoint(pos, zoomFactor);
    }

    zoomAtPoint(pos, factor) {
        const minZoom = 0.5;
        const maxZoom = 3;
        const newZoom = this.zoom * factor;

        if (newZoom < minZoom || newZoom > maxZoom) return;

        const zoomCenter = {
            x: (pos.x / this.zoom - this.panOffset.x),
            y: (pos.y / this.zoom - this.panOffset.y)
        };
        this.zoom = newZoom;
        this.panOffset.x = -zoomCenter.x * this.zoom + pos.x / this.zoom;
        this.panOffset.y = -zoomCenter.y * this.zoom + pos.y / this.zoom;
    }

    getCanvasPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    getComponentAtPosition(pos) {
        return this.components.find(component => {
            const x = (component.position.x + this.panOffset.x) * this.zoom;
            const y = (component.position.y + this.panOffset.y) * this.zoom;
            const width = 100 * this.zoom;
            const height = 50 * this.zoom;
            return pos.x >= x && pos.x <= x + width && pos.y >= y && pos.y <= y + height;
        });
    }

    toggleComponentSelection(component) {
        if (this.selectedComponents.has(component.id)) {
            this.selectedComponents.delete(component.id);
        } else {
            this.selectedComponents.add(component.id);
        }
    }

    handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.component);
        event.dataTransfer.setData('category', event.target.dataset.category);
    }

    handleDragEnd(event) {
        // Clean up any drag-related visual effects if needed
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDrop(event) {
        event.preventDefault();
        const componentType = event.dataTransfer.getData('text/plain');
        const componentCategory = event.dataTransfer.getData('category');
        const pos = this.getCanvasPosition(event);
        const x = (pos.x / this.zoom - this.panOffset.x);
        const y = (pos.y / this.zoom - this.panOffset.y);
        this.addComponent(componentType, componentCategory, x, y);
    }

    addComponent(type, category, x, y) {
        const newComponent = {
            id: Date.now().toString(),
            type: type,
            category: category,
            position: { x, y }
        };
        this.components.push(newComponent);
        this.addToHistory();
    }

    createConnection(fromComponent, toComponent) {
        const newConnection = {
            id: Date.now().toString(),
            from: fromComponent.id,
            to: toComponent.id,
            fromAnchor: 'right',
            toAnchor: 'left',
            color: categoryColors[fromComponent.category] || 'rgb(209, 213, 219)'
        };
        this.connections.push(newConnection);
        this.addToHistory();
    }

    startConnecting() {
        if (this.selectedComponents.size === 1) {
            this.isConnecting = true;
            this.connectionStart = this.components.find(c => c.id === Array.from(this.selectedComponents)[0]);
        } else {
            alert('Please select exactly one component to start connecting.');
        }
    }

    deleteSelected() {
        this.components = this.components.filter(c => !this.selectedComponents.has(c.id));
        this.connections = this.connections.filter(conn =>
            !this.selectedComponents.has(conn.from) && !this.selectedComponents.has(conn.to)
        );
        if (this.selectedConnection) {
            this.connections = this.connections.filter(conn => conn.id !== this.selectedConnection);
            this.selectedConnection = null;
        }
        this.selectedComponents.clear();
        this.addToHistory();
    }

    showClearConfirmation() {
        document.getElementById('clear-confirmation-dialog').classList.remove('hidden');
    }

    hideClearConfirmation() {
        document.getElementById('clear-confirmation-dialog').classList.add('hidden');
    }

    clearEditor() {
        this.components = [];
        this.connections = [];
        this.selectedComponents.clear();
        this.selectedConnection = null;
        this.addToHistory();
        this.hideClearConfirmation();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    addToHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push({
            components: JSON.parse(JSON.stringify(this.components)),
            connections: JSON.parse(JSON.stringify(this.connections))
        });
        this.historyIndex++;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const state = this.history[this.historyIndex];
            this.components = JSON.parse(JSON.stringify(state.components));
            this.connections = JSON.parse(JSON.stringify(state.connections));
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const state = this.history[this.historyIndex];
            this.components = JSON.parse(JSON.stringify(state.components));
            this.connections = JSON.parse(JSON.stringify(state.connections));
        }
    }

    getAnchorPosition(component, anchor) {
        const x = (component.position.x + this.panOffset.x) * this.zoom;
        const y = (component.position.y + this.panOffset.y) * this.zoom;
        const width = 100 * this.zoom;
        const height = 50 * this.zoom;
        switch (anchor) {
            case 'top': return { x: x + width / 2, y: y };
            case 'right': return { x: x + width, y: y + height / 2 };
            case 'bottom': return { x: x + width / 2, y: y + height };
            case 'left': return { x: x, y: y + height / 2 };
        }
    }
}

// Initialize the model editor
document.addEventListener('DOMContentLoaded', () => {
    const modelEditor = new ModelEditor('editor-canvas');
});