// assets/javascript/components/Sidebar.jsx

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, Bars3Icon } from '@heroicons/react/24/solid';

const componentTree = {
  'Enter Strategies': ['Strategy A', 'Strategy B'],
  'Exit Strategies': ['Strategy X', 'Strategy Y'],
  'Signal Models': ['Model 1', 'Model 2'],
  'Data Loader': ['Loader A', 'Loader B'],
  'Market Scanner': ['Scanner 1', 'Scanner 2'],
  'Environment Conditions': ['Condition A', 'Condition B'],
  'Custom': ['Custom 1', 'Custom 2'],
};

const Sidebar = ({ selectedTemplate, setSelectedTemplate, onDrop }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [draggedComponent, setDraggedComponent] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleDragStart = (e, component, category) => {
    e.dataTransfer.setData('text/plain', component);
    e.dataTransfer.setData('category', category);
    setDraggedComponent(component);
  };

  const handleDragEnd = () => {
    setDraggedComponent(null);
  }

  return (
    <div className={`relative ${isOpen ? 'w-64' : 'w-12'} transition-all duration-300 ease-in-out`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 z-10"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="h-full flex flex-col">
          <div className="p-4 pt-16 mb-4">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="default">Default Template</option>
              <option value="advanced">Advanced Template</option>
              <option value="custom">Custom Template</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-4">
            {Object.entries(componentTree).map(([category, components]) => (
              <div key={category} className="mb-4">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  {category}
                  {expandedCategories.includes(category) ? (
                    <ChevronDownIcon className="w-5 h-5" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5" />
                  )}
                </button>
                {expandedCategories.includes(category) && (
                  <ul className="ml-4 mt-2 space-y-2">
                    {components.map((component) => (
                      <li
                        key={component}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component, category)}
                        onDragEnd={handleDragEnd}
                        className={`p-2 bg-white dark:bg-gray-700 rounded shadow cursor-move ${
                          draggedComponent === component ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        {component}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;