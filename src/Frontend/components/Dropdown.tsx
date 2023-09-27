import React, { useState } from 'react';

type Props = {
  label: string;
  options: Map<string, { value: number | string }>;
};

export default function Dropdown(props: Props) {
  const options = Array.from(props.options.keys());
  const [showDropdown, setShowDropdown] = useState(false);
  console.log({ options });
  function onClickDropdown() {
    setShowDropdown((state) => !state);
  }
  return (
    <>
      <button
        id='dropdownDefaultButton'
        onClick={onClickDropdown}
        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        type='button'
      >
        {props.label}{' '}
        {/* <svg className='w-2.5 h-2.5 ml-2.5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 10 6'>
          <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 1 4 4 4-4' />
        </svg> */}
      </button>
      {showDropdown && (
        <div id='dropdown' className='z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'>
          <ul className='py-2 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownDefaultButton'>
            {options.map((option) => (
              <li key={option} onClick={() => setShowDropdown(false)}>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                  {option}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
