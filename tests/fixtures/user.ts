import type { User, UserProfile } from '#types'

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  isVerified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockUserProfile: UserProfile = {
  id: '1',
  userId: '1',
  firstName: 'Test',
  lastName: 'User',
  phone: '+261 34 12 345 67',
  region: 'Antananarivo',
  district: 'Antananarivo I',
  commune: 'Antananarivo',
  farmSize: '2-5 hectares',
  crops: ['Rice', 'Cassava'],
  avatar: null,
  bio: 'Test farmer profile',
  isPublic: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockFarmer: User = {
  ...mockUser,
  id: '2',
  email: 'farmer@example.com',
  name: 'Farmer User',
  role: 'farmer',
}

export const mockAdmin: User = {
  ...mockUser,
  id: '3',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
} 