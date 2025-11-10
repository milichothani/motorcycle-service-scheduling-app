// Fix: Provide full content for types.ts
export enum ServiceStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  AwaitingParts = 'Awaiting Parts',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface Customer {
  name: string;
  contact: string; // Could be phone or email
}

export interface Motorcycle {
  make: string;
  model: string;
  regNumber: string;
}

export interface Part {
  name: string;
  quantity: number;
  price: number;
}

export interface Message {
  sender: 'admin' | 'customer';
  text: string;
  timestamp: string;
}

export interface Booking {
  id: number;
  customer: Customer;
  motorcycle: Motorcycle;
  description: string;
  status: ServiceStatus;
  bookingDate: string;
  parts: Part[];
  laborCost: number;
  messages: Message[];
}

export interface ShoppingListItem {
  id: number;
  name: string;
  price: number;
  isBought: boolean;
  boughtDate?: string;
}