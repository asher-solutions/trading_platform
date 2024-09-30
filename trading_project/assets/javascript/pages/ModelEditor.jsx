// assets/javascript/pages/ModelEditor.jsx

import React, { useState, useEffect } from 'react';
import BaseLayout from '../../components/layout/BaseLayout';
import Sidebar from '../../components/layout/Sidebar';
import BuilderPanel from '../../components/model-editor/BuilderPanel';
import ModelsList from '../../components/model-editor/ModelsList';
import ActionBar from '../../components/model-editor/ActionBar';

const ModelEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleDrop = (component, category) => {
    // Handle drop logic here
    console.log(`Dropped component: ${component} from category: ${category}`);
  };

  const handleCompile = () => {
    console.log('Compiling model...');
  };

  const handleSave = () => {
    console.log('Saving model...');
  };

  const handleBacktest = () => {
    console.log('Backtesting model...');
  };

  return (
    <BaseLayout hideNavbar={isFullScreen}>
    <div className={`flex h-full ${isFullScreen ? 'h-screen' : ''}`}>
      {(!isFullScreen || (isFullScreen && window.innerWidth > 768)) && (
        <Sidebar
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          onDrop={handleDrop}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <BuilderPanel
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <ActionBar
              onCompile={handleCompile}
              onSave={handleSave}
              onBacktest={handleBacktest}
            />
          </div>
      </div>
      {(!isFullScreen || (isFullScreen && window.innerWidth > 768)) && <ModelsList />}
    </div>
  </BaseLayout>
);
};

export default ModelEditor;