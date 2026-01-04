import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <h2>Login to Your Account</h2>
        <p>Welcome back! Please enter your credentials to access your account.</p>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </LoginForm>
        
        <RegisterLink>
          Don't have an account? <Link to="/register">Register here</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

// Styled components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px;
`;

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  
  h2 {
    margin-bottom: 10px;
    color: ${({ theme }) => theme.text};
  }
  
  p {
    margin-bottom: 20px;
    color: ${({ theme }) => theme.secondary};
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  background-color: ${({ theme }) => `${theme.error}10`};
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const RegisterLink = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Login;