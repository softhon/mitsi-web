import { useState } from 'react';
import { Button } from './components/ui/button';
import { ToastProvider, ToastContainer } from '@/packages/toast';
import TypographyShowcase from '@/showcases/typography-showcase';
import ToastShowcase from '@/showcases/toast-showcase';
import JoinMeetingPage from '@/components/join';

function App() {
  const [currentView, setCurrentView] = useState<
    'typography' | 'badges' | 'toasts' | 'join-meeting'
  >('typography');

  return (
    <ToastProvider defaultPosition="top-right">
      <div className="min-h-screen bg-background">
        {/* Only show navigation for component showcases, not for join meeting */}
        {currentView !== 'join-meeting' && (
          <div className="container mx-auto py-8">
            {/* Navigation */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={currentView === 'typography' ? 'default' : 'outline'}
                onClick={() => setCurrentView('typography')}
              >
                Typography
              </Button>
              <Button
                variant={currentView === 'badges' ? 'default' : 'outline'}
                onClick={() => setCurrentView('badges')}
              >
                Badges
              </Button>
              <Button
                variant={currentView === 'toasts' ? 'default' : 'outline'}
                onClick={() => setCurrentView('toasts')}
              >
                Toasts
              </Button>
              <Button
                variant={currentView === 'join-meeting' ? 'default' : 'outline'}
                onClick={() => setCurrentView('join-meeting')}
              >
                Join Meeting
              </Button>
            </div>

            {/* Content for showcases */}
            {currentView === 'typography' && <TypographyShowcase />}
            {/* {currentView === 'badges' && <BadgeShowcase />} */}
            {currentView === 'toasts' && <ToastShowcase />}
          </div>
        )}

        {/* Full-screen join meeting page */}
        {currentView === 'join-meeting' && (
          <div className="relative">
            {/* Back button for join meeting */}
            <div className="absolute top-4 left-4 z-20">
              <Button
                variant="ghost"
                onClick={() => setCurrentView('typography')}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                ← Back to Components
              </Button>
            </div>
            <JoinMeetingPage />
          </div>
        )}
      </div>

      {/* Toast Container - renders toasts */}
      <ToastContainer />
    </ToastProvider>
  );
}

export default App;
