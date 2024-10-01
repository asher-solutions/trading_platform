// assets/javascript/components/model-editor/ModelsList.jsx

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronRightIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/solid';
import { api } from '../../utils/api';

const ModelsList = () => {
  const [expandedModels, setExpandedModels] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.getModels();
        setModels(response);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    fetchModels();
  }, []);

  const toggleModel = (modelId) => {
    setExpandedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'beta': return 'bg-yellow-500';
      case 'alpha': return 'bg-blue-500';
      case 'production': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`relative ${isOpen ? 'w-64' : 'w-12'} transition-all duration-300 ease-in-out`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-2 left-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 z-10"
      >
        {isOpen ? (
          <ChevronDoubleRightIcon className="w-6 h-6" />
        ) : (
          <ChevronDoubleLeftIcon className="w-6 h-6" />
        )}
      </button>
      {isOpen && (
        <div className="h-full p-4 pt-12 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Your Models</h2>
          <div className="w-64 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
            <div className="px-4 pb-4">
              {models.map((model) => (
                <div key={model.id} className="mb-4">
                  <button
                    onClick={() => toggleModel(model.id)}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-700 dark:text-gray-300"
                  >
                    {model.name}
                    {expandedModels.includes(model.id) ? (
                      <ChevronDownIcon className="w-5 h-5" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5" />
                    )}
                  </button>
                  {expandedModels.includes(model.id) && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {model.versions.map((version) => (
                        <li
                          key={version.id}
                          className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded shadow"
                        >
                          <span>{version.version}</span>
                          <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(version.status)}`}>
                            {version.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelsList;