import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Admin from './pages/Admin';
import AdminRegister from './pages/AdminRegister';

function App() {
  return (
    // <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    // <div className="max-w-md w-full space-y-8">
    <div style={{ paddingTop:"env(safe-area-inset-top)"}}>
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/admin/timeupdate" element={<Admin/>} />
            <Route path="/admin/register" element={<AdminRegister/>} />
        </Routes>
      </BrowserRouter>
    </div>
  // </div>
  );
}

export default App;