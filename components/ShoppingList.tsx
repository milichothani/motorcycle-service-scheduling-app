import React, { useState, useMemo } from 'react';
import type { ShoppingListItem, Booking } from '../types.ts';
import { ServiceStatus } from '../types.ts';
import { TrashIcon } from './icons.tsx';

interface ShoppingListProps {
  items: ShoppingListItem[];
  bookings: Booking[];
  addItem: (item: Omit<ShoppingListItem, 'id' | 'isBought' | 'boughtDate'>) => void;
  updateItem: (item: ShoppingListItem) => void;
  removeItem: (id: number) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, bookings, addItem, updateItem, removeItem }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(itemPrice);
    if (itemName.trim() && !isNaN(price) && price >= 0) {
      addItem({ name: itemName, price });
      setItemName('');
      setItemPrice('');
    } else {
      alert('Please enter a valid item name and price.');
    }
  };

  const handleToggleBought = (item: ShoppingListItem) => {
    updateItem({ 
        ...item, 
        isBought: !item.isBought,
        boughtDate: !item.isBought ? new Date().toISOString() : undefined,
    });
  };
  
  const { toBuyItems, boughtItems, totalBoughtCost, totalListCost, monthlyProfit } = useMemo(() => {
    const toBuy = items.filter(item => !item.isBought);
    const bought = items.filter(item => item.isBought);
    const boughtCost = bought.reduce((sum, item) => sum + item.price, 0);
    const totalCost = items.reduce((sum, item) => sum + item.price, 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRevenue = bookings
      .filter(booking => {
        if (booking.status !== ServiceStatus.Completed) return false;
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      })
      .reduce((total, booking) => {
        const partsTotal = booking.parts.reduce((sum, part) => sum + part.price * part.quantity, 0);
        return total + booking.laborCost + partsTotal;
      }, 0);

    const monthlyExpenses = items
      .filter(item => {
        if (!item.isBought || !item.boughtDate) return false;
        const boughtDate = new Date(item.boughtDate);
        return boughtDate.getMonth() === currentMonth && boughtDate.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + item.price, 0);
    
    const profit = monthlyRevenue - monthlyExpenses;

    return {
      toBuyItems: toBuy,
      boughtItems: bought,
      totalBoughtCost: boughtCost,
      totalListCost: totalCost,
      monthlyProfit: profit,
    };
  }, [items, bookings]);

  const ShoppingListItemRow: React.FC<{item: ShoppingListItem}> = ({ item }) => (
    <div className="flex items-center justify-between p-3 bg-dark rounded-md border border-charcoal/50 group">
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                checked={item.isBought}
                onChange={() => handleToggleBought(item)}
                className="form-checkbox h-5 w-5 rounded bg-charcoal border-charcoal text-primary-orange focus:ring-primary-orange"
            />
            <span className={`text-light ${item.isBought ? 'line-through text-muted' : ''}`}>
                {item.name}
            </span>
        </div>
        <div className="flex items-center gap-3">
            <span className={`font-mono text-sm ${item.isBought ? 'text-muted' : 'text-primary-orange'}`}>
              ₹{item.price.toFixed(2)}
            </span>
            <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-light">Workshop Shopping List</h2>
        <p className="text-muted">Track parts and supplies needed for the workshop.</p>
      </div>

      {/* Add Item Form & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-2xl">
            <h3 className="text-lg font-semibold text-primary-orange border-b border-charcoal pb-2 mb-4">Add New Item</h3>
            <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="Item Name (e.g., Brake Pads)"
                className="flex-grow bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange"
                required
              />
               <input
                type="number"
                value={itemPrice}
                onChange={e => setItemPrice(e.target.value)}
                placeholder="Price (₹)"
                className="sm:w-32 bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange"
                min="0"
                step="0.01"
                required
              />
              <button type="submit" className="bg-primary-orange text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity duration-300">
                Add Item
              </button>
            </form>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-2xl flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
                <span className="text-muted">Total Cost (Bought):</span>
                <span className="text-xl font-bold font-mono text-green-400">₹{totalBoughtCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted">Total List Cost:</span>
                <span className="text-xl font-bold font-mono text-primary-orange">₹{totalListCost.toFixed(2)}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-charcoal">
                <div className="flex justify-between items-center">
                    <span className="text-muted">This Month's Profit:</span>
                    <span className={`text-xl font-bold font-mono ${monthlyProfit >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        ₹{monthlyProfit.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Item Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* To Buy Column */}
        <div className="bg-card rounded-lg p-4 flex flex-col">
          <h3 className="font-bold text-lg text-primary-orange mb-4 pb-2 border-b border-charcoal">
            To Buy ({toBuyItems.length})
          </h3>
          <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
            {toBuyItems.length > 0 ? (
                toBuyItems.map(item => <ShoppingListItemRow key={item.id} item={item} />)
            ) : (
                <p className="text-sm text-muted text-center pt-4">Nothing to buy!</p>
            )}
          </div>
        </div>
        {/* Bought Column */}
        <div className="bg-card rounded-lg p-4 flex flex-col">
          <h3 className="font-bold text-lg text-primary-orange mb-4 pb-2 border-b border-charcoal">
            Bought ({boughtItems.length})
          </h3>
          <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
             {boughtItems.length > 0 ? (
                boughtItems.map(item => <ShoppingListItemRow key={item.id} item={item} />)
            ) : (
                <p className="text-sm text-muted text-center pt-4">No items bought yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;