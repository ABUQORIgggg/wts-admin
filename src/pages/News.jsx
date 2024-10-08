import React, { useEffect, useState } from 'react';

const News = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description1: '',
    description2: '',
    date: '',
    images: [],
  });

  const dataRequest = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/news/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const news = await response.json();
      console.log('Fetched news data:', news.data); // Логирование данных
      setData(news.data);
    } catch (error) {
      console.error('Error fetching news:', error);
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
    try {
      const newFormData = new FormData();
      newFormData.append('title', formData.title);
      newFormData.append('description1', formData.description1);
      newFormData.append('description2', formData.description2);
      newFormData.append('date', formData.date);
      formData.images.forEach((file) => {
        newFormData.append('images', file); 
      });

      const response = await fetch('http://localhost:5000/api/v1/news/create', {
        method: 'POST',
        body: newFormData,
      });
      if (!response.ok) {
        throw new Error('Error adding news');
      }
      const newNews = await response.json();
      setData((prevData) => [...prevData, newNews]);

      document.getElementById('my_modal_news').close();
      setFormData({
        title: '',
        description1: '',
        description2: '',
        date: '',
        images: [],
      });
    } catch (error) {
      console.error('Error adding news:', error);
      alert('Failed to add news. Please try again.'); 
    } finally {
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    console.log('Deleting news with ID:', id);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/news/${id}`, { // Изменен путь
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((news) => news._id !== id));
        alert('News deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete news: ${errorData.message}`);
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };
  
  

  return (
    <>
      <div className="p-3 flex flex-col w-10/12 gap-5">
        <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
          <h1 className="text-3xl font-bold text-primary">News</h1>
          <button className="btn btn-primary" onClick={() => document.getElementById('my_modal_news').showModal()}>Добавить</button>
        </div>

        <dialog id="my_modal_news" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
            </form>
            <form onSubmit={handleFormSubmit}>
              <label className="input input-bordered flex items-center gap-2 mt-10">
                Title
                <input type="text" name="title" value={formData.title} onChange={handleFormChange} className="grow" placeholder="Title" required />
              </label>
              <label className="input input-bordered flex items-center gap-2 mt-5">
                Image urls
                <input type="file" name="images" onChange={handleFileChange} className="grow" multiple required />
              </label>
              <label className="input input-bordered flex items-center gap-2 mt-5">
                Date
                <input type="text" name="date" value={formData.date} onChange={handleFormChange} className="grow" required />
              </label>
              <label className="input input-bordered flex items-center gap-2 mt-5">
                Description 1
                <input name="description1" value={formData.description1} onChange={handleFormChange} className="grow" placeholder="Description 1"></input>
              </label>
              <label className="input input-bordered flex items-center gap-2 mt-5">
                Description 2
                <input name="description2" value={formData.description2} onChange={handleFormChange} className="grow" placeholder="Description 2"></input>
              </label>
              <button type="submit" className="btn mt-5">Add News</button>
            </form>
          </div>
        </dialog>

        <div className='p-5 w-full flex justify-between items-center bg-base-300 rounded-3xl'>
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Images</th>
                  <th>Date</th>
                  <th>Description 1</th>
                  <th>Description 2</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">Loading...</td>
                  </tr>
                ) : (
                  Array.isArray(data) && data.length > 0 ? (
                    data.map((newsItem) => (
                      <tr key={newsItem._id}>
                        <td>{newsItem._id}</td>
                        <td>
                          {newsItem.images && newsItem.images.length > 0 ? (
                            <img src={`http://localhost:5000${newsItem.images[0]}`} alt={`News Image 1`} className="w-16 h-16 object-cover" />
                          ) : (
                            <span>No Image</span>
                          )}
                        </td>
                        <td>{newsItem.date}</td><td>
  <div className="text-sm leading-relaxed max-w-xs truncate">
    {newsItem.description1}
  </div>
</td>
<td>
  <div className="text-sm leading-relaxed max-w-xs truncate">
    {newsItem.description2}
  </div>
</td>

                        <td>
                          <button className="btn">Edit</button>
                          <button className="btn" onClick={() => handleDelete(newsItem._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : ( 
                    <tr>
                      <td colSpan="7" className="text-center">No data available</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
