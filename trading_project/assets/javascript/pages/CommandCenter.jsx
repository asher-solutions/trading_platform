// assets/javascript/pages/CommandCenter.jsx

import React, { useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import CommandCenterPanel from '../components/command-center/CommandCenterPanel';
import { PlusIcon } from '@heroicons/react/solid';

const CommandCenter = () => {
  const [panels, setPanels] = useState([{ id: 1 }]);

  const addPanel = () => {
    if (panels.length < 4) {
      setPanels([...panels, { id: Date.now() }]);
    }
  };

  const removePanel = (id) => {
    setPanels(panels.filter(panel => panel.id !== id));
  };

  return (
    <BaseLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Command Center</h1>
        <div className="grid grid-cols-2 gap-4">
          {panels.map(panel => (
            <CommandCenterPanel key={panel.id} onClose={() => removePanel(panel.id)} />
          ))}
        </div>
        {panels.length < 4 && (
          <button
            onClick={addPanel}
            className="mt-4 flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors duration-300"
          >
            <PlusIcon className="h-8 w-8 mr-2" />
            Add Panel
          </button>
        )}
      </div>
    </BaseLayout>
  );
};

export default CommandCenter;