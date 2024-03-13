"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

export default function CustomErrorPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 2000);

    // Clear the timer when the component unmounts
    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <main className='custom'>
      <h1>Error Found</h1>
      <p>Redirecting to the home page</p>
      <Loader />
    </main>
  )
}