export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
