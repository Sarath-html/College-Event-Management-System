
import { User, Event, Registration, Role } from './types';

export const mockUsers: User[] = [
  { id: 1, name: 'Main Admin', email: 'admin@college.edu', password: 'admin123', role: Role.ADMIN },
  { id: 2, name: 'Dance Club Head', email: 'club@college.edu', password: 'club123', role: Role.COORDINATOR },
  { id: 3, name: 'John Doe', email: 'stu@college.edu', password: 'stu123', role: Role.STUDENT }
];

export const mockEvents: Event[] = [
  { 
    id: 1, 
    title: 'Annual Tech Fest', 
    description: 'Biggest hackathon and exhibition of the year.', 
    date: '2026-1-15', 
    status: 'approved',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000'
  },
  { 
    id: 2, 
    title: 'Cultural Night', 
    description: 'Music, dance and drama performances.', 
    date: '2026-1-20', 
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000'
  },
  { 
    id: 3, 
    title: 'Sports Meet', 
    description: 'Inter-college athletic competitions.', 
    date: '2026-1-05', 
    status: 'approved',
    imageUrl: 'https://images.unsplash.com/photo-1461896704190-3213c9ad81cd?auto=format&fit=crop&q=80&w=1000'
  }
];

export const mockRegistrations: Registration[] = [
  { id: 1, user_id: 3, event_id: 1 },
  { id: 2, user_id: 3, event_id: 3 }
];
