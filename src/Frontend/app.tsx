import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getEnquiryDates } from '../../src/Backend/options/dates';
import Dropdown from './components/Dropdown';
const container = document.getElementById('app');

const root = createRoot(container);
root.render(<App />);

const dateOptions = getEnquiryDates()

function App() {
  const [playwrightStatus, setPlaywrightStatus] = useState('idle');
  function onEnquire() {
    // window.ElectronAPI.onEnquire();
  }


  function onClose() {
    window.ElectronAPI.onCloseBrowser();
  }

  useEffect(() => {
    window.ElectronAPI.handlePlaywrightStatus(setPlaywrightStatus);
  }, []);

  return (
    <main className='p-2'>
      <h1 className='text-lg font-bold text-center mb-2'>LCSD Electron App</h1>
      <div className='flex gap-2 flex-col'>
        <button onClick={onEnquire} className='rounded-full bg-green-300 px-3 py-1'>
          Enquire
        </button>
        <button onClick={onClose} className='rounded-full bg-red-300 px-3 py-1'>
          Close
        </button>
      </div>

      <Dropdown label='Date Select' options={dateOptions} />

      <div className='my-2'>
        <h2>Status:</h2>
        <p className='text-gray-500 italic'>{playwrightStatus}</p>
      </div>
    </main>
  );
}
