import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const Applications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/zayavka/');
                console.log('Response data:', response.data); // Log the response
                setApplications(response.data.data || []); // Adjust based on your API response structure
                localStorage.setItem('applications', JSON.stringify(response.data.data || []));
            } catch (error) {
                console.error('Ошибка при получении заявок:', error);
                const savedApplications = localStorage.getItem('applications');
                if (savedApplications) {
                    setApplications(JSON.parse(savedApplications)); // Восстановление из localStorage при ошибке
                }
            }
        };

        fetchApplications();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white rounded-xl shadow-2xl">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-100">Список заявок</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {applications.map((app, index) => (
                    <li
                        key={index}
                        className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-600"
                    >
                        <div className="flex justify-between items-center">
                            <strong className="text-2xl text-gray-200">{app.name}</strong>
                            <span className="badge badge-info badge-outline text-sm py-1 px-3 bg-gray-600 text-gray-300">Новая заявка</span>
                        </div>

                        <div className="flex items-center mt-4">
                            <FaEnvelope className="text-gray-400 mr-2" />
                            <span className="text-gray-300">{app.email}</span>
                        </div>

                        <div className="flex items-center mt-2">
                            <FaPhone className="text-gray-400 mr-2" />
                            <span className="text-gray-300">{app.phone}</span>
                        </div>

                        <p className="text-gray-400 mt-4 italic">{app.comment}</p>

                        <div className="mt-4">
                            <div className="h-1 w-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg"></div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-500">Дата: {new Date().toLocaleDateString()}</span>
                            <button className="btn btn-secondary btn-sm hover:bg-gray-600 transition-colors">
                                Связаться
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Applications;
