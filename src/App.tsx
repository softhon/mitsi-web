import { Button } from './components/ui/button';
import TypographyShowcase from './showcases/typography-showcase';

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button className=" text-blue-600">Click me</Button>
      <TypographyShowcase />
    </div>
  );
}

export default App;
