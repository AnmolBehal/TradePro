import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';

// Styles
import GlobalStyle from './styles/GlobalStyle';
import { lightTheme, darkTheme } from './styles/themes';

// Wrap the routes with transition group
const AnimatedRoutes = () => {
  const location = useLocation();
  const nodeRef = React.useRef(null);
  
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} nodeRef={nodeRef} classNames="page" timeout={300}>
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/trading" element={
              <PrivateRoute>
                <Trading />
              </PrivateRoute>
            } />
            <Route path="/portfolio" element={
              <PrivateRoute>
                <Portfolio />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthProvider>
          <Router>
            <Navbar />
            <AnimatedRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;