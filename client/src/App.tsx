import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home } from '@/pages/Home';
import { Courses } from '@/pages/Courses';
import { MyCourses } from '@/pages/MyCourses';
import { Profile } from '@/pages/Profile';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home onSectionChange={setActiveSection} />;
      case 'courses':
        return <Courses />;
      case 'my-courses':
        return <MyCourses />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onSectionChange={setActiveSection} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderSection()}
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
