'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AircraftMap = dynamic(() => import('../components/AircraftMap'), { ssr: false });

export default function Home() {
  const [aircraft, setAircraft] = useState([]);
  const [tailFilter, setTailFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingTail, setEditingTail] = useState(null);
  const [showOnlyReady, setShowOnlyReady] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/aircraft')
      .then(res => res.json())
      .then(data => setAircraft(data))
      .catch(err => console.error('Failed to fetch aircraft:', err));
  }, []);

  const filteredAircraft = aircraft.filter((plane) => {
    const matchesFilters =
      plane.tailNumber.toLowerCase().includes(tailFilter.toLowerCase()) &&
      plane.model.toLowerCase().includes(modelFilter.toLowerCase()) &&
      (statusFilter === '' || plane.status === statusFilter);
    const isReady = plane.status === 'available';
    return showOnlyReady ? matchesFilters && isReady : matchesFilters;
  });

  const handleStatusChange = async (tailNumber, newStatus) => {
    const target = aircraft.find(p => p.tailNumber === tailNumber);
    if (!target) return;

    try {
      const res = await fetch(`http://localhost:4000/aircraft/${target.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');

      const updatedPlane = await res.json();
      const updated = aircraft.map(p =>
        p.id === updatedPlane.id ? updatedPlane : p
      );
      setAircraft(updated);
      setEditingTail(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update status on server');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-4 mb-6 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Aircraft Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage aircraft readiness</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">
            {aircraft.filter(p => p.status === 'available').length} Ready
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {aircraft.length} Total
          </span>
        </div>
      </div>

      <AircraftMap aircraft={aircraft} />

      {/* Toggle */}
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm border transition
            ${showOnlyReady
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          onClick={() => setShowOnlyReady(!showOnlyReady)}
        >
          {showOnlyReady ? 'Show All Aircraft' : 'Show Ready Only'}
        </button>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {['Tail Number', 'Model'].map((placeholder, i) => (
          <div key={i} className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
            <input
              type="text"
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={i === 0 ? tailFilter : modelFilter}
              onChange={e => i === 0 ? setTailFilter(e.target.value) : setModelFilter(e.target.value)}
            />
          </div>
        ))}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
          <select
            className="w-full pl-10 pr-4 py-2 rounded-md bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="aog">AOG</option>
          </select>
        </div>
      </div>

      {/* Aircraft Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAircraft.map(plane => (
          <div
            key={plane.id}
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border hover:border-blue-300"
            onClick={() => setEditingTail(plane.tailNumber)}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">{plane.tailNumber}</h2>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                plane.status === 'available'
                  ? 'bg-green-100 text-green-700'
                  : plane.status === 'maintenance'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}>
                {plane.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium text-gray-700">Model:</span> {plane.model}</p>
              <p><span className="font-medium text-gray-700">Location:</span> {plane.location.lat}, {plane.location.lng}</p>
            </div>

            {editingTail === plane.tailNumber && (
              <div className="mt-4">
                <label className="block mb-1 text-sm text-gray-700 font-medium">Update Status:</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={plane.status}
                  onChange={(e) => handleStatusChange(plane.tailNumber, e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="aog">AOG</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
