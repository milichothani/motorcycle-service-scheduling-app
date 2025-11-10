import React from 'react';
import { MotorcycleIcon, WrenchIcon, UserIcon, AiIcon, BookOpenIcon, DownloadIcon, ExternalLinkIcon, ShoppingCartIcon } from './icons.tsx';
import type { View } from '../App.tsx';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  onInstallClick: () => void;
  showInstallButton: boolean;
  isRunningInFrame: boolean;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-primary-orange text-white'
        : 'text-muted hover:bg-card hover:text-white'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);


const Header: React.FC<HeaderProps> = ({ currentView, setView, onInstallClick, showInstallButton, isRunningInFrame }) => {
  return (
    <header className="bg-dark/80 backdrop-blur-sm sticky top-0 z-20 shadow-lg shadow-black/20 border-b border-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <MotorcycleIcon className="h-8 w-8 text-primary-orange" />
            <h1 className="text-light font-display text-xl sm:text-2xl font-bold tracking-wider">
              Corner Tuned
            </h1>
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {isRunningInFrame && (
                <button
                onClick={() => window.open(window.location.href, '_blank')}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-500 hover:scale-105"
                title="Open the app in a new tab to install it correctly."
              >
                <ExternalLinkIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Open Full App</span>
              </button>
            )}
            {showInstallButton && !isRunningInFrame && (
              <button
                onClick={onInstallClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-500 hover:scale-105 animate-pulse"
                title="Install this app on your device for offline access."
              >
                <DownloadIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}
             <NavButton 
              label="Customer Form"
              icon={<UserIcon className="h-5 w-5" />}
              isActive={currentView === 'CUSTOMER_FORM'}
              onClick={() => setView('CUSTOMER_FORM')}
            />
             <NavButton 
              label="Admin Dashboard"
              icon={<WrenchIcon className="h-5 w-5" />}
              isActive={currentView === 'ADMIN_DASHBOARD'}
              onClick={() => setView('ADMIN_DASHBOARD')}
            />
             <NavButton 
              label="Shopping List"
              icon={<ShoppingCartIcon className="h-5 w-5" />}
              isActive={currentView === 'SHOPPING_LIST'}
              onClick={() => setView('SHOPPING_LIST')}
            />
            <NavButton 
              label="Articles"
              icon={<BookOpenIcon className="h-5 w-5" />}
              isActive={currentView === 'ARTICLES'}
              onClick={() => setView('ARTICLES')}
            />
            <NavButton 
              label="AI Suggestions"
              icon={<AiIcon className="h-5 w-5" />}
              isActive={currentView === 'TECH_SUGGESTIONS'}
              onClick={() => setView('TECH_SUGGESTIONS')}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;