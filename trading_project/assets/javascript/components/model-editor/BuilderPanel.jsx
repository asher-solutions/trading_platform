// assets/javascript/components/developer/BuilderPanel.jsx

import React, { useState, useRef, useEffect } from 'react';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon, TrashIcon, ArrowPathIcon, PlusIcon, MinusIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/solid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import Button from '../ui/button';
import { api } from '../../utils/api';

const categoryColors = {
  'Enter Strategies': 'rgba(191, 219, 254)',
  'Exit Strategies': 'rgba(167, 243, 208, 0.87)',
  'Signal Models': 'rgba(254, 240, 138, 0.7)',
  'Data Loader': 'rgba(216, 180, 254, 0.7)',
  'Market Scanner': 'rgba(251, 207, 232, 0.7)',
  'Environment Conditions': 'rgba(191, 219, 254, 0.7)',
  'Custom': 'rgba(209, 213, 219, 0.7)'
};

const BuilderPanel = ({ isFullScreen, setIsFullScreen }) => {
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [placedComponents, setPlacedComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isPanMoved, setIsPanMoved] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionEnd, setConnectionEnd] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const panelRef = useRef(null);
  const rafRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const handleMouseDown = (e) => {
    if (e.target === panelRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setPanPosition(prev => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        setPlacedComponents(prev => prev.map(comp => ({
          ...comp,
          position: {
            x: comp.position.x + dx,
            y: comp.position.y + dy,
          }
        })));
        setDragStart({ x: e.clientX, y: e.clientY });
        setIsPanMoved(true);
      });
    }

    if (isConnecting && connectionStart) {
      const rect = panelRef.current ? panelRef.current.getBoundingClientRect() : null;
      setConnectionEnd({
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom
      });
    }
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    if (isConnecting) {
      handleConnectionEnd(e);
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    // const componentType = e.dataTransfer.getData('text');
    // const componentCategory = e.dataTransfer.getData('category');
    // const rect = panelRef.current!.getBoundingClientRect();
    // const x = (e.clientX - rect.left - panPosition.x) / zoom;
    // const y = (e.clientY - rect.top - panPosition.y) / zoom;

    // const newComponent = { id: Date.now().toString(), type: componentType, category: componentCategory, position: { x, y } };

    // setPlacedComponents(prev => [...prev, newComponent]);
    const componentId = e.dataTransfer.getData('text');
    const position = {
      x: e.clientX - e.target.offsetLeft,
      y: e.clientY - e.target.offsetTop,
    };

    try {
      await api.addComponentToModel({ componentId, position });
      fetchModelComponents(); // Implement this function to fetch updated components
    } catch (error) {
      console.error('Error adding component to model:', error);
    }
    addToHistory();
  };

  const fetchModelComponents = async () => {
    try {
      const components = await api.getModelComponents();
      const connections = await api.getConnections();
      setPlacedComponents(components);
      setConnections(connections);
    } catch (error) {
      console.error('Error fetching model components:', error);
    }
  };

  useEffect(() => {
    fetchModelComponents();
  }, []);

  const handleComponentClick = (e, id) => {
    if (isConnecting) {
      handleConnectionEnd(e);
    } else {
      if (e.ctrlKey || e.metaKey) {
        setSelectedComponents(prev =>
          prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
      } else {
        setSelectedComponents([id]);
      }
      setSelectedConnection(null);
    }
  };

  const handleComponentDoubleClick = (id) => {
    // Implement dropdown form menu logic here
    console.log(`Open dropdown form menu for component ${id}`);
  };

  const handleComponentMove = (e, id) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPositions = placedComponents.reduce((acc, comp) => {
      acc[comp.id] = { ...comp.position };
      return acc;
    }, {});

    const handleMouseMove = (e) => {
      const dx = (e.clientX - startX) / zoom;
      const dy = (e.clientY - startY) / zoom;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setPlacedComponents(prev => prev.map(comp =>
          selectedComponents.includes(comp.id)
            ? {
                ...comp,
                position: {
                  x: startPositions[comp.id].x + dx,
                  y: startPositions[comp.id].y + dy
                }
              }
            : comp
        ));
        updateConnectionAnchors();
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      addToHistory();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleComponentDelete = () => {
    setPlacedComponents(prev => prev.filter(comp => !selectedComponents.includes(comp.id)));
    setConnections(prev => prev.filter(conn =>
      !selectedComponents.includes(conn.from) && !selectedComponents.includes(conn.to)
    ));
    setSelectedComponents([]);
    setSelectedConnection(null);
    addToHistory();
  };

  const handleConnectionStart = (e, componentId) => {
    if (isConnecting) {
      const rect = panelRef.current ? panelRef.current.getBoundingClientRect() : null;
      setConnectionStart({
        id: componentId,
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom
      });
    }
  };

  const getAnchorPosition = (component, anchor) => {
    const width = 100;
    const height = 100;
    switch (anchor) {
      case 'top':
        return { x: component.position.x + width / 2, y: component.position.y };
      case 'right':
        return { x: component.position.x + width, y: component.position.y + height / 2 };
      case 'bottom':
        return { x: component.position.x + width / 2, y: component.position.y + height };
      case 'left':
        return { x: component.position.x, y: component.position.y + height / 2 };
    }
  };

  const getClosestAnchor = (component, point) => {
    const anchors = ['top', 'right', 'bottom', 'left'];
    return anchors.reduce((closest, anchor) => {
      const anchorPos = getAnchorPosition(component, anchor);
      const distance = Math.sqrt(Math.pow(anchorPos.x - point.x, 2) + Math.pow(anchorPos.y - point.y, 2));
      return distance < Math.sqrt(Math.pow(getAnchorPosition(component, closest).x - point.x, 2) + Math.pow(getAnchorPosition(component, closest).y - point.y, 2)) ? anchor : closest;
    });
  };

  // const isNearAnchor = (x: number, y: number, component: Component) => {
  //   const anchorX = component.position.x + 50; // Assuming component width is 100
  //   const anchorY = component.position.y + 50; // Assuming component height is 100
  //   const dx = x - anchorX;
  //   const dy = y - anchorY;
  //   return Math.sqrt(dx * dx + dy * dy) < 20; // 20px radius
  // };

  const handleConnectionEnd = (e) => {
    if (isConnecting && connectionStart) {
      const rect = panelRef.current ? panelRef.current.getBoundingClientRect() : null;
      const endX = (e.clientX - rect.left) / zoom;
      const endY = (e.clientY - rect.top) / zoom;

      // const targetComponent = placedComponents.find(comp => isNearAnchor(endX, endY, comp));
      const targetComponent = placedComponents.find(comp =>
        endX >= comp.position.x && endX <= comp.position.x + 100 &&
        endY >= comp.position.y && endY <= comp.position.y + 100
      );

      if (targetComponent && targetComponent.id !== connectionStart.id) {
        const sourceComponent = placedComponents.find(c => c.id === connectionStart.id);

        if (sourceComponent) {
          const fromAnchor = getClosestAnchor(sourceComponent, { x: connectionStart.x, y: connectionStart.y });
          const toAnchor = getClosestAnchor(targetComponent, { x: endX, y: endY });

          setConnections(prev => [...prev, {
            id: Date.now().toString(),
            from: connectionStart.id,
            to: targetComponent.id,
            fromAnchor,
            toAnchor,
            color: categoryColors[sourceComponent.category] || 'rgb(209, 213, 219)'
          }]);
          addToHistory();
        }
      }
    }
    setIsConnecting(false);
    setConnectionStart(null);
    setConnectionEnd(null);
  };

  const handleConnectionClick = (e, connectionId) => {
    e.stopPropagation();
    setSelectedConnection(connectionId);
    setSelectedComponents([]);
  };

  const handleConnectionDelete = () => {
    if (selectedConnection) {
      setConnections(prev => prev.filter(conn => conn.id !== selectedConnection));
      setSelectedConnection(null);
      addToHistory();
    }
  };

  const updateConnectionAnchors = () => {
    setConnections(prev => prev.map(conn => {
      const fromComponent = placedComponents.find(c => c.id === conn.from);
      const toComponent = placedComponents.find(c => c.id === conn.to);
      if (fromComponent && toComponent) {
        const fromAnchor = getClosestAnchor(fromComponent, getAnchorPosition(toComponent, conn.toAnchor));
        const toAnchor = getClosestAnchor(toComponent, getAnchorPosition(fromComponent, conn.fromAnchor));
        return { ...conn, fromAnchor, toAnchor };
      }
      return conn;
    }));
  };

  const renderComponent = (comp) => (
    <div
      key={comp.id}
      className={`absolute p-4 rounded-lg shadow-md border-2 ${
        selectedComponents.includes(comp.id) ? 'border-blue-500' : 'border-transparent'
      } transition-all duration-200 ease-in-out transform hover:scale-105 select-none`}
      style={{
        left: comp.position.x,
        top: comp.position.y,
        width: '100px',
        height: '100px',
        cursor: isConnecting ? 'crosshair' : 'move',
        backgroundColor: categoryColors[comp.category],
        color: 'black',
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
      }}
      onClick={(e) => handleComponentClick(e, comp.id)}
      onDoubleClick={() => handleComponentDoubleClick(comp.id)}
      onMouseDown={(e) => {
        if (e.button === 0 && !isConnecting) {
          handleComponentMove(e, comp.id);
        } else if (isConnecting) {
          handleConnectionStart(e, comp.id);
        }
      }}
    >
      {comp.type}
      {connections.some(conn => conn.from === comp.id || conn.to === comp.id) && (
        <>
          <div className="absolute top-1/2 left-0 w-2 h-2 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-2 h-2 bg-gray-300 rounded-full transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-gray-300 rounded-full transform -translate-x-1/2 translate-y-1/2" />
        </>
      )}
    </div>
  );

  const renderConnections = () => {
    return connections.map((conn) => {
      const from = placedComponents.find(c => c.id === conn.from);
      const to = placedComponents.find(c => c.id === conn.to);
      if (!from || !to) return null;

      const fromPos = getAnchorPosition(from, conn.fromAnchor);
      const toPos = getAnchorPosition(to, conn.toAnchor);

      const dx = toPos.x - fromPos.x;
      const dy = toPos.y - fromPos.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;

      return (
        <g key={conn.id} onClick={(e) => handleConnectionClick(e, conn.id)}>
          <line
            x1={fromPos.x}
            y1={fromPos.y}
            x2={toPos.x}
            y2={toPos.y}
            stroke={conn.color}
            strokeWidth="2"
            className={selectedConnection === conn.id ? 'stroke-blue-500' : ''}
          />
          <polygon
            points="-5,-3 0,0 -5,3"
            fill={conn.color}
            transform={`translate(${toPos.x},${toPos.y}) rotate(${angle})`}
          />
          <polygon
            points="-5,-3 0,0 -5,3"
            fill={conn.color}
            transform={`translate(${midX},${midY}) rotate(${angle})`}
          />
        </g>
      );
    });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const returnToOrigin = () => {
    if (placedComponents.length > 0) {
      const firstComponent = placedComponents[0];
      const newPanPosition = {
        x: -firstComponent.position.x * zoom + window.innerWidth / 4,
        y: -firstComponent.position.y * zoom + window.innerHeight / 4,
      };
      setPanPosition(newPanPosition);
      setPlacedComponents(prev => prev.map(comp => ({
        ...comp,
        position: {
          x: comp.position.x + newPanPosition.x / zoom,
          y: comp.position.y + newPanPosition.y / zoom,
        }
      })));
    } else {
      setPanPosition({ x: 0, y: 0 });
    }
    setIsPanMoved(false);
  };

  const addToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ components: placedComponents, connections });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      const { components, connections } = history[historyIndex - 1];
      setPlacedComponents(components);
      setConnections(connections);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      const { components, connections } = history[historyIndex + 1];
      setPlacedComponents(components);
      setConnections(connections);
    }
  };

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.2, 0.5));
  };

  const handleClearEditor = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearEditor = () => {
    setPlacedComponents([]);
    setConnections([]);
    addToHistory();
    setShowClearConfirmation(false);
  };

  const handleConnect = () => {
    if (selectedComponents.length < 2) return;

    const newConnections = selectedComponents.slice(0, -1).map((fromId, index) => {
      const from = placedComponents.find(c => c.id === fromId);
      const to = placedComponents.find(c => c.id === selectedComponents[index + 1]);
      if (!from || !to) return null;

      const fromAnchor = getClosestAnchor(from, getAnchorPosition(to, 'top'));
      const toAnchor = getClosestAnchor(to, getAnchorPosition(from, fromAnchor));

      return {
        id: Date.now().toString() + index,
        from: fromId,
        to: selectedComponents[index + 1],
        fromAnchor,
        toAnchor,
        color: categoryColors[from.category] || 'rgb(209, 213, 219)'
      };
    }).filter(Boolean);

    setConnections(prev => [...prev, ...newConnections]);
    addToHistory();
  };

  const isFullyConnected = selectedComponents.length >= 2 && selectedComponents.every(id => {
    const component = placedComponents.find(c => c.id === id);
    return component && connections.some(conn => conn.from === component.id || conn.to === component.id);
  });

  return (
    <div className="relative flex-1 overflow-hidden select-none">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
      <div className="flex space-x-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg mr-4">
        <div className="flex space-x-1 mr-2 dark:bg-gray-700 p-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <ArrowUturnLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <ArrowUturnRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex space-x-1 mr-2">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleConnect}
            className={`p-1 rounded-full transition-colors ${
              selectedComponents.length >= 2
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={selectedComponents.length < 2}
          >
            Connect
          </button>
          <button
            onClick={handleComponentDelete}
            className={`p-1 rounded-full transition-colors ${
              selectedComponents.length > 0 || selectedConnection
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={selectedComponents.length === 0 && !selectedConnection}
          >
            <TrashIcon className={`w-4 h-4 ${selectedComponents.length > 0 || selectedConnection ? 'text-white' : 'text-gray-500'}`} />
          </button>
          <button
            onClick={handleClearEditor}
            className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
        <button
          onClick={toggleFullScreen}
          className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          {isFullScreen ? (
            <ArrowsPointingInIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ArrowsPointingOutIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
      {isPanMoved && (
        <button
          onClick={returnToOrigin}
          className="absolute top-14 right-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}
      <div
        ref={panelRef}
        className="w-full h-full cursor-move bg-gray-50 dark:bg-gray-900"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          backgroundImage: 'linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)',
          backgroundSize: `${100 * zoom}px ${100 * zoom}px`,
          backgroundPosition: `${panPosition.x % (100 * zoom)}px ${panPosition.y % (100 * zoom)}px`,
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <svg className="absolute inset-0 pointer-events-none" style={{ minWidth: '100%', minHeight: '100%' }}>
          {renderConnections()}
          {isConnecting && connectionStart && connectionEnd && (
            <line
              x1={connectionStart.x}
              y1={connectionStart.y}
              x2={connectionEnd.x}
              y2={connectionEnd.y}
              stroke="black"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>
        {placedComponents.map(renderComponent)}
      </div>
      <Dialog open={showClearConfirmation} onOpenChange={setShowClearConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Editor</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear the editor? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClearEditor}>
              Clear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuilderPanel;