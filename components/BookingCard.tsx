import React from 'react';
import type { Booking } from '../types.ts';

interface BookingCardProps {
  booking: Booking;
  onSelect: (booking: Booking) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(booking)}
      className="bg-charcoal rounded-lg p-4 shadow-md hover:shadow-lg hover:shadow-primary-orange/20 hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary-orange"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-light truncate">{booking.motorcycle.make} {booking.motorcycle.model}</h4>
          <p className="text-sm text-muted">{booking.motorcycle.regNumber}</p>
        </div>
        <p className="text-xs text-muted">{new Date(booking.bookingDate).toLocaleDateString()}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm text-light font-medium">Customer: <span className="font-normal">{booking.customer.name}</span></p>
        <p className="text-sm text-light line-clamp-2 mt-1">Issue: <span className="font-normal text-muted">{booking.description}</span></p>
      </div>
    </div>
  );
};

export default BookingCard;