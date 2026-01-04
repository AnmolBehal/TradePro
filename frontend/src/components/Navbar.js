import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <LogoContainer>
          <Logo to="/">TradePro</Logo>
        </LogoContainer>

        <MobileMenuButton onClick={toggleMenu}>
          {menuOpen ? '✕' : '☰'}
        </MobileMenuButton>

        <NavLinks menuOpen={menuOpen}>
          {currentUser ? (
            <>
              <NavLink to="/dashboard" active={isActive('/dashboard')}>
                <NavIcon>📊</NavIcon> Dashboard
              </NavLink>
              <NavLink to="/trading" active={isActive('/trading')}>
                <NavIcon>📈</NavIcon> Trading
              </NavLink>
              <NavLink to="/portfolio" active={isActive('/portfolio')}>
                <NavIcon>💼</NavIcon> Portfolio
              </NavLink>
              <NavLink to="/profile" active={isActive('/profile')}>
                <NavIcon>👤</NavIcon> Profile
              </NavLink>
              <LogoutButton onClick={handleLogout}>
                <NavIcon>🚪</NavIcon> Logout
              </LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/login" active={isActive('/login')}>
                <NavIcon>🔑</NavIcon> Login
              </NavLink>
              <NavLink to="/register" active={isActive('/register')}>
                <NavIcon>📝</NavIcon> Register
              </NavLink>
            </>
          )}
          <ThemeToggle onClick={toggleTheme}>
            {darkMode ? '☀️' : '🌙'}
          </ThemeToggle>
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

// Styled components
const NavbarContainer = styled.nav`
  background-color: ${({ theme }) => theme.cardBackground};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: ${({ theme }) => theme.cardBackground};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    gap: 15px;
    display: ${({ menuOpen }) => (menuOpen ? 'flex' : 'none')};
    animation: slideDown 0.3s ease;
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }
`;

const NavIcon = styled.span`
  margin-right: 8px;
`;

const NavLink = styled(Link)`
  color: ${({ theme, active }) => active ? theme.primary : theme.text};
  text-decoration: none;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.negative};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
    justify-content: flex-start;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    transform: rotate(30deg);
  }
`;

export default Navbar;