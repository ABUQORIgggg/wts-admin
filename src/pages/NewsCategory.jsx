import React, { useState, useEffect } from 'react';
import { FaSpinner, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdPaper } from 'react-icons/io';
import Loading from '../components/Loading';

const NewsCategory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category_name: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchNewsCategories = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/v1/news-category');
      const categories = await response.json();
      setData(categories);
    } catch (error) {
      console.error('Error fetching news categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsCategories();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isEditing && editingId) {
        response = await fetch(`http://localhost:9000/api/v1/news-category/update/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch('http://localhost:9000/api/v1/news-category/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ category_name: 'Sample Category' })
      });      
      }

      if (response.ok) {
        const updatedCategory = await response.json();
        if (isEditing) {
          setData(data.map((cat) => (cat._id === editingId ? updatedCategory : cat)));
          setIsEditing(false);
          setEditingId(null);
        } else {
          setData([...data, updatedCategory]);
        }

        document.getElementById('my_modal_news_category').close();
        setFormData({ category_name: '' });
      } else {
        console.error('Error adding/updating news category');
      }
    } catch (error) {
      console.error('Error adding/updating news category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:9000/api/v1/news-category/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData(data.filter((category) => category._id !== id));
        alert('News category deleted successfully');
      } else {
        console.error('Error deleting news category');
      }
    } catch (error) {
      console.error('Error deleting news category:', error);
    }
  };

  const handleEdit = (category) => {
    setFormData({ category_name: category.category_name });
    setEditingId(category._id);
    setIsEditing(true);
    document.getElementById('my_modal_news_category').showModal();
  };

  return (
    <div className="p-5 flex flex-col w-10/15 gap-5 text-white">
      <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary flex gap-2">
          <IoMdPaper className="size-9" /> News Categories
        </h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => {
            setIsEditing(false);
            setFormData({ category_name: '' });
            document.getElementById('my_modal_news_category').showModal();
          }}
        >
          <FaPlus className="mr-2" /> Add News Category
        </button>
      </div>

      <dialog id="my_modal_news_category" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById('my_modal_news_category').close()}
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
                placeholder="News Category Name"
                required
              />
            </label>
            <button type="submit" className="btn mt-5">
              {isEditing ? 'Edit News Category' : 'Add News Category'}
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
                  <td colSpan="3" className="text-center w-full h-full flex justify-center items-center">
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
                  <td colSpan="3" className="text-center">No news categories available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsCategory;
