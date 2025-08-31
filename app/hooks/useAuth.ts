import { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthProvider';

export function useAuth() {
  return useContext(AuthContext);
}
