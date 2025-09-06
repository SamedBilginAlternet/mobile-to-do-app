import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)/projects');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  return <LoadingSpinner text="Loading..." />;
}