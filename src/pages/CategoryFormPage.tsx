import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

interface FormData {
  name: string;
  icon: string; // Will store the selected icon value or custom input
}

const CategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCategory, availableIcons } = useAppContext(); // Get availableIcons from context
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    icon: '', // Default to none
  });
  
  const [customIconInput, setCustomIconInput] = useState(''); // New state for custom input
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    addCategory(formData);
    navigate('/');
  };
  
  const iconOptionsWithNone = [{ value: '', label: 'None' }, ...availableIcons]; // Add None option

  // Handler for custom icon input
  const handleCustomIconInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomIconInput(e.target.value);
    // If custom input is used, clear the dropdown selection
    setFormData(prev => ({ ...prev, icon: '' }));
  };

  // Handler for dropdown icon change
  const handleDropdownIconChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, icon: e.target.value }));
    // If dropdown is used, clear the custom input
    setCustomIconInput('');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to all cards
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-800 mb-6">Create New Category</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? 'border-error-500' : 'border-neutral-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-500">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Icon
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleDropdownIconChange} // Use new handler
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {iconOptionsWithNone.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* New: Custom Icon Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Or enter a custom icon name or emoji
                </label>
                <input
                  type="text"
                  name="customIcon"
                  value={customIconInput}
                  onChange={handleCustomIconInputChange} // Use new handler
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. folder, ✨"
                />
                <p className="mt-1 text-sm text-neutral-500">
                  Enter a Lucide icon name (e.g., 'book', 'briefcase') or an emoji.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 border-t border-neutral-200 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Create Category
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormPage;