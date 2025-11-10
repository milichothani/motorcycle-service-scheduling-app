// Fix: Provide full content for components/AdminDashboard.tsx
import React, { useState } from 'react';
import type { Booking } from '../types.ts';
import { ServiceStatus } from '../types.ts';
import BookingCard from './BookingCard.tsx';
import BookingModal from './BookingModal.tsx';

interface AdminDashboardProps {
  bookings: Booking[];
  updateBooking: (booking: Booking) => void;
}

const statusColumns: ServiceStatus[] = [
  ServiceStatus.Pending,
  ServiceStatus.InProgress,
  ServiceStatus.AwaitingParts,
  ServiceStatus.Completed,
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings, updateBooking }) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getBookingsByStatus = (status: ServiceStatus) => {
    return bookings.filter(b => b.status === status);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-light">Workshop Dashboard</h2>
        <p className="text-muted">Manage service bookings and workflow.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusColumns.map(status => (
          <div key={status} className="bg-card rounded-lg p-4 flex flex-col">
            <h3 className="font-bold text-lg text-primary-orange mb-4 pb-2 border-b border-charcoal flex-shrink-0">{status} ({getBookingsByStatus(status).length})</h3>
            <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
              {getBookingsByStatus(status).length > 0 ? (
                 getBookingsByStatus(status).map(booking => (
                   <BookingCard key={booking.id} booking={booking} onSelect={handleSelectBooking} />
                 ))
              ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted text-center pt-4">No bookings in this stage.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedBooking && (
        <BookingModal 
          booking={selectedBooking} 
          onClose={handleCloseModal} 
          onUpdate={updateBooking} 
        />
      )}
    </>
  );
};

export default AdminDashboard;