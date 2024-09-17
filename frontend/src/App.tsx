import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index';
import Login from './pages/Login/index';
import SignUp from './pages/SignUp/index';

const App: React.FC = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
