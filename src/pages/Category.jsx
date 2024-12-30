import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdPaper } from 'react-icons/io';
import Loading from '../components/Loading';

const Category = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ category_name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('https://bakend-wtc.onrender.com/api/v1/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const categories = await response.json();
      setData(categories);
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission (Create or Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const response = isEditing
        ? await fetch(`https://bakend-wtc.onrender.com/api/v1/categories/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
        : await fetch('https://bakend-wtc.onrender.com/api/v1/categories/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

      if (!response.ok) throw new Error('Failed to save category');
      const updatedCategory = await response.json();

      if (isEditing) {
        setData((prevData) =>
          prevData.map((cat) => (cat._id === editingId ? updatedCategory : cat))
        );
      } else {
        setData((prevData) => [...prevData, updatedCategory]);
      }

      closeModal();
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`https://bakend-wtc.onrender.com/api/v1/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete category');
      setData((prevData) => prevData.filter((category) => category._id !== id));
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error deleting category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit category
  const handleEdit = (category) => {
    setFormData({ category_name: category.category_name });
    setEditingId(category._id);
    setIsEditing(true);
    document.getElementById('my_modal_category').showModal();
  };

  const closeModal = () => {
    document.getElementById('my_modal_category').close();
    setFormData({ category_name: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="p-5 flex flex-col w-full gap-5 text-white">
      <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary flex gap-2">
          <IoMdPaper className="size-9" /> Categories
        </h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => {
            setIsEditing(false);
            setFormData({ category_name: '' });
            document.getElementById('my_modal_category').showModal();
          }}
        >
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-error text-white">
          {errorMessage}
        </div>
      )}

      <dialog id="my_modal_category" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            X
          </button>
          <form onSubmit={handleFormSubmit}>
            <label className="input input-bordered flex items-center gap-2 mt-10">
              Category Name
              <input
                type="text"
                name="category_name"
                value={formData.category_name}
                onChange={handleFormChange}
                className="grow"
                placeholder="Category Name"
                required
              />
            </label>
            <button type="submit" className="btn mt-5">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </button>
          </form>
        </div>
      </dialog>

      <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    <Loading />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((category) => (
                  <tr key={category._id}>
                    <td>{category._id}</td>
                    <td>{category.category_name}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm bg-slate-800 text-white flex items-center"
                        onClick={() => handleEdit(category)}
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button
                        className="btn btn-sm bg-red-500 text-white flex items-center"
                        onClick={() => handleDelete(category._id)}
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No categories available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Category;
