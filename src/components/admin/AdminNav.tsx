import React from 'react';

interface AdminNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const AdminNav: React.FC<AdminNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'questions', label: 'Questions', icon: '❓' },
    { id: 'assignments', label: 'Assignments', icon: '📋' },
    { id: 'attempts', label: 'Attempts', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ];

  const handleNavClick = (pageId: string) => {
    console.log('Navigating to:', pageId);
    console.log('Current page:', currentPage);
    onNavigate(pageId);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                onClick={() => handleNavClick('profile')}
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View profile</span>
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  👤
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left transition-colors duration-200 ${
                currentPage === item.id
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
