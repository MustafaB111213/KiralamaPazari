// app/index.tsx
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Uygulama açılır açılmaz auth yoluna atla
  return <Redirect href="/auth" />;
}
