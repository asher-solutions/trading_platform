// assets/javascript/pages/ModelEditor.jsx

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import BaseLayout from '../components/layout/BaseLayout';
import Sidebar from '../components/layout/Sidebar';
import BuilderPanel from '../components/model-editor/BuilderPanel';
import ModelsList from '../components/model-editor/ModelsList';
import ActionBar from '../components/model-editor/ActionBar';

const ModelEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    const fetchComponents = async () => {
        try {
          const response = await api.getComponents();
          setComponents(response);
        } catch (error) {
          console.error('Error fetching components:', error);
        }
      };
    fetchComponents();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleDrop = async (component, category) => {
    // Handle drop logic here
    try {
      //   const modelApi = new ModelApi();
      //   const response = await modelApi.addComponentToModel({
      //   componentId: component.id,
      //   category: category,
      // });
      await api.addComponentToModel({
        componentId: component.id,
        category: category,
      });
      console.log(`Dropped component: ${component} from category: ${category}`);
      // Update the BuilderPanel with the new component
      // This will depend on how you've implemented the BuilderPanel
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  const handleCompile = async () => {
    try {
      await api.compileModel();
      console.log('Model compiled successfully');
    } catch (error) {
      console.error('Error compiling model:', error);
    }
  };

  const handleSave = async () => {
    try {
      await api.saveModel();
      console.log('Model saved successfully');
    } catch (error) {
      console.error('Error saving model:', error);
    }
  };

  const handleBacktest = async () => {
    try {
      await api.backtestModel();
      console.log('Model backtested successfully');
    } catch (error) {
      console.error('Error backtesting model:', error);
    }
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