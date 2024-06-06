// WidgetModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../index.css';

const WidgetModal = ({ widget, isOpen, onClose, onSave, onDelete, onUpload }) => {
  const [data, setData] = useState(widget.data);

  useEffect(() => {
    setData(widget.data);
  }, [widget]);

  const handleSave = () => {
    onSave(widget.id, data);
    onClose();
  };

  const handleDelete = () => {
    onDelete(widget.id);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Widget Editor"
      className="modal"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
      style={{
        content: {
          pointerEvents: 'auto'
        }
      }}
    >
      <h2 className="text-2xl mb-4">Edit Widget</h2>
      {widget.type === 'text' && (
        <div>
          <label className="block text-sm font-bold mb-2">Text:</label>
          <textarea
            name="text"
            value={data.text || ''}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      )}
      {widget.type === 'image' && (
        <div>
          <label className="block text-sm font-bold mb-2">Image:</label>
          <input type="file" onChange={handleImageUpload} className="w-full mb-2" />
          {data.imageUrl && <img src={data.imageUrl} alt="Uploaded" className="w-full h-auto" />}
        </div>
      )}
      {/* Add similar sections for other widget types if needed */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default WidgetModal;
