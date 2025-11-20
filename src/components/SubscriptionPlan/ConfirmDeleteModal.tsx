import React from "react";
import deletewarning from '../../assets/deletewarning.png'

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <div className="flex justify-center mb-4">
          <div>
            <img className="text-red-500 text-4xl" src={deletewarning}/>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-2">Are You Sure?</h2>
        <p className="text-gray-500 mb-6">Are you sure want to delete this plan?!</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#68B39F] text-white px-4 py-2 rounded-md hover:bg-[#58a18e]"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
