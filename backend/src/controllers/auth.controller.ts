import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

// Register controller - handles user registration
export const register = async (req: Request, res: Response) => {
  try {
    // Step 1: Get data from request body
    const { username, email, password } = req.body;

    // Step 2: Validate input (basic validation)
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password are required' 
      });
    }

    // Step 3: Call service to register user
    const result = await authService.register(username, email, password);

    // Step 4: Send success response
    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    // Step 5: Handle errors
    if (error.message === 'User with this email or username already exists') {
      return res.status(409).json({ error: error.message });
    }
    
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login controller - handles user login
export const login = async (req: Request, res: Response) => {
  try {
    // Step 1: Get data from request body
    const { username, password } = req.body;

    // Step 2: Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Step 3: Call service to login user
    const result = await authService.login(username, password);

    // Step 4: Send success response
    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    // Step 5: Handle errors
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout controller - handles user logout
// Note: With JWT, logout is usually handled on the client side
// (client just removes the token). But we can provide this endpoint
// for consistency or future token blacklisting.
export const logout = async (req: Request, res: Response) => {
  // Since we're using JWT (stateless), logout is typically handled client-side
  // by removing the token. This endpoint can be used for logging purposes
  // or future token blacklisting if needed.
  
  res.status(200).json({ 
    message: 'Logout successful' 
  });
};
