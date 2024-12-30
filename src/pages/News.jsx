import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { IoMdPaper } from 'react-icons/io';
import Loading from '../components/Loading';

const News = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsTypes, setNewsTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: '',
    images: [],
  });

  // Fetch news and news types data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://bakend-wtc.onrender.com/api/v1/layout/about');
        if (!response.ok) throw new Error('Network error');
        const news = await response.json();
        setData(news);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNewsTypes = async () => {
      try {
        const response = await fetch('https://bakend-wtc.onrender.com/api/v1/layout-type');
        if (!response.ok) throw new Error('Network error');
        const types = await response.json();
        setNewsTypes(types);
      } catch (error) {
        console.error('Error loading news types:', error);
      }
    };

    fetchData();
    fetchNewsTypes();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: files,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description || !formData.date || !formData.type) {
      alert('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('date', formData.date);
      form.append('type', formData.type);
      formData.images.forEach((file) => form.append('images', file));

      const url = isEditing
        ? `https://bakend-wtc.onrender.com/api/v1/layout/about/${editingId}`
        : 'https://bakend-wtc.onrender.com/api/v1/layout/about-create';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        body: form,
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(isEditing ? 'Error updating news' : 'Error adding news');
      }

      await response.json();
      setData(await (await fetch('https://bakend-wtc.onrender.com/api/v1/layout/about')).json());

      document.getElementById('my_modal_news').close();
      setFormData({ title: '', description: '', date: '', type: '', images: [] });
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error during add/update:', error);
      alert('Failed to process the request. Please check the form inputs or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://bakend-wtc.onrender.com/api/v1/layout/about/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setData((prevData) => prevData.filter((news) => news._id !== id));
        alert('News successfully deleted');
      } else {
        const errorData = await response.json();
        alert(`Error deleting news: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('An unexpected error occurred while trying to delete the news. Please try again later.');
    }
  };

  const handleEdit = (newsItem) => {
    setIsEditing(true);
    setEditingId(newsItem._id);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      date: newsItem.date,
      type: newsItem.type ? newsItem.type._id : '',
      images: [],
    });
    document.getElementById('my_modal_news').showModal();
  };

  return (
    <div className="p-3 flex flex-col w-full gap-5 text-white">
      <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <IoMdPaper className="text-4xl" /> News
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsEditing(false);
            setFormData({ title: '', description: '', date: '', type: '', images: [] });
            document.getElementById('my_modal_news').showModal();
          }}
        >
          Add News
        </button>
      </div>

      <dialog id="my_modal_news" className="modal">
        <div className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('my_modal_news').close()}>X</button>
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <label className="flex flex-col gap-2">
              <span>Title</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="input input-bordered w-full"
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>News Type</span>
              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                className="input input-bordered w-full"
                required
              >
                <option value="" disabled>Select news type</option>
                {newsTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.category_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span>Images</span>
              <input
                type="file"
                name="images"
                onChange={handleFileChange}
                className="input input-bordered w-full"
                multiple
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Date</span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="input input-bordered w-full"
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Description</span>
              <textarea
              type="text"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="textarea w-full"
                rows="3"
                required
              ></textarea>
            </label>
            <button type="submit" className="btn w-full mt-3">
              {isEditing ? 'Save Changes' : 'Add News'}
            </button>
          </form>
        </div>
      </dialog>

      <div className="bg-base-300 p-5 rounded-3xl">
        {loading ? (
          <div className="flex justify-center">
            <Loading />
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Images</th>
                  <th>Date</th>
                  <th>News Type</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((newsItem) => (
                  <tr key={newsItem._id}>
                    <td>{newsItem._id}</td>
                    <td>
                      {newsItem.images && newsItem.images.length > 0 ? (
                        <img
                          src={`https://bakend-wtc.onrender.com//${newsItem.images[0]}`}
                          alt="News"
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td>{new Date(newsItem.date).toLocaleDateString()}</td>
                    <td>{newsItem.type ? newsItem.type.category_name : 'N/A'}</td>
                    <td className="max-w-xs truncate">{newsItem.description}</td>
                    <td>
                      <button className="btn bg-slate-800" onClick={() => handleEdit(newsItem)}>Edit</button>
                      <button className="btn bg-red-700" onClick={() => handleDelete(newsItem._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No data available</p>
        )}
      </div>
    </div>
  );
};

export default News;
