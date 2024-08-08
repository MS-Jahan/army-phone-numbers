// InstallPWAModal.jsx
import React from 'react';

const InstallPWAModal = ({ isOpen, onClose, onInstall }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-4">Install Our App</h2>
        <p className="mb-4">Install our app for a better experience and offline access.</p>
        <div className="flex justify-end">
          <button 
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Not Now
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={onInstall}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWAModal;