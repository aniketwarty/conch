import React from 'react';
import { CircularProgress } from '@chakra-ui/react';
import { redirect } from 'next/navigation'

export default function Main() {
  const logged_in = false; //TODO: replace with actual logged in state
  if (logged_in) {
    redirect('/home');
  } else {
    redirect('/log_in');
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CircularProgress isIndeterminate color='black.300' />
    </main>
  );
};