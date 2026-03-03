import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { Providers } from './app/providers';
import { SplashScreen } from './components/ui/SplashScreen';

function App() {
  return (
    <Providers>
      <SplashScreen />
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;