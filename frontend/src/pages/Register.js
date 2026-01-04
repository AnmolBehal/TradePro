import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
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
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <h2>Create Your Account</h2>
        <p>Join our trading platform and start investing today.</p>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <RegisterForm onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              minLength="3"
            />
          </FormGroup>
          
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
              placeholder="Create a password"
              minLength="8"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength="8"
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </RegisterForm>
        
        <LoginLink>
          Already have an account? <Link to="/login">Login here</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

// Styled components
const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px;
`;

const RegisterCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
  
  h2 {
    margin-bottom: 10px;
    color: ${({ theme }) => theme.text};
  }
  
  p {
    margin-bottom: 20px;
    color: ${({ theme }) => theme.secondary};
  }
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
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

const LoginLink = styled.div`
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

export default Register;