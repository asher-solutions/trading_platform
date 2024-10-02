// static/js/model_editor.js

class ModelEditor {
    constructor(modelId) {
        this.modelId = modelId;
        this.grid = new Grid();
        this.sidebar = new Sidebar();
        this.toolbar = new Toolbar();
        this.components = [];
        this.connections = [];
        this.undoStack = [];
        this.redoStack = [];
        this.zoom = 1;
        this.isDragging = false;
        this.selectedComponents = new Set();
    }

    async init() {
        this.canvas = document.getElementById('editor-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        await this.loadModel();
        this.render();
    }

    async loadModel() {
        try {
            const response = await fetch(`/api/developer/models/${this.modelId}/load_model/`);
            const modelData = await response.json();
            this.components = modelData.components.map(c => new Component(c.x, c.y, 100, 50, c.type, c.id));
            this.connections = modelData.connections.map(c => new Connection(
                this.components.find(comp => comp.type === c.from),
                this.components.find(comp => comp.type === c.to),
                c.id
            ));
        } catch (error) {
            console.error('Error loading model:', error);
        }
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.getElementById('zoom-in').addEventListener('click', this.zoomIn.bind(this));
        document.getElementById('zoom-out').addEventListener('click', this.zoomOut.bind(this));
        document.getElementById('toggle-sidebar').addEventListener('click', this.toggleSidebar.bind(this));
        document.getElementById('undo').addEventListener('click', this.undo.bind(this));
        document.getElementById('redo').addEventListener('click', this.redo.bind(this));
        document.getElementById('delete').addEventListener('click', this.deleteSelected.bind(this));
        document.getElementById('save-model').addEventListener('click', this.saveModel.bind(this));
        document.getElementById('new-version').addEventListener('click', this.createNewVersion.bind(this));
        document.getElementById('share-model').addEventListener('click', this.showShareDialog.bind(this));
        document.getElementById('export-model').addEventListener('click', this.exportModel.bind(this));
        document.getElementById('import-model').addEventListener('click', this.importModel.bind(this));
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid.draw(this.ctx, this.zoom);
        this.components.forEach(component => component.draw(this.ctx, this.zoom));
        this.connections.forEach(connection => connection.draw(this.ctx, this.zoom));
        requestAnimationFrame(this.render.bind(this));
    }

    async exportModel() {
        try {
            const response = await fetch(`/api/developer/models/${this.modelId}/export_model/`);
            const modelData = await response.json();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(modelData));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `${modelData.name}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch (error) {
            console.error('Error exporting model:', error);
            alert('Failed to export model');
        }
    }

    importModel() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async event => {
                const modelData = JSON.parse(event.target.result);
                try {
                    const response = await fetch('/api/developer/models/import_model/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCookie('csrftoken')
                        },
                        body: JSON.stringify(modelData)
                    });
                    const result = await response.json();
                    window.location.href = `/model-editor/${result.id}/`;
                } catch (error) {
                    console.error('Error importing model:', error);
                    alert('Failed to import model');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    async addComponent(component) {
        try {
            const response = await fetch(`/api/developer/models/${this.modelId}/add_component/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    name: component.type,
                    x: component.x,
                    y: component.y
                })
            });
            const result = await response.json();
            component.id = result.id;
            this.components.push(component);
            this.undoStack.push({ action: 'add', component });
        } catch (error) {
            console.error('Error adding component:', error);
        }
    }

    async saveModel() {
        try {
            const modelData = {
                components: this.components.map(c => ({
                    type: c.type,
                    x: c.x,
                    y: c.y
                })),
                connections: this.connections.map(c => ({
                    from: c.start.type,
                    to: c.end.type
                }))
            };

            const response = await fetch(`/api/developer/models/${this.modelId}/save_model/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(modelData)
            });

            if (response.ok) {
                alert('Model saved successfully');
            } else {
                throw new Error('Failed to save model');
            }
        } catch (error) {
            console.error('Error saving model:', error);
            alert('Failed to save model');
        }
    }

    async removeComponent(component) {
        try {
            await fetch(`/api/developer/models/${this.modelId}/remove_component/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    component_id: component.id
                })
            });
            const index = this.components.indexOf(component);
            if (index > -1) {
                this.components.splice(index, 1);
                this.undoStack.push({ action: 'remove', component, index });
            }
        } catch (error) {
            console.error('Error removing component:', error);
        }
    }

    async connectComponents(component1, component2) {
        try {
            const response = await fetch(`/api/developer/models/${this.modelId}/add_connection/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    from_component_id: component1.id,
                    to_component_id: component2.id
                })
            });
            const result = await response.json();
            const connection = new Connection(component1, component2, result.id);
            this.connections.push(connection);
            this.undoStack.push({ action: 'connect', connection });
        } catch (error) {
            console.error('Error connecting components:', error);
        }
    }

    undo() {
        if (this.undoStack.length === 0) return;
        const action = this.undoStack.pop();
        this.redoStack.push(action);

        switch (action.action) {
            case 'add':
                this.removeComponent(action.component);
                break;
            case 'remove':
                this.components.splice(action.index, 0, action.component);
                break;
            case 'connect':
                const index = this.connections.indexOf(action.connection);
                if (index > -1) {
                    this.connections.splice(index, 1);
                }
                break;
        }
    }

    redo() {
        if (this.redoStack.length === 0) return;
        const action = this.redoStack.pop();
        this.undoStack.push(action);

        switch (action.action) {
            case 'add':
                this.addComponent(action.component);
                break;
            case 'remove':
                this.removeComponent(action.component);
                break;
            case 'connect':
                this.connections.push(action.connection);
                break;
        }
    }

    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.1, 3);
    }

    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.1, 0.5);
    }

    toggleSidebar() {
        this.sidebar.toggle();
    }

    handleMouseDown(event) {
        const pos = this.getMousePos(event);
        this.isDragging = true;
        this.dragStart = pos;
        this.selectComponentsAtPosition(pos);
    }

    handleMouseMove(event) {
        if (!this.isDragging) return;
        const pos = this.getMousePos(event);
        const dx = pos.x - this.dragStart.x;
        const dy = pos.y - this.dragStart.y;
        this.selectedComponents.forEach(component => {
            component.x += dx / this.zoom;
            component.y += dy / this.zoom;
        });
        this.dragStart = pos;
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / this.zoom,
            y: (event.clientY - rect.top) / this.zoom
        };
    }

    selectComponentsAtPosition(pos) {
        this.selectedComponents.clear();
        this.components.forEach(component => {
            if (component.containsPoint(pos.x, pos.y)) {
                this.selectedComponents.add(component);
            }
        });
    }

    deleteSelected() {
        this.selectedComponents.forEach(component => {
            this.removeComponent(component);
        });
        this.selectedComponents.clear();
    }

    async createNewVersion() {
        try {
            const response = await fetch(`/api/developer/models/${this.modelId}/create_new_version/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });

            if (response.ok) {
                const result = await response.json();
                alert(`New version created: ${result.version}`);
                window.location.href = `/model-editor/${result.id}/`;
            } else {
                throw new Error('Failed to create new version');
            }
        } catch (error) {
            console.error('Error creating new version:', error);
            alert('Failed to create new version');
        }
    }

    showShareDialog() {
        const username = prompt("Enter the username to share with:");
        if (username) {
            const canEdit = confirm("Allow editing? (OK for yes, Cancel for view-only)");
            this.shareModel(username, canEdit);
        }
    }

    async shareModel(username, canEdit) {
        try {
            const response = await fetch(`/api/developer/models/${this.modelId}/share_model/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    shared_with: username,
                    can_edit: canEdit
                })
            });

            if (response.ok) {
                alert('Model shared successfully');
            } else {
                throw new Error('Failed to share model');
            }
        } catch (error) {
            console.error('Error sharing model:', error);
            alert('Failed to share model');
        }
    }
}

class Grid {
    constructor() {
        this.spacing = 20;
    }

    draw(ctx, zoom) {
        const spacing = this.spacing * zoom;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        for (let x = 0; x < ctx.canvas.width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < ctx.canvas.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
        }
    }
}

class Sidebar {
    constructor() {
        this.isOpen = true;
        this.element = document.getElementById('sidebar');
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.element.style.transform = this.isOpen ? 'translateX(0)' : 'translateX(-100%)';
    }
}

class Toolbar {
    constructor() {
        this.element = document.getElementById('toolbar');
    }
}

class Component {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    draw(ctx, zoom) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x * zoom, this.y * zoom, this.width * zoom, this.height * zoom);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${12 * zoom}px Arial`;
        ctx.fillText(this.type, (this.x + 5) * zoom, (this.y + 20) * zoom);
    }

    containsPoint(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
}

class Connection {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    draw(ctx, zoom) {
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2 * zoom;
        ctx.beginPath();
        ctx.moveTo((this.start.x + this.start.width / 2) * zoom, (this.start.y + this.start.height / 2) * zoom);
        ctx.lineTo((this.end.x + this.end.width / 2) * zoom, (this.end.y + this.end.height / 2) * zoom);
        ctx.stroke();
    }
}

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Initialize the model editor
document.addEventListener('DOMContentLoaded', () => {
    const modelId = document.getElementById('model-id').value;
    const modelEditor = new ModelEditor(modelId);
    modelEditor.init();
});