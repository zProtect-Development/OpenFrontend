import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Link from './components/NavLink.jsx';
import LinkBtn from './components/NavLinkBtn.jsx';
import NotFound from './components/NotFound.jsx';
import Home from './components/Home.jsx';
import Price from './components/Price.jsx';
import Docs from './components/Docs.jsx';
import Login from './components/Secure/Auth.jsx';
import Dashboard from './components/Secure/Dashboard.jsx';
import Pay from './components/Secure/Pay.jsx';
import './App.css';
import './reset.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Nav>
          <Link to='/'>Home</Link>
          <Link to='/docs'>Documentation</Link>
          <Link to='/pricing'>Pricing</Link>
          <Link to='/dashboard'>Dashboard</Link>
        </Nav>
        <Routes>
          <Route path='*' element={<NotFound />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/docs' element={<Docs />}></Route>
          <Route path='/pricing' element={<Price />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/auth' element={<Login />}></Route>
          <Route path='/pay' element={<Pay />}></Route>
          <Route path='/privacy'></Route>
          <Route path='/terms'></Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

