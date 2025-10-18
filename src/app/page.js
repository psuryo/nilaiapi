'use client';
import React, { useState, useCallback } from 'react';

// --- COLOR FUNCTION (same as before) ---
const getGradeColor = (gradeString) => {
  const grade = parseFloat(gradeString);
  if (isNaN(grade)) return 'bg-gray-100 text-gray-700 border-gray-300';
  if (grade >= 90) return 'bg-green-100 text-green-700 border-green-300';
  if (grade >= 80) return 'bg-blue-100 text-blue-700 border-blue-300';
  if (grade >= 70) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-red-100 text-red-700 border-red-300';
};

const GradeViewerPage = () => {
  const [studentId, setStudentId] = useState('');
  const [grades, setGrades] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- UPDATED: fetch data from your /api/grades route ---
  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setGrades(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/grades?id=${studentId.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unknown error');
      } else {
        setGrades(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-inter">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-100">
        
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight sm:text-4xl">
            Student Grade Retrieval Portal
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Enter your 7-digit ID number to view your detailed assessment results.
          </p>
        </header>

        {/* --- Search Form --- */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g., 2024001"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg shadow-sm"
            required
            aria-label="Student ID Number"
          />
          <button
            type="submit"
            disabled={isLoading || studentId.trim().length === 0}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-300 flex items-center justify-center text-lg"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Search Grades'}
          </button>
        </form>

        {/* --- Results Display Area --- */}
        <div className="min-h-[150px]">
          {error && (
            <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {grades && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Results for ID: <span className="text-indigo-600">{studentId}</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grades.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-150"
                  >
                    <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">
                      {item.judulkriteria}
                    </p>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {item.kriteria}
                    </p>
                    <div className="text-3xl font-extrabold flex items-center">
                      <span 
                        className={`inline-block px-3 py-1 rounded-full border-2 font-mono ${getGradeColor(item.grade)}`}
                      >
                        {item.grade}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !grades && !error && (
            <div className="p-6 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-lg">Please enter a student ID and click search to view results.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GradeViewerPage;
