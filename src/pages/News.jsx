import React, { useEffect, useState } from 'react';
import { FaSpinner } from "react-icons/fa";
import { IoMdPaper } from 'react-icons/io';

const News = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    descriptions: '',
    date: '',
    images: [],
  });

  const dataRequest = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/v1/news/');
      if (!response.ok) throw new Error('Ошибка сети');
      const news = await response.json();
      setData(news);
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dataRequest();
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

    if (!formData.title || !formData.descriptions || !formData.date) {
      alert('Заголовок, описание и дата обязательны для заполнения.');
      setLoading(false);
      return;
    }

    try {
      const newFormData = new FormData();
      newFormData.append('title', formData.title);
      newFormData.append('descriptions', formData.descriptions);
      newFormData.append('date', formData.date);
      formData.images.forEach((file) => newFormData.append('images', file));

      const url = isEditing
        ? `http://localhost:9000/api/v1/news/${editingId}`
        : 'http://localhost:9000/api/v1/news/create';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, { method, body: newFormData });
      if (!response.ok) throw new Error(isEditing ? 'Ошибка при обновлении новости' : 'Ошибка при добавлении новости');

      await dataRequest(); // Fetch updated data immediately after the operation

      document.getElementById('my_modal_news').close();
      setFormData({ title: '', descriptions: '', date: '', images: [] });
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Ошибка при добавлении/обновлении новости:', error);
      alert('Не удалось обработать запрос. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
        const response = await fetch(`http://localhost:9000/api/v1/news/${id}`, { method: 'DELETE' });
        if (response.ok) {
            setData((prevData) => prevData.filter((news) => news._id !== id));
            alert('Новость успешно удалена');
        } else {
            const errorData = await response.json();
            console.error(`Ошибка при удалении новости: ${errorData.message}`);
            alert(`Ошибка при удалении новости: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        alert('Ошибка при удалении новости. Пожалуйста, попробуйте позже.');
    }
  };

  const handleEdit = (newsItem) => {
    setIsEditing(true);
    setEditingId(newsItem._id);
    setFormData({
      title: newsItem.title,
      descriptions: newsItem.descriptions,
      date: newsItem.date,
      images: [], // Reset images, as we can't directly use existing paths in file input
    });
    document.getElementById('my_modal_news').showModal();
  };

  return (
    <div className="p-3 flex flex-col w-10/15 gap-5 text-white">
      <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary flex text-center gap-2">
          <IoMdPaper className="size-9" /> Новости
        </h1>
        <button className="btn btn-primary" onClick={() => {
          setIsEditing(false);
          setFormData({ title: '', descriptions: '', date: '', images: [] });
          document.getElementById('my_modal_news').showModal();
        }}>
          Добавить новость
        </button>
      </div>

      <dialog id="my_modal_news" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
          </form>
          <form onSubmit={handleFormSubmit} className="space-y-5" encType="multipart/form-data">
            <label className="flex flex-col gap-2">
              <span className="text-gray-300">Заголовок</span>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleFormChange} 
                className="input input-bordered w-full bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-400" 
                placeholder="Заголовок" 
                required 
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-gray-300">Изображения</span>
              <input 
                type="file" 
                name="images" 
                onChange={handleFileChange} 
                className="input input-bordered w-full bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-400" 
                multiple 
                required 
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-gray-300">Дата</span>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleFormChange} 
                className="input input-bordered w-full bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-400" 
                required 
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-gray-300">Описание</span>
              <textarea
                name="descriptions"
                value={formData.descriptions}
                onChange={handleFormChange}
                className="textarea mt-1 p-2 w-full bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-400"
                placeholder="Описание"
                rows="3"
                required
              ></textarea>
            </label>

            <button type="submit" className="btn mt-5 w-full">
              {isEditing ? 'Сохранить изменения' : 'Добавить новость'}
            </button>
          </form>
        </div>
      </dialog>

      <div className="p-5 w-full flex justify-between items-center bg-base-300 rounded-3xl">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Изображения</th>
                <th>Дата</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center w-full h-full flex justify-center items-center">
                    <FaSpinner className="animate-spin text-5xl text-gray-500" />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((newsItem) => (
                  <tr key={newsItem._id}>
                    <td>{newsItem._id}</td>
                    <td>
                      {newsItem.images && newsItem.images.length > 0 ? (
                        <img src={`http://localhost:9000${newsItem.images[0]}`} alt="Новость" className="w-16 h-16 object-cover" />
                      ) : (
                        <span>Нет изображения</span>
                      )}
                    </td>
                    <td>{newsItem.date}</td>
                    <td className="text-sm leading-relaxed max-w-xs truncate">
                      {newsItem.descriptions.length > 50 ? `${newsItem.descriptions.slice(0, 50)}...` : newsItem.descriptions}
                    </td>
                    <td>
                      <button className="btn bg-slate-800" onClick={() => handleEdit(newsItem)}>Редактировать</button>
                      <button className="btn bg-red-700" onClick={() => handleDelete(newsItem._id)}>Удалить</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">Нет данных</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default News;
