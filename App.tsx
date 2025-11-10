// Fix: Provide full content for App.tsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import CustomerForm from './components/CustomerForm.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import TechSuggestions from './components/TechSuggestions.tsx';
import Articles from './components/Articles.tsx';
import ShoppingList from './components/ShoppingList.tsx';
import type { Booking, ShoppingListItem } from './types.ts';
import { ServiceStatus } from './types.ts';





// Initial dummy data for bookings - used only if localStorage is empty
const initialBookings: Booking[] = [
  {
    id: 1,
    customer: { name: 'Alice Johnson', contact: '555-0101' },
    motorcycle: { make: 'Ducati', model: 'Panigale V4', regNumber: 'DUCATI1' },
    description: 'Annual service and checkup. Check brake fluid.',
    status: ServiceStatus.Pending,
    bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    parts: [],
    laborCost: 0,
    messages: [],
  },
  {
    id: 2,
    customer: { name: 'Bob Smith', contact: 'bob@example.com' },
    motorcycle: { make: 'Kawasaki', model: 'Ninja ZX-10R', regNumber: 'Kawi10R' },
    description: 'New set of tires needed. Pirelli Diablo Supercorsa.',
    status: ServiceStatus.InProgress,
    bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    parts: [{ name: 'Pirelli Diablo Supercorsa (Front)', quantity: 1, price: 210 }, { name: 'Pirelli Diablo Supercorsa (Rear)', quantity: 1, price: 280 }],
    laborCost: 75,
    messages: [],
  },
  {
    id: 3,
    customer: { name: 'Charlie Brown', contact: '555-0103' },
    motorcycle: { make: 'Honda', model: 'CBR1000RR', regNumber: 'HONDA1K' },
    description: 'Engine making a strange ticking noise at high RPM.',
    status: ServiceStatus.AwaitingParts,
    bookingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    parts: [{ name: 'OEM Cam Chain Tensioner', quantity: 1, price: 95 }],
    laborCost: 250,
    messages: [],
  },
  {
    id: 4,
    customer: { name: 'Diana Prince', contact: 'diana@example.com' },
    motorcycle: { make: 'Yamaha', model: 'YZF-R1', regNumber: 'R1PRNCE' },
    description: 'Oil change and chain adjustment.',
    status: ServiceStatus.Completed,
    bookingDate: new Date().toISOString(), // Set to today for profit calculation
    parts: [{ name: 'Motul 7100 10W-40 Oil', quantity: 4, price: 18 }, { name: 'OEM Oil Filter', quantity: 1, price: 15 }],
    laborCost: 120,
    messages: [],
  },
];

const initialShoppingList: ShoppingListItem[] = [
    { id: 1, name: 'Chain Lube (Teflon)', price: 15.99, isBought: false },
    { id: 2, name: 'Brake Cleaner (2 Cans)', price: 12.50, isBought: true, boughtDate: new Date().toISOString() },
    { id: 3, name: 'Set of M6 bolts', price: 8.00, isBought: false },
    { id: 4, name: 'Shop Rags (50-pack)', price: 25.00, isBought: true, boughtDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

export type View = 'CUSTOMER_FORM' | 'ADMIN_DASHBOARD' | 'TECH_SUGGESTIONS' | 'ARTICLES' | 'SHOPPING_LIST';

const BOOKINGS_STORAGE_KEY = 'corner-tuned-bookings';
const SHOPPING_LIST_STORAGE_KEY = 'corner-tuned-shopping-list';

function App() {
  const [currentView, setView] = useState<View>('CUSTOMER_FORM');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isRunningInFrame, setIsRunningInFrame] = useState(false);
  
  // Load bookings from localStorage or use initial data
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const storedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      // If we have stored bookings, parse them. Otherwise, use the initial dummy data.
      return storedBookings ? JSON.parse(storedBookings) : initialBookings;
    } catch (error) {
      console.error("Error reading bookings from localStorage", error);
      // Fallback to initial data in case of error
      return initialBookings;
    }
  });
  
  // Load shopping list from localStorage or use initial data
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>(() => {
    try {
        const storedItems = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
        return storedItems ? JSON.parse(storedItems) : initialShoppingList;
    } catch (error) {
        console.error("Error reading shopping list from localStorage", error);
        return initialShoppingList;
    }
  });

  // Persist bookings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error("Error saving bookings to localStorage", error);
    }
  }, [bookings]);

  // Persist shopping list to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(shoppingListItems));
    } catch (error) {
        console.error("Error saving shopping list to localStorage", error);
    }
  }, [shoppingListItems]);
  
  // PWA Install Prompt Logic & Iframe check
  useEffect(() => {
    setIsRunningInFrame(window.self !== window.top);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Prevent the default mini-infobar
      setInstallPrompt(event); // Stash the event to be triggered later
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listener for when the app is successfully installed
    window.addEventListener('appinstalled', () => {
      setInstallPrompt(null); // Hide the install button
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    // Show the browser's install prompt
    await installPrompt.prompt();
    // The prompt can only be used once, so clear it
    setInstallPrompt(null);
  };
  
  const getNextId = (items: {id: number}[]) => {
    if (items.length === 0) {
      return 1;
    }
    return Math.max(...items.map(b => b.id)) + 1;
  };

  const addBooking = (newBooking: Omit<Booking, 'id'>) => {
    const newId = getNextId(bookings);
    setBookings(prev => [...prev, { ...newBooking, id: newId }]);
  };

  const updateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };
  
  const addShoppingListItem = (newItem: Omit<ShoppingListItem, 'id' | 'isBought' | 'boughtDate'>) => {
      const newId = getNextId(shoppingListItems);
      setShoppingListItems(prev => [...prev, { ...newItem, id: newId, isBought: false }]);
  };

  const updateShoppingListItem = (updatedItem: ShoppingListItem) => {
      setShoppingListItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const removeShoppingListItem = (id: number) => {
      setShoppingListItems(prev => prev.filter(item => item.id !== id));
  };

  const renderView = () => {
    switch (currentView) {
      case 'CUSTOMER_FORM':
        return <CustomerForm addBooking={addBooking} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard bookings={bookings} updateBooking={updateBooking} />;
      case 'TECH_SUGGESTIONS':
        return <TechSuggestions />;
      case 'ARTICLES':
        return <Articles />;
      case 'SHOPPING_LIST':
        return <ShoppingList 
                    items={shoppingListItems} 
                    bookings={bookings}
                    addItem={addShoppingListItem}
                    updateItem={updateShoppingListItem}
                    removeItem={removeShoppingListItem}
                />;
      default:
        return <CustomerForm addBooking={addBooking} />;
    }
  };

  return (
    <div className="bg-dark min-h-screen text-light font-sans">
      <Header
        currentView={currentView}
        setView={setView}
        onInstallClick={handleInstallClick}
        showInstallButton={!!installPrompt}
        isRunningInFrame={isRunningInFrame}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;