import React, { useState } from 'react';
import type { Booking } from '../types.ts';
import { ServiceStatus } from '../types.ts';

interface CustomerFormProps {
  addBooking: (booking: Omit<Booking, 'id'>) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ addBooking }) => {
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !contact || !make || !model || !regNumber || !description) {
      alert("Please fill in all fields.");
      return;
    }
    const newBooking: Omit<Booking, 'id'> = {
      customer: { name: customerName, contact },
      motorcycle: { make, model, regNumber },
      description,
      status: ServiceStatus.Pending,
      bookingDate: new Date().toISOString(),
      parts: [],
      laborCost: 0,
      messages: [],
    };
    addBooking(newBooking);
    setIsSubmitted(true);
    setTimeout(() => {
        setCustomerName('');
        setContact('');
        setMake('');
        setModel('');
        setRegNumber('');
        setDescription('');
        setIsSubmitted(false);
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-card rounded-lg shadow-xl max-w-2xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-primary-orange mb-4">Thank You!</h2>
        <p className="text-lg text-light">Your service request has been submitted. We will contact you shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
        <h2 className="text-3xl font-display font-bold text-center text-light mb-2">Service Request</h2>
        <p className="text-center text-muted mb-8">Fill out the form below to book your motorcycle service.</p>
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-2xl">
            <div>
                <h3 className="text-lg font-semibold text-primary-orange border-b border-charcoal pb-2 mb-4">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Full Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange" required />
                    <input type="text" placeholder="Phone or Email" value={contact} onChange={e => setContact(e.target.value)} className="w-full bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange" required />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-primary-orange border-b border-charcoal pb-2 mb-4">Motorcycle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Make (e.g., Yamaha)" value={make} onChange={e => setMake(e.target.value)} className="w-full bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange" required />
                    <input type="text" placeholder="Model (e.g., R1)" value={model} onChange={e => setModel(e.target.value)} className="w-full bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange" required />
                </div>
                 <input type="text" placeholder="Registration Number" value={regNumber} onChange={e => setRegNumber(e.target.value)} className="w-full mt-6 bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange" required />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-primary-orange border-b border-charcoal pb-2 mb-4">Service Required</h3>
                <textarea placeholder="Describe the problem or service you need..." value={description} onChange={e => setDescription(e.target.value)} className="w-full h-32 bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange" required></textarea>
            </div>

            <button type="submit" className="w-full bg-primary-orange text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity duration-300 text-lg">Submit Request</button>
        </form>
    </div>
  );
};

export default CustomerForm;