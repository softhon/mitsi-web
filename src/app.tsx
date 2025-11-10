import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Room from './pages/room';
import { ThemeProvider } from './providers/theme-provider';
import { Toaster } from './components/ui/sonner';

const App = () => {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/:roomId" element={<Room />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
