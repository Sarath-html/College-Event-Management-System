
export enum Role {
  ADMIN = 'admin',
  COORDINATOR = 'coordinator',
  STUDENT = 'student'
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
}
