import React from 'react';
import { WifiOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const OfflinePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-8">
        <WifiOff className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">You're Offline</h1>
      <p className="text-muted-foreground max-w-xs mx-auto mb-8">
        It looks like you've lost your internet connection. Don't worry, you can still browse your cached bookings.
      </p>
      <Button 
        onClick={() => window.location.reload()} 
        className="rounded-full px-8"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Try Reloading
      </Button>
    </div>
  );
};

export default OfflinePage;
