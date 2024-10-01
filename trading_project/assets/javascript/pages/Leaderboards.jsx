// assets/javascript/components/Leaderboards.jsx

import React from 'react';

const Leaderboards = ({ models, usedModels, onUseModel, onEditModel, onRemoveModel, onSelectModel }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2 text-left">Rank</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Performance</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model, index) => (
            <tr key={model.id} className="border-b dark:border-gray-600">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{model.name}</td>
              <td className="p-2">{(model.performance * 100).toFixed(2)}%</td>
              <td className="p-2">
                {model.inUse ? (
                  <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">In Use</span>
                ) : (
                  <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2 text-sm" onClick={() => onUseModel(model.id)}>
                    Use Model
                  </button>
                )}
                <button className="px-2 py-1 bg-gray-500 text-white rounded mr-2 text-sm" onClick={() => onEditModel(model.id)}>
                  Edit
                </button>
                <button className="px-2 py-1 bg-red-500 text-white rounded text-sm" onClick={() => onRemoveModel(model.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboards;