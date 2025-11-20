import React from 'react';
import { CloseIcon } from './icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3">
            <div/> {/* Empty div for spacing */}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-300">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;