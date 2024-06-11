import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../index.css';

const availableFonts = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Times New Roman, serif',
  'Georgia, serif',
  'Courier New, monospace',
  'Verdana, sans-serif',
  'Tahoma, sans-serif',
  'Trebuchet MS, sans-serif',
  'Lucida Console, monospace'
];

const WidgetModal = ({ widget, isOpen, onClose, onSave, onDelete, token }) => {
  const [data, setData] = useState(widget.data);
  const [pages, setPages] = useState([]);
  const [linkType, setLinkType] = useState(data.pageLink ? 'page' : 'custom');

  const fetchPages = useCallback(async () => {
    try {
      console.log(`Fetching website ID for widget: ${widget.id}`);
      const response = await axios.get(`http://localhost:5001/api/page/${widget.id}/website`, {
        headers: { 'x-auth-token': token }
      });
      const websiteId = response.data.websiteId;
      console.log(`Fetching pages for website: ${websiteId}`);

      const pagesResponse = await axios.get(`http://localhost:5001/api/website/${websiteId}/pages`, {
        headers: { 'x-auth-token': token }
      });
      console.log('Pages fetched:', pagesResponse.data);
      setPages(pagesResponse.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  }, [widget.id, token]);

  useEffect(() => {
    setData(widget.data);
    fetchPages();
  }, [widget, fetchPages]);

  const handleSave = () => {
    onSave(widget.id, data);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === 'checkbox' ? checked : value });
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
    >
      <h2 className="text-2xl mb-4">Edit Widget</h2>
      {widget.type === 'text' && (
        <div>
          <label className="block text-sm font-bold mb-2">Text:</label>
          <textarea
            name="text"
            value={data.text || ''}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1 mb-2"
          />
          <label className="block text-sm font-bold mb-2">Font Size:</label>
          <input
            type="number"
            name="fontSize"
            value={data.fontSize || 16}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1 mb-2"
          />
          <label className="block text-sm font-bold mb-2">Font Family:</label>
          <select
            name="fontFamily"
            value={data.fontFamily || 'Arial, sans-serif'}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1 mb-2"
          >
            {availableFonts.map((font, index) => (
              <option key={index} value={font} style={{ fontFamily: font }}>
                {font.split(',')[0]}
              </option>
            ))}
          </select>
          <label className="block text-sm font-bold mb-2">Font Color:</label>
          <input
            type="color"
            name="fontColor"
            value={data.fontColor || '#000000'}
            onChange={handleInputChange}
            className="w-full mb-2"
          />
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="bold"
              checked={data.bold || false}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="block text-sm font-bold">Bold</label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="italic"
              checked={data.italic || false}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="block text-sm font-bold">Italic</label>
          </div>
          <label className="block text-sm font-bold mb-2">Text Align:</label>
          <select
            name="textAlign"
            value={data.textAlign || 'left'}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1 mb-2"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      )}
      {widget.type === 'image' && (
        <div>
          <label className="block text-sm font-bold mb-2">Image:</label>
          <input type="file" onChange={handleImageUpload} className="w-full mb-2" />
          {data.imageUrl && <img src={data.imageUrl} alt="Uploaded" className="w-full h-auto" />}
        </div>
      )}
      {widget.type === 'shape' && (
        <div>
          <label className="block text-sm font-bold mb-2">Shape:</label>
          <select
            name="shape"
            value={data.shape || 'rectangle'}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1 mb-2"
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
          </select>
          <label className="block text-sm font-bold mb-2">Width:</label>
          <input
            type="number"
            name="width"
            value={data.width || 100}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1 mb-2"
          />
          <label className="block text-sm font-bold mb-2">Height:</label>
          <input
            type="number"
            name="height"
            value={data.height || 100}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1 mb-2"
          />
          <label className="block text-sm font-bold mb-2">Color:</label>
          <input
            type="color"
            name="color"
            value={data.color || '#000000'}
            onChange={handleInputChange}
            className="w-full mb-2"
          />
          <label className="block text-sm font-bold mb-2">Opacity:</label>
          <input
            type="range"
            name="opacity"
            min="0"
            max="1"
            step="0.01"
            value={data.opacity !== undefined ? data.opacity : 1}
            onChange={handleInputChange}
            className="w-full mb-2"
          />
        </div>
      )}
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          name="clickable"
          checked={data.clickable || false}
          onChange={handleInputChange}
          className="mr-2"
        />
        <label className="block text-sm font-bold">Clickable</label>
      </div>
      {data.clickable && (
        <div>
          <label className="block text-sm font-bold mb-2">Link Type:</label>
          <select
            value={linkType}
            onChange={(e) => setLinkType(e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
          >
            <option value="custom">Custom Link</option>
            <option value="page">Link to Page</option>
          </select>
          {linkType === 'custom' ? (
            <div>
              <label className="block text-sm font-bold mb-2">Link:</label>
              <input
                type="text"
                name="link"
                value={data.link || ''}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 mb-2"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold mb-2">Select Page:</label>
              <select
                name="pageLink"
                value={data.pageLink || ''}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 mb-2"
              >
                <option value="">Select Page</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onDelete(widget.id);
            onClose();
          }}
          className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default WidgetModal;