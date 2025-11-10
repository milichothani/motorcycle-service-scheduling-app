import React from 'react';
import type { Booking } from '../types.ts';
import { MotorcycleIcon, ShareIcon, DownloadIcon } from './icons.tsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';


interface InvoiceProps {
  booking: Booking;
  onBack: () => void;
}

declare const html2pdf: any;

const Invoice: React.FC<InvoiceProps> = ({ booking, onBack }) => {
  const totalPartsCost = booking.parts.reduce((acc, part) => acc + (part.price * part.quantity), 0);
  const totalCost = totalPartsCost + booking.laborCost;
  const isOnline = useOnlineStatus();

  const handleDownloadPdf = () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    const options = {
      margin: 0.5,
      filename: `Invoice-${booking.id.toString().padStart(5, '0')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1e1e1e' // tailwind 'card' color
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(options).save();
  };

  const handleShareWhatsApp = () => {
    if (!isOnline) {
      alert("You are currently offline. Sharing via WhatsApp requires an internet connection.");
      return;
    }

    const partsSummary = booking.parts.length > 0
      ? booking.parts.map(p => `- ${p.name} (x${p.quantity}): ₹${(p.price * p.quantity).toFixed(2)}`).join('\n')
      : '- No parts used.';

    const message = `
Hello ${booking.customer.name},

Here is the invoice for your *${booking.motorcycle.make} ${booking.motorcycle.model}* from *Corner Tuned Motorcycles*.

*Invoice #: ${booking.id.toString().padStart(5, '0')}*

*Summary:*
${partsSummary}
- Labor: ₹${booking.laborCost.toFixed(2)}

--------------------
*Total Due: ₹${totalCost.toFixed(2)}*
--------------------

Thank you for your business! We appreciate you choosing Corner Tuned.
`.trim();

    // Replace special characters for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center p-4">
      <div className="bg-card text-light rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-charcoal">
        <div className="p-4 bg-dark/80 flex justify-between items-center print:hidden border-b border-charcoal">
            <h3 className="text-lg font-bold text-light">Invoice Preview</h3>
            <div>
                 <button onClick={handleDownloadPdf} className="text-sm border border-primary-orange text-primary-orange px-4 py-2 rounded hover:bg-primary-orange hover:text-white transition-colors mr-2 inline-flex items-center gap-2">
                    <DownloadIcon className="w-4 h-4" />
                    Export PDF
                 </button>
                 <button onClick={handleShareWhatsApp} className="text-sm bg-primary-orange text-white font-bold px-4 py-2 rounded hover:opacity-90 mr-2 inline-flex items-center gap-2">
                    <ShareIcon className="w-4 h-4" />
                    Share on WhatsApp
                 </button>
                <button onClick={onBack} className="text-sm text-muted px-4 py-2 rounded hover:bg-charcoal">Back</button>
            </div>
        </div>

        <div id="invoice-content" className="p-8 overflow-y-auto bg-card">
            {/* Header */}
            <div className="flex justify-between items-start pb-6 border-b border-charcoal">
                <div>
                    <h1 className="text-3xl font-bold text-white">INVOICE</h1>
                    <p className="text-muted">Invoice #: {booking.id.toString().padStart(5, '0')}</p>
                    <p className="text-muted">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <MotorcycleIcon className="h-8 w-8 text-primary-orange" />
                         <h2 className="text-2xl font-bold font-display text-light">Corner Tuned</h2>
                    </div>
                    <p className="text-sm text-muted">123 Biker Lane, Apex, NC 27502</p>
                    <p className="text-sm text-muted">contact@cornertuned.com</p>
                </div>
            </div>
            
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                    <h4 className="font-bold text-muted mb-2">BILL TO</h4>
                    <p className="font-semibold text-lg text-light">{booking.customer.name}</p>
                    <p className="text-muted">{booking.customer.contact}</p>
                </div>
                <div>
                    <h4 className="font-bold text-muted mb-2">VEHICLE</h4>
                    <p className="font-semibold text-lg text-light">{booking.motorcycle.make} {booking.motorcycle.model}</p>
                    <p className="text-muted">{booking.motorcycle.regNumber}</p>
                </div>
            </div>
            
            {/* Items Table */}
            <div className="mt-8">
                <table className="w-full">
                    <thead className="bg-charcoal/50">
                        <tr>
                            <th className="text-left font-bold p-2">Item Description</th>
                            <th className="text-center font-bold p-2">Qty</th>
                            <th className="text-right font-bold p-2">Unit Price</th>
                            <th className="text-right font-bold p-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booking.parts.map((part, index) => (
                            <tr key={index} className="border-b border-charcoal">
                                <td className="p-2">{part.name}</td>
                                <td className="text-center p-2">{part.quantity}</td>
                                <td className="text-right p-2">₹{part.price.toFixed(2)}</td>
                                <td className="text-right p-2">₹{(part.price * part.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                         <tr className="border-b border-charcoal">
                            <td className="p-2">Labor</td>
                            <td className="text-center p-2">1</td>
                            <td className="text-right p-2">₹{booking.laborCost.toFixed(2)}</td>
                            <td className="text-right p-2">₹{booking.laborCost.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Total */}
            <div className="mt-6 flex justify-end">
                <div className="w-full max-w-xs text-light">
                     <div className="flex justify-between py-1 text-muted">
                        <span className="font-semibold">Subtotal:</span>
                        <span>₹{totalCost.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between py-1 font-bold text-lg border-t border-charcoal mt-2 pt-2 text-primary-orange">
                        <span>TOTAL DUE:</span>
                        <span>₹{totalCost.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-charcoal text-center text-muted text-sm">
                <p>Thank you for your business! Please make payment within 30 days.</p>
                <p>Payments can be made via UPI/Bank Transfer.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;