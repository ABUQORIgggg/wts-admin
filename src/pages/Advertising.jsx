  import React, { useEffect, useState } from 'react';
  import { FaPlus, FaTrash } from 'react-icons/fa';

  const Advertising = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
      image: null, // Изменено на null для хранения файла
      description: '',
    });

    const dataRequest = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/banner');
        const ads = await response.json();
        setData(ads);
      } catch (error) {
        console.error('Error fetching advertising:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      dataRequest();
    }, []);

    const handleFormChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files ? files[0] : value, // Используем файл, если он есть
      }));
    };

    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      const formDataToSend = new FormData();
      formDataToSend.append('image', formData.image); // предполагается, что это файл
      formDataToSend.append('description', formData.description);
    
      try {
        const response = await fetch('http://localhost:5000/api/v1/banner', {
          method: 'POST',
          body: formDataToSend,
        });
        
        if (!response.ok) {
          throw new Error('Error adding advertisement');
        }
        
        const newAd = await response.json();
        setData((prevData) => [...prevData, newAd]);
        document.getElementById('my_modal_advertising').close();
      } catch (error) {
        console.error('Error adding advertisement:', error);
      }
    };

    const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/banner/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error deleting advertisement');
        }
        setData((prevData) => prevData.filter((ad) => ad._id !== id)); // Измените на _id
      } catch (error) {
        console.error('Error deleting advertisement:', error);
      }
    };

    return (
      <div className="p-5 flex flex-col w-10/12 gap-5">
        <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
          <h1 className="text-2xl font-bold text-primary">Advertising</h1>
          <button className="btn btn-primary flex items-center" onClick={() => document.getElementById('my_modal_advertising').showModal()}>
            <FaPlus className="mr-2" /> Добавить
          </button>
        </div>

        <dialog id="my_modal_advertising" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
            </form>
            <form onSubmit={handleFormSubmit}>
              <label  className="input input-bordered flex items-center gap-2 mt-10">
                Image
                <input type="file" name="image" onChange={handleFormChange} className="grow" />
              </label>
              <label className="input input-bordered flex items-center gap-2 mt-5">
                Description
                <input type="text" name="description" value={formData.description} onChange={handleFormChange} className="grow" placeholder="Description" />
              </label>
              <button type="submit" className="btn mt-5">Add Advertising</button>
            </form>
          </div>
        </dialog>

        <div className='p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl'>
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center">Loading...</td>
                  </tr>
                ) : (
                  data.map((ad) => (
                    <tr key={ad._id}>
                      <td>{ad._id}</td>
                      <td>
                        <img src={`http://localhost:5000${ad.image_url}`} alt="Ad" style={{ width: '100px', height: 'auto' }} />
                      </td>
                      <td>{ad.description}</td>
                      <td>
                        <button className="btn" onClick={() => handleDelete(ad._id)}>
                          <FaTrash className="mr-2" /> Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  export default Advertising;
