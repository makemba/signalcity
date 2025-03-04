
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  user_id?: string;
}

// This interface matches what comes directly from the database
export interface DatabaseNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  user_id?: string;
}
