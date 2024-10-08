// components/Products.jsx
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial form data with all fields
  const [formData, setFormData] = useState({
    name: '',
    images: [], // Changed from 'image' to 'images' and initialized as an array
    description: '',
    price: '',
    category: '',
    stock: '',
    rating: '',
    volume: '',
    discount_price: '',
    promotion: false,
    ruler: '',
    oils_type: '',
    fidbek: '',
  });

  const handleFormChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === 'file') {
      // Handle multiple file uploads
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files,
      }));
    } else if (type === 'checkbox') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked,
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

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        // Append each image file
        for (let i = 0; i < formData.images.length; i++) {
          formDataToSend.append('images', formData.images[i]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/v1/card/create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error response:', errorResponse);
        throw new Error(`Error adding product: ${response.statusText}`);
      }

      const result = await response.json();
      const newProduct = result.product;

      setData((prevData) => [...prevData, newProduct]);
      document.getElementById('my_modal_3').close();
      // Reset form data
      setFormData({
        name: '',
        images: [],
        description: '',
        price: '',
        category: '',
        stock: '',
        rating: '',
        volume: '',
        discount_price: '',
        promotion: false,
        ruler: '',
        oils_type: '',
        fidbek: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/card/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setData((prevData) => prevData.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/card');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        setData(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-5 flex flex-col w-full gap-5">
      <button 
        className="btn mb-5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg" 
        onClick={() => document.getElementById('my_modal_3').showModal()}
      >
        Add Product
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box text-white relative bg-gray-800 rounded-lg p-8">
          <button 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 transition"
            onClick={() => document.getElementById('my_modal_3').close()}
          >
            ✕
          </button>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Form Fields */}
            <label className="block">
              <span className="text-gray-300">Name</span>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                required 
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Category</span>
              <input 
                type="text" 
                name="category" 
                value={formData.category} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Rating</span>
              <input 
                type="number" 
                name="rating" 
                value={formData.rating} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                required
                min="0"
                max="5"
                step="0.1"
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Stock</span>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                required
                min="0"
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Ruler</span>
              <input 
                type="text" 
                name="ruler" 
                value={formData.ruler} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Volume</span>
              <input 
                type="text" 
                name="volume" 
                value={formData.volume} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Images</span>
              <input 
                type="file" 
                name="images" 
                onChange={handleFormChange} 
                className="file-input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                multiple // Allow multiple file selection
                required 
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="textarea w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                required
              ></textarea>
            </label>

            <label className="block">
              <span className="text-gray-300">Price</span>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                required
                min="0"
                step="0.01"
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Discount Price</span>
              <input 
                type="number" 
                name="discount_price" 
                value={formData.discount_price} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
                min="0"
                step="0.01"
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Promotion</span>
              <input 
                type="checkbox" 
                name="promotion" 
                checked={formData.promotion} 
                onChange={handleFormChange} 
                className="checkbox mt-1 bg-gray-700 rounded-md text-white" 
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Oils Type</span>
              <input 
                type="text" 
                name="oils_type" 
                value={formData.oils_type} 
                onChange={handleFormChange} 
                className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white" 
              />
            </label>

            {/* Add any other required fields here */}

            <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
              Add Product
            </button>
          </form>
        </div>
      </dialog>

      {/* Product Table */}
      <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl ">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-gray-300">Name</th>
                <th className="text-gray-300">Images</th>
                <th className="text-gray-300">Description</th>
                <th className="text-gray-300">Price</th>
                <th className="text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className='w-full'>
              {data.map((product) => (
                <tr key={product._id} className='w-full'>
                  <td>{product.name}</td>
                  <td>
                      <img 
                        src={`http://localhost:5000/${product.image}`} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover inline-block mr-2" 
                      />
                  </td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
