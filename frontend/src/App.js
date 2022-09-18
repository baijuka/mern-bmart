import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from './screens/ProductScreen';

function App() {
  return (
    <BrowserRouter>
    <div>
      <header>
        <a href='/'>B-mart</a>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/product/:slug" element={<ProductScreen />} />
        </Routes>
      </main>
    </div>
    </BrowserRouter>
  );
}

export default App;
