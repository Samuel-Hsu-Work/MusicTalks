// Authentication service
// Contains business logic for authentication (password hashing, user creation, token generation)

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';

export class AuthService {
  // Register a new user
  async register(username: string, email: string, password: string) {
    // Step 1: Check if user already exists (by email or username)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Step 2: Hash the password (never store plain text passwords!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create user in database
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      // Don't return password in response
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    // Step 4: Create JWT token
    if (!env.jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn || '7d' } as SignOptions
    );

    return {
      user,
      token,
    };
  }

  // Login an existing user
  async login(username: string, password: string) {
    // Step 1: Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }, // Allow login with email too
        ],
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Step 2: Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Step 3: Create JWT token
    if (!env.jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn || '7d' } as SignOptions
    );

    // Step 4: Return user (without password) and token
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}

// Export a singleton instance
export const authService = new AuthService();
