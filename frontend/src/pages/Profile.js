import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getUserProfile, updateUserProfile, updatePassword } from '../services/userService';
import Loader from '../components/common/Loader';

const Profile = () => {
  const { currentUser, updateUser, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || ''
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setProfileError('Failed to load user profile. Please try again.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setUpdating(true);

    try {
      const updatedUser = await updateUserProfile(profileData);
      updateUser(updatedUser);
      setProfileSuccess('Profile updated successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setProfileSuccess('');
      }, 5000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setProfileError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    setUpdating(true);

    try {
      await updatePassword(passwordData);
      setPasswordSuccess('Password updated successfully!');
      
      // Clear form and success message after 5 seconds
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setPasswordSuccess('');
      }, 5000);
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <h1>Your Profile</h1>
        <p>Manage your account settings and preferences</p>
      </ProfileHeader>

      <ProfileGrid>
        <ProfileSection>
          <SectionTitle>Personal Information</SectionTitle>
          
          {profileSuccess && <SuccessMessage>{profileSuccess}</SuccessMessage>}
          {profileError && <ErrorMessage>{profileError}</ErrorMessage>}
          
          <ProfileForm onSubmit={handleProfileSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
                disabled
              />
              <FieldNote>Email cannot be changed</FieldNote>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                rows="3"
              />
            </FormGroup>
            
            <Button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
          </ProfileForm>
        </ProfileSection>

        <SettingsSection>
          <SectionTitle>Account Settings</SectionTitle>
          
          <SettingsGroup>
            <SettingLabel>Theme</SettingLabel>
            <ThemeToggle>
              <ToggleLabel>Light</ToggleLabel>
              <ToggleSwitch checked={darkMode} onChange={toggleTheme} />
              <ToggleLabel>Dark</ToggleLabel>
            </ThemeToggle>
          </SettingsGroup>
          
          <Divider />
          
          <SectionTitle>Change Password</SectionTitle>
          
          {passwordSuccess && <SuccessMessage>{passwordSuccess}</SuccessMessage>}
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          
          <PasswordForm onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
            </FormGroup>
            
            <Button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Change Password'}
            </Button>
          </PasswordForm>
          
          <Divider />
          
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </SettingsSection>
      </ProfileGrid>
    </ProfileContainer>
  );
};

// Styled components
const ProfileContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  margin-bottom: 30px;
  
  h1 {
    margin-bottom: 5px;
    color: ${({ theme }) => theme.text};
  }
  
  p {
    color: ${({ theme }) => theme.secondary};
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SettingsSection = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PasswordForm = styled.form`
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
  
  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease;
  resize: vertical;
  
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

const LogoutButton = styled.button`
  padding: 12px;
  background-color: ${({ theme }) => theme.error};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.error}dd`};
  }
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.success};
  background-color: ${({ theme }) => `${theme.success}10`};
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  background-color: ${({ theme }) => `${theme.error}10`};
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const FieldNote = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.secondary};
  margin-top: 2px;
`;

const SettingsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SettingLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  width: 50px;
  height: 24px;
  appearance: none;
  background-color: ${({ checked, theme }) => checked ? theme.primary : theme.background};
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ checked }) => checked ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    transition: left 0.3s ease;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
  margin: 30px 0;
`;

export default Profile;