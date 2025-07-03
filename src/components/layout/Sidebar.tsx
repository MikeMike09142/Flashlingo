import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import * as LucideIcons from 'lucide-react';
import { BookOpen, Star, Check, BarChart, Sliders, Home, Plus, Trash2, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categories, activeCategory, setActiveCategory, deleteCategory, addCategory, availableIcons, isGuest, flashcards } = useAppContext();
  
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

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    navigate('/');
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

  // Función para contar flashcards por categoría y nivel
  const getCategoryStats = (categoryId: string) => {
    const cards = flashcards.filter(card => card.categoryIds.includes(categoryId));
    const total = cards.length;
    const levels: Record<string, number> = {};
    ['A1','A2','B1','B2','C1','C2'].forEach(lvl => {
      levels[lvl] = cards.filter(card => card.level === lvl).length;
    });
    return { total, levels };
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
                <li className="relative">
                  <button
                    className={`flex items-center flex-1 px-3 py-2 rounded-lg transition-colors duration-200 w-full ${
                      activeCategory === null
                        ? 'bg-primary-50 dark:bg-primary-800 text-primary-700 dark:text-primary-100 font-medium'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => setShowCategoryDropdown((prev) => !prev)}
                  >
                    <span className="mr-3 text-neutral-500 dark:text-neutral-400"><BookOpen size={20} /></span>
                    All Categories
                    <svg className={`ml-auto w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showCategoryDropdown && (
                    <ul className="absolute left-0 mt-2 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {categories && categories.map((category) => {
                        const stats = getCategoryStats(category.id);
                        return (
                          <li key={category.id}>
                            <button
                              className="flex flex-col items-start w-full px-3 py-2 text-left hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
                              onClick={() => {
                                handleCategoryClick(category.id);
                                setShowCategoryDropdown(false);
                              }}
                            >
                              <div className="flex items-center w-full">
                                <span className="mr-3 text-neutral-500 dark:text-neutral-400">{renderIcon(category.icon)}</span>
                                <span className="font-medium flex-1">{category.name}</span>
                                <span className="ml-2 text-xs text-primary-500 font-bold">{stats.total}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(stats.levels).filter(([,count])=>count>0).map(([lvl, count]) => (
                                  <span key={lvl} className="bg-neutral-200 dark:bg-neutral-700 rounded-full px-2 py-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200">{lvl}: {count}</span>
                                ))}
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;