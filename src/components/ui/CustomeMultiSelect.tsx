import React, { useState } from 'react';

interface Option {
  id: number;
  username: string;
}

interface CustomMultiSelectProps {
  options: Option[];
  selectedValues: number[];
  onChange: (selected: number[]) => void;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: number) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((id) => id !== value)); // Remove value
    } else {
      onChange([...selectedValues, value]); // Add value
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="border rounded p-2 w-full">
        {selectedValues.length > 0
          ? `${selectedValues.length} selected`
          : 'Select members'}
      </button>
      {isOpen && (
        <ul className="absolute border rounded bg-white shadow-lg w-full">
          {options.map((option) => (
            <li key={option.id} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.id)}
                onChange={() => handleSelect(option.id)}
              />
              <span className="ml-2">{option.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomMultiSelect;
