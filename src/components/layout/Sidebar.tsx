import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import * as LucideIcons from 'lucide-react';
import { BookOpen, Star, Check, BarChart, Sliders, Home, Plus, Trash2, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { categories, activeCategory, setActiveCategory, deleteCategory, addCategory, availableIcons, isGuest } = useAppContext();
  
  const iconMap: { [key: string]: React.ComponentType<LucideIcons.LucideProps> } = {
    book: LucideIcons.BookOpen,
    briefcase: LucideIcons.Briefcase,
    utensils: LucideIcons.Utensils,
    heart: LucideIcons.Heart,
    laptop: LucideIcons.Laptop,
    plane: LucideIcons.Plane,
    music: LucideIcons.Music,
    film: LucideIcons.Film,
  };

  const renderIcon = (iconValue: string | undefined) => {
    if (!iconValue) return <BookOpen size={20} />; // Fallback icon
    const IconComponent = iconMap[iconValue.toLowerCase()];
    if (IconComponent) {
      return <IconComponent size={20} />;
    }
    return <span className="text-xl leading-none">{iconValue}</span>;
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };
  
  const closeOnMobile = () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/study', label: 'Study Cards', icon: <BookOpen size={20} /> },
    { path: '/favorites', label: 'Favorites', icon: <Star size={20} /> },
    { path: '/stats', label: 'Statistics', icon: <BarChart size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Sliders size={20} /> },
  ];
  
  const handleDeleteCategory = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará la categoría de todas las tarjetas asociadas.')) {
      deleteCategory(categoryId);
    }
  };

  // New state for adding category
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategoryClick = () => {
    setIsAddingCategory(true);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({ name: newCategoryName.trim(), color: 'primary', icon: 'book' });
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleCancelAddCategory = () => {
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white z-30 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-white dark:bg-neutral-800">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-primary-600">FlashLingo</h1>
            </div>
            
          </div>
          
          <nav className="p-4 overflow-y-auto flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-primary-50 dark:bg-primary-800 text-primary-700 dark:text-primary-100 font-medium'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    onClick={closeOnMobile}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-neutral-500 dark:text-neutral-400 text-sm uppercase tracking-wider">Categories</h3>
                 {!isGuest && !isAddingCategory && (
                   <button
                     onClick={handleAddCategoryClick}
                     className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                     aria-label="Add new category"
                   >
                     <Plus size={16} />
                   </button>
                 )}
              </div>
              
              {!isGuest && isAddingCategory && (
                 <div className="flex items-center space-x-2 mb-2">
                    <input
                       type="text"
                       placeholder="Category name..."
                       value={newCategoryName}
                       onChange={(e) => setNewCategoryName(e.target.value)}
                       className="flex-1 px-2 py-1 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100"
                       autoFocus
                       onKeyPress={(e) => {
                         if (e.key === 'Enter') {
                           handleCreateCategory();
                         }
                       }}
                    />
                    <button
                       onClick={handleCreateCategory}
                       className="p-1.5 text-success-600 hover:bg-success-50 rounded-full transition-colors duration-200"
                       aria-label="Create category"
                    >
                       <Check size={16} />
                    </button>
                     <button
                       onClick={handleCancelAddCategory}
                       className="p-1.5 text-error-600 hover:bg-error-50 rounded-full transition-colors duration-200"
                       aria-label="Cancel category creation"
                    >
                       <X size={16} />
                    </button>
                 </div>
              )}

              <ul className="space-y-1">
                {/* All Categories Option */}
                <li>
                  <button
                    className={`flex items-center flex-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      activeCategory === null
                        ? 'bg-primary-50 dark:bg-primary-800 text-primary-700 dark:text-primary-100 font-medium'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => handleCategoryClick(null)}
                  >
                    <span className="mr-3 text-neutral-500 dark:text-neutral-400"><BookOpen size={20} /></span> {/* Using a default icon */}
                    All Categories
                  </button>
                </li>
                {categories && categories.map((category) => (
                  <li key={category.id}>
                    <div className="flex items-center">
                      <button
                        className={`flex items-center flex-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                          activeCategory === category.id
                            ? 'bg-primary-50 dark:bg-primary-800 text-primary-700 dark:text-primary-100 font-medium'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <span className="mr-3 text-neutral-500 dark:text-neutral-400"><BookOpen size={20} /></span>
                        {category.name}
                      </button>
                      <button
                        onClick={(e) => handleDeleteCategory(e, category.id)}
                        className="p-1.5 text-error-600 hover:bg-error-50 rounded-full transition-colors duration-200"
                        aria-label="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;