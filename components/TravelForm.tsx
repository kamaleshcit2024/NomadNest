import React, { useState } from 'react';
import { Plane, MapPin, Briefcase, Search } from 'lucide-react';
import { TravelQuery } from '../types';

interface TravelFormProps {
  onSubmit: (query: TravelQuery) => void;
  isLoading: boolean;
  initialDestination?: string;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading, initialDestination }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState(initialDestination || '');
  const [purpose, setPurpose] = useState('Tourism');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onSubmit({ origin, destination, purpose });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-24 relative z-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center md:text-left">
          Where is your next journey taking you?
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="relative md:col-span-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 ml-1">
              Citizenship / Origin
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 h-5 w-5" />
              <input
                type="text"
                placeholder="e.g. USA, France"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-800 font-medium"
                required
              />
            </div>
          </div>

          <div className="relative md:col-span-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 ml-1">
              Destination
            </label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 h-5 w-5" />
              <input
                type="text"
                placeholder="e.g. Japan, Brazil"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-800 font-medium"
                required
              />
            </div>
          </div>

          <div className="relative md:col-span-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 ml-1">
              Purpose
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 h-5 w-5" />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-800 font-medium appearance-none cursor-pointer"
              >
                <option value="Tourism">Tourism</option>
                <option value="Business">Business</option>
                <option value="Relocation">Relocation</option>
                <option value="Study">Study</option>
                <option value="Digital Nomad">Digital Nomad</option>
              </select>
            </div>
          </div>

          <div className="flex items-end md:col-span-1">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2
                ${isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25'
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Explore</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelForm;