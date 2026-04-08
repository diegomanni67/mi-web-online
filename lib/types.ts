export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
  STUDENT_ACADEMY = 'STUDENT_ACADEMY',
  STUDENT_STUDIO = 'STUDENT_STUDIO'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  interests: string[];
  classSchedule?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User | null;
  expires: Date;
}
