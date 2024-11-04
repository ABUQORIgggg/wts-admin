import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaEdit } from 'react-icons/fa';

const Layout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    sectionTheme: 'lemarc1',
    images: [],
    imagePreviews: [],
    title: '',
    description: '',
    layout_text_position: 'left',
    layout_images_position: 'right',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchLayouts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/v1/layout');
      if (!response.ok) throw new Error('Failed to fetch layouts from API');
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error fetching layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const updatedImages = Array.from(files);
      const updatedPreviews = updatedImages.map((file) => URL.createObjectURL(file));
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: updatedImages,
        imagePreviews: updatedPreviews,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || formData.images.length < 1) {
      alert('Please complete all required fields and upload at least one image.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('sectionTheme', formData.sectionTheme);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('layout_text_position', formData.layout_text_position);
    formDataToSend.append('layout_images_position', formData.layout_images_position);
    formData.images.forEach((image) => formDataToSend.append('images', image));

    try {
      const response = await fetch(
        isEditing ? `http://localhost:9000/api/v1/layout/${editingId}` : 'http://localhost:9000/api/v1/layout/create',
        {
          method: isEditing ? 'PUT' : 'POST',
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error('Failed to save layout');
      const result = await response.json();

      setData(
        isEditing
          ? data.map((layout) => (layout._id === editingId ? result.data : layout))
          : [...data, result.data]
      );
      setIsEditing(false);
      setEditingId(null);
      document.getElementById('layout_modal').close();
      setFormData({
        sectionTheme: 'lemarc1',
        images: [],
        imagePreviews: [],
        title: '',
        description: '',
        layout_text_position: 'left',
        layout_images_position: 'right',
      });
    } catch (error) {
      console.error('Error saving layout:', error.message);
      alert(`Failed to save layout: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:9000/api/v1/layout/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete layout');
      setData(data.filter((layout) => layout._id !== id));
    } catch (error) {
      console.error('Error deleting layout:', error.message);
    }
  };

  const handleEdit = (layout) => {
    setFormData({
      sectionTheme: layout.sectionTheme[0],
      title: layout.title[0],
      description: layout.description[0],
      layout_text_position: layout.layout_text_position,
      layout_images_position: layout.layout_images_position,
      images: [],  // New images will be added here on form submit
      imagePreviews: layout.images.map((image) => `http://localhost:9000${image}`),
    });
    setIsEditing(true);
    setEditingId(layout._id);
    document.getElementById('layout_modal').showModal();
  };

  return (
    <div className="p-5 flex flex-col gap-5 text-white">
      <div className="bg-base-200 p-5 flex justify-between items-center rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold text-primary">Layouts</h1>
        <button
          className="btn btn-primary flex items-center py-2 px-4 rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            setIsEditing(false);
            setFormData({ sectionTheme: 'lemarc1', images: [], imagePreviews: [], title: '', description: '', layout_text_position: 'left', layout_images_position: 'right' });
            document.getElementById('layout_modal').showModal();
          }}
        >
          <FaPlus className="mr-2" /> Add Layout
        </button>
      </div>

      <dialog id="layout_modal" className="modal">
        <div className="modal-box rounded-lg bg-white p-6 shadow-xl max-w-xl mx-auto relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 hover:text-gray-700">X</button>
          </form>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            {isEditing ? 'Edit Layout' : 'Add New Layout'}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Section Theme</label>
              <select
                name="sectionTheme"
                value={formData.sectionTheme}
                onChange={handleFormChange}
                className="select select-bordered p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="lemarc1">Lemarc1</option>
                <option value="lemarc2">Lemarc2</option>
                <option value="lemarc3">Lemarc3</option>
                <option value="lemarc4">Lemarc4</option>
                <option value="lemarc5">Lemarc5</option>
                <option value="lemarc6">Lemarc6</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                className="input input-bordered rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                required
                className="input input-bordered rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Images</label>
              <input
                type="file"
                name="images"
                onChange={handleFormChange}
                multiple
                accept="image/*"
                className="input input-bordered p-2 rounded-md border border-gray-300"
              />
              <div className="flex flex-wrap gap-4 mt-2">
                {formData.imagePreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-md shadow-md" />
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full py-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white mt-4">
              {isEditing ? 'Save Changes' : 'Add Layout'}
            </button>
          </form>
        </div>
      </dialog>

      <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl shadow-lg">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Images</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((layout) => (
                  <tr key={layout._id}>
                    <td>{layout._id}</td>
                    <td>
                      {layout.images.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:9000${image}`}
                          alt="Layout"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ))}
                    </td>
                    <td>{layout.title[0]}</td>
                    <td>{layout.description[0].length > 50 ? layout.description[0].slice(0, 50) + '...' : layout.description[0]}</td>
                    <td className="flex gap-2">
                      <button className="btn bg-gray-800 text-white py-1 px-2 rounded-md hover:bg-gray-700" onClick={() => handleEdit(layout)}>
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button className="btn bg-red-700 text-white py-1 px-2 rounded-md hover:bg-red-600" onClick={() => handleDelete(layout._id)}>
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500">
                    No layouts available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && (
            <div className="flex justify-center mt-5">
              <FaSpinner className="animate-spin text-5xl text-blue-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
