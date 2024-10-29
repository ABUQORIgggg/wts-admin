import React, { useState, useEffect } from 'react';
import { FaSpinner, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdPaper } from 'react-icons/io';

const Category = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category_name: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Для управления режимом редактирования
  const [editingId, setEditingId] = useState(null); // Для хранения редактируемой категории

  // Запрос данных категорий
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/v1/categories');
      const categories = await response.json();
      setData(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Обработка изменения формы
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Обработка отправки формы (Создание или редактирование)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isEditing && editingId) {
        // Обновление категории
        response = await fetch(`http://localhost:9000/api/v1/categories/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Создание новой категории
        response = await fetch('http://localhost:9000/api/v1/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const updatedCategory = await response.json();
      if (isEditing) {
        setData(data.map((cat) => (cat._id === editingId ? updatedCategory : cat)));
        setIsEditing(false);
        setEditingId(null);
      } else {
        setData([...data, updatedCategory]); // Добавление новой категории
      }

      document.getElementById('my_modal_category').close();
      setFormData({ category_name: '' }); // Очистка формы
    } catch (error) {
      console.error('Error adding/updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обработка удаления категории
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:9000/api/v1/categories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData(data.filter((category) => category._id !== id));
        alert('Category deleted successfully');
      } else {
        console.error('Error deleting category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Обработка редактирования категории
  const handleEdit = (category) => {
    setFormData({ category_name: category.category_name });
    setEditingId(category._id);
    setIsEditing(true);
    document.getElementById('my_modal_category').showModal();
  };

  return (
    <div className="p-5 flex flex-col w-10/15 gap-5 text-white">
      <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary flex gap-2">
          <IoMdPaper className="size-9" /> Categories
        </h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => {
            setIsEditing(false); // Переход в режим создания
            setFormData({ category_name: '' });
            document.getElementById('my_modal_category').showModal();
          }}
        >
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>

      <dialog id="my_modal_category" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
          </form>
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
            <button type="submit" className="btn mt-5">{isEditing ? 'Edit Category' : 'Add Category'}</button>
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
                    <FaSpinner className="animate-spin text-5xl text-gray-500" />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((category) => (
                  <tr key={category._id}>
                    <td>{category._id}</td>
                    <td>{category.category_name}</td>
                    <td className="flex gap-2">
                      <button className="btn btn-sm bg-slate-800 text-white flex items-center" onClick={() => handleEdit(category)}>
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button className="btn btn-sm bg-red-500 text-white flex items-center" onClick={() => handleDelete(category._id)}>
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No categories available</td>
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
