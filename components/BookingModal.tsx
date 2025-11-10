// Fix: Provide full content for components/BookingModal.tsx
import React, { useState, useEffect } from 'react';
import type { Booking, Part } from '../types.ts';
import { ServiceStatus } from '../types.ts';
import Invoice from './Invoice.tsx';

interface BookingModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdate: (booking: Booking) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ booking, onClose, onUpdate }) => {
  const [status, setStatus] = useState<ServiceStatus>(booking.status);
  const [parts, setParts] = useState<Part[]>(booking.parts);
  const [laborCost, setLaborCost] = useState<number>(booking.laborCost);
  const [partName, setPartName] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [partPrice, setPartPrice] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);


  useEffect(() => {
    setStatus(booking.status);
    setParts(booking.parts);
    setLaborCost(booking.laborCost);
  }, [booking]);

  const handleUpdate = () => {
    onUpdate({ ...booking, status, parts, laborCost });
    onClose();
  };

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (partName && partQty > 0 && partPrice >= 0) {
      setParts([...parts, { name: partName, quantity: partQty, price: partPrice }]);
      setPartName('');
      setPartQty(1);
      setPartPrice(0);
    }
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const totalPartsCost = parts.reduce((acc, part) => acc + part.price * part.quantity, 0);
  const totalCost = totalPartsCost + laborCost;

  if (showInvoice) {
      return <Invoice booking={{...booking, parts, laborCost}} onBack={() => setShowInvoice(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-30 flex justify-center items-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-charcoal flex justify-between items-center">
            <div>
                <h3 className="text-2xl font-bold text-light">{booking.motorcycle.make} {booking.motorcycle.model}</h3>
                <p className="text-muted">{booking.motorcycle.regNumber} / {booking.customer.name}</p>
            </div>
            <button onClick={onClose} className="text-muted hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                    <h4 className="text-lg font-semibold text-primary-orange mb-3">Service Details</h4>
                    <p className="text-sm text-light mb-1"><strong className="font-semibold">Customer:</strong> {booking.customer.name}</p>
                    <p className="text-sm text-light mb-4"><strong className="font-semibold">Contact:</strong> {booking.customer.contact}</p>

                    <p className="text-sm text-light mb-1"><strong className="font-semibold">Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p className="text-sm text-light bg-dark p-3 rounded-md border border-charcoal"><strong className="font-semibold block mb-1">Issue Description:</strong>{booking.description}</p>
                    
                    <div className="mt-6">
                        <label htmlFor="status" className="block text-sm font-medium text-primary-orange mb-2">Service Status</label>
                        <select 
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ServiceStatus)}
                            className="w-full bg-dark text-light p-2 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange"
                        >
                            {Object.values(ServiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    <h4 className="text-lg font-semibold text-primary-orange mb-3">Invoice Items</h4>
                    
                    {/* Parts List */}
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                        {parts.map((part, index) => (
                            <div key={index} className="flex justify-between items-center bg-dark p-2 rounded">
                                <span className="text-sm">{part.name} (x{part.quantity})</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">₹{(part.price * part.quantity).toFixed(2)}</span>
                                    <button onClick={() => handleRemovePart(index)} className="text-red-500 hover:text-red-400 text-lg leading-none">&times;</button>
                                </div>
                            </div>
                        ))}
                         {parts.length === 0 && <p className="text-xs text-muted text-center">No parts added.</p>}
                    </div>

                    {/* Add Part Form */}
                    <form onSubmit={handleAddPart} className="space-y-2 p-3 bg-dark rounded-md border border-charcoal">
                        <input type="text" placeholder="Part Name" value={partName} onChange={e => setPartName(e.target.value)} className="w-full bg-charcoal text-light p-2 text-sm rounded border border-charcoal/50" />
                        <div className="flex gap-2">
                            <input type="number" placeholder="Qty" min="1" value={partQty} onChange={e => setPartQty(parseInt(e.target.value))} className="w-1/3 bg-charcoal text-light p-2 text-sm rounded border border-charcoal/50" />
                            <input type="number" placeholder="Price" min="0" step="0.01" value={partPrice} onChange={e => setPartPrice(parseFloat(e.target.value))} className="w-2/3 bg-charcoal text-light p-2 text-sm rounded border border-charcoal/50" />
                        </div>
                        <button type="submit" className="w-full text-xs bg-primary-orange/50 hover:bg-primary-orange text-white p-1 rounded">Add Part</button>
                    </form>

                     <div className="mt-4">
                        <label htmlFor="labor" className="block text-sm font-medium text-muted mb-1">Labor Cost</label>
                        <input id="labor" type="number" value={laborCost} min="0" step="0.01" onChange={e => setLaborCost(parseFloat(e.target.value) || 0)} className="w-full bg-dark text-light p-2 rounded border border-charcoal" />
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-charcoal text-right">
                <h4 className="text-xl font-bold">Total: ₹{totalCost.toFixed(2)}</h4>
            </div>
        </div>

        <div className="p-4 bg-charcoal/50 flex justify-between items-center">
            <button onClick={() => setShowInvoice(true)} className="text-sm border border-primary-orange text-primary-orange px-4 py-2 rounded hover:bg-primary-orange hover:text-white transition-colors">Generate Invoice</button>
            <div>
                <button onClick={onClose} className="text-sm text-muted px-4 py-2 rounded hover:bg-dark mr-2">Cancel</button>
                <button onClick={handleUpdate} className="text-sm bg-primary-orange text-white font-bold px-6 py-2 rounded hover:opacity-90">Save Changes</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;