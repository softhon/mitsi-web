import { ToastContainer, ToastProvider } from './packages/toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Room from './pages/room';
import { ThemeProvider } from './providers/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ToastProvider defaultPosition="top-right">
        <BrowserRouter>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/:roomId" element={<Room />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
