'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const GradeViewerPage = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      setUser(data.user);
      setGrades(data.grades);
      setIsLoading(false);
    } catch (err) {
      setError('Something went wrong.');
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Hi, {user.nama} <br />
          ({user.nrp})
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          {grades.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
            >
              <p className="text-gray-800 font-semibold">{item.judulkriteria}</p>
              <p className="text-gray-500 text-sm uppercase font-medium">{item.kriteria}</p>
              <p className="text-2xl font-bold text-indigo-700">{`${item.grade}/${item.bobot}`}</p>
            </div>
          ))}
          {/* --- Total section --- */}
          <div className="col-span-full mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
            <p className="text-lg font-semibold text-gray-700">
              Total Score:{" "}
              <span className="text-2xl font-extrabold text-indigo-700">
                {grades.reduce((sum, g) => sum + Number(g.grade || 0), 0)}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <Image
          src="/logo.png" // <-- place your logo file in public/logo.png
          alt="Informatics UKWMS Logo"
          width={200}
          height={200}
          className="mx-auto mb-3"
        />
      </div>
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
          Student Login
        </h1>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
        )}
      </form>
    </div>
  );
};

export default GradeViewerPage;
