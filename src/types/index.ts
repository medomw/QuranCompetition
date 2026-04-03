export interface Application {
  id: string;
  full_name: string;
  age: number;
  parts_count: number;
  created_at: string;
  printed: boolean;
  rank?: string;
  whatsapp?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface Settings {
  id: string;
  registration_open: boolean;
  updated_at: string;
}
