'use client'; // Needed because we use useState (client-side)

import { useState } from 'react';

export default function SearchBar({ onCitySearchTriggered }) {
  const [cityInputFieldValue, setCityInputFieldValue] = useState('');

  const handleCityFormSubmitEvent = (event) => {
    event.preventDefault();
    if (cityInputFieldValue.trim() !== '') {
      onCitySearchTriggered(cityInputFieldValue);
      setCityInputFieldValue(''); // Clear input after search
    }
  };

  return (
    <form
      onSubmit={handleCityFormSubmitEvent}
      className="flex justify-center mt-10 mb-6 w-full max-w-md mx-auto"
    >
      <input
        type="text"
        value={cityInputFieldValue}
        onChange={(event) => setCityInputFieldValue(event.target.value)}
        placeholder="Enter a city name..."
        className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 transition-all"
      >
        Search
      </button>
    </form>
  );
}