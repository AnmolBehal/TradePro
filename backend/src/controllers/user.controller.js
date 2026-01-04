const User = require('../models/user.model');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      message: 'Error fetching user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, email, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, phone, address },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      message: 'Error updating user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};