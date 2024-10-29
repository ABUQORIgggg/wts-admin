import React, { useState } from 'react';

const Create = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setUsername('');
    setPassword('');
    setRole('');
    setError('');
  };

  const handleCreate = async () => {
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    const partnerData = { username, password, role };

    try {
      const response = await fetch('http://localhost:9000/api/v1/auth/create-partnyor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      });

      const result = await response.json();
      console.log('Response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Error creating partner');
      }

      console.log('Partner created successfully:', result);
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
};


  return (
    <div className="flex flex-col items-center justify-center w-full text-white">
      <button
        onClick={openModal}
        className="btn btn-primary text-white"
      >
        Create Partner
      </button>

      {modalIsOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-4">Create Partner</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Role:</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCreate}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200 ease-in-out"
              >
                Create
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition duration-200 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Create;
