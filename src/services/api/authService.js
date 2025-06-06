import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { delay } from '../utils'

// Mock users database
let users = [
  {
    id: '1',
    email: 'john.doe@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    isEmailVerified: true,
    isPhoneVerified: false,
    twoFactorEnabled: false,
    twoFactorSecret: null,
    role: 'user',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T08:15:00Z',
    loginAttempts: 0,
    lockoutUntil: null,
    refreshTokens: [],
    oauthConnections: [],
    securitySettings: {
      emailNotifications: true,
      smsNotifications: false,
      loginAlerts: true,
      sessionTimeout: 30
    }
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1987654321',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b93c',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: true,
    twoFactorSecret: 'JBSWY3DPEHPK3PXP',
    role: 'user',
    createdAt: '2024-01-10T14:20:00Z',
    lastLogin: '2024-01-19T16:45:00Z',
    loginAttempts: 0,
    lockoutUntil: null,
    refreshTokens: [],
    oauthConnections: [
      {
        id: 'oauth_1',
        provider: 'google',
        providerId: 'google_123456789',
        email: 'jane.smith@gmail.com',
        connectedAt: '2024-01-10T14:20:00Z'
      }
    ],
    securitySettings: {
      emailNotifications: true,
      smsNotifications: true,
      loginAlerts: true,
      sessionTimeout: 60
    }
  }
]

// Email verification tokens
let emailTokens = []

// Password reset tokens
let resetTokens = []

// Rate limiting store
let rateLimitStore = new Map()

// Session store
let activeSessions = new Map()

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'fallback-secret'
const MAX_LOGIN_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5
const LOCKOUT_DURATION = parseInt(import.meta.env.VITE_LOCKOUT_DURATION) || 15 // minutes

// Helper functions
const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

const generateSecureToken = () => {
  return CryptoJS.lib.WordArray.random(32).toString()
}

const isRateLimited = (identifier, maxRequests = 5, windowMs = 15 * 60 * 1000) => {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, [])
  }
  
  const requests = rateLimitStore.get(identifier)
  const validRequests = requests.filter(time => time > windowStart)
  
  if (validRequests.length >= maxRequests) {
    return true
  }
  
  validRequests.push(now)
  rateLimitStore.set(identifier, validRequests)
  return false
}

// Auth service methods
const authService = {
  // Register new user
  async register(userData) {
    await delay(400)
    
    // Rate limiting
    if (isRateLimited(`register_${userData.email}`)) {
      throw new Error('Too many registration attempts. Please try again later.')
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password)
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
      avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=2563EB&color=fff`,
      isEmailVerified: false,
      isPhoneVerified: false,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginAttempts: 0,
      lockoutUntil: null,
      refreshTokens: [],
      oauthConnections: [],
      securitySettings: {
        emailNotifications: true,
        smsNotifications: false,
        loginAlerts: true,
        sessionTimeout: 30
      }
    }
    
    users.push(newUser)
    
    // Generate email verification token
    const verificationToken = generateSecureToken()
    emailTokens.push({
      token: verificationToken,
      userId: newUser.id,
      email: newUser.email,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      createdAt: Date.now()
    })
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser
    
    return {
      user: userWithoutPassword,
      verificationToken,
      message: 'Registration successful. Please check your email to verify your account.'
    }
  },

  // Login user
  async login(email, password, rememberMe = false) {
    await delay(500)
    
    // Rate limiting
    if (isRateLimited(`login_${email}`)) {
      throw new Error('Too many login attempts. Please try again later.')
    }
    
    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
      const lockoutMinutes = Math.ceil((user.lockoutUntil - Date.now()) / (60 * 1000))
      throw new Error(`Account locked. Try again in ${lockoutMinutes} minutes.`)
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1
      
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockoutUntil = Date.now() + (LOCKOUT_DURATION * 60 * 1000)
        throw new Error(`Account locked due to too many failed attempts. Try again in ${LOCKOUT_DURATION} minutes.`)
      }
      
      throw new Error(`Invalid email or password. ${MAX_LOGIN_ATTEMPTS - user.loginAttempts} attempts remaining.`)
    }
    
    // Reset login attempts on successful login
    user.loginAttempts = 0
    user.lockoutUntil = null
    user.lastLogin = new Date().toISOString()
    
    // Generate tokens
    const accessToken = generateToken(
      { userId: user.id, email: user.email, role: user.role },
      rememberMe ? '30d' : '7d'
    )
    
    const refreshToken = generateSecureToken()
    
    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: Date.now(),
      userAgent: 'Browser', // In real app, get from request headers
      ipAddress: '127.0.0.1' // In real app, get from request
    })
    
    // Store active session
    const sessionId = generateSecureToken()
    activeSessions.set(sessionId, {
      userId: user.id,
      accessToken,
      refreshToken,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      userAgent: 'Browser',
      ipAddress: '127.0.0.1'
    })
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      sessionId,
      expiresIn: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // seconds
    }
  },

  // Verify email
  async verifyEmail(token) {
    await delay(300)
    
    const emailToken = emailTokens.find(t => t.token === token && t.expiresAt > Date.now())
    if (!emailToken) {
      throw new Error('Invalid or expired verification token')
    }
    
    const user = users.find(u => u.id === emailToken.userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    user.isEmailVerified = true
    
    // Remove used token
    emailTokens = emailTokens.filter(t => t.token !== token)
    
    return { message: 'Email verified successfully' }
  },

  // Request password reset
  async requestPasswordReset(email) {
    await delay(400)
    
    // Rate limiting
    if (isRateLimited(`reset_${email}`)) {
      throw new Error('Too many reset requests. Please try again later.')
    }
    
    const user = users.find(u => u.email === email)
    if (!user) {
      // Don't reveal if email exists for security
      return { message: 'If the email exists, a reset link has been sent.' }
    }
    
    // Generate reset token
    const resetToken = generateSecureToken()
    resetTokens.push({
      token: resetToken,
      userId: user.id,
      email: user.email,
      expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
      createdAt: Date.now()
    })
    
    return {
      resetToken, // In real app, this would be sent via email
      message: 'If the email exists, a reset link has been sent.'
    }
  },

  // Reset password
  async resetPassword(token, newPassword) {
    await delay(400)
    
    const resetToken = resetTokens.find(t => t.token === token && t.expiresAt > Date.now())
    if (!resetToken) {
      throw new Error('Invalid or expired reset token')
    }
    
    const user = users.find(u => u.id === resetToken.userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword)
    user.password = hashedPassword
    
    // Reset login attempts and lockout
    user.loginAttempts = 0
    user.lockoutUntil = null
    
    // Invalidate all refresh tokens for security
    user.refreshTokens = []
    
    // Remove used token
    resetTokens = resetTokens.filter(t => t.token !== token)
    
    // Clear all active sessions for this user
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.userId === user.id) {
        activeSessions.delete(sessionId)
      }
    }
    
    return { message: 'Password reset successfully' }
  },

  // Refresh access token
  async refreshToken(refreshToken) {
    await delay(200)
    
    // Find user with this refresh token
    const user = users.find(u => 
      u.refreshTokens.some(rt => rt.token === refreshToken && rt.expiresAt > Date.now())
    )
    
    if (!user) {
      throw new Error('Invalid or expired refresh token')
    }
    
    // Remove old refresh token
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken)
    
    // Generate new tokens
    const newAccessToken = generateToken(
      { userId: user.id, email: user.email, role: user.role }
    )
    
    const newRefreshToken = generateSecureToken()
    
    // Store new refresh token
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: Date.now(),
      userAgent: 'Browser',
      ipAddress: '127.0.0.1'
    })
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }
  },

  // Logout
  async logout(sessionId, refreshToken) {
    await delay(200)
    
    // Remove session
    if (sessionId) {
      activeSessions.delete(sessionId)
    }
    
    // Remove refresh token
    if (refreshToken) {
      const user = users.find(u => 
        u.refreshTokens.some(rt => rt.token === refreshToken)
      )
      
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken)
      }
    }
    
    return { message: 'Logged out successfully' }
  },

  // Logout from all devices
  async logoutAllDevices(userId) {
    await delay(300)
    
    const user = users.find(u => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // Clear all refresh tokens
    user.refreshTokens = []
    
    // Clear all active sessions for this user
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.userId === userId) {
        activeSessions.delete(sessionId)
      }
    }
    
    return { message: 'Logged out from all devices successfully' }
  },

  // Get current user
  async getCurrentUser(token) {
    await delay(100)
    
    try {
      const decoded = verifyToken(token)
      const user = users.find(u => u.id === decoded.userId)
      
      if (!user) {
        throw new Error('User not found')
      }
      
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      throw new Error('Invalid token')
    }
  },

  // OAuth login/register
  async oauthLogin(provider, oauthData) {
    await delay(400)
    
    const { id: providerId, email, name, picture } = oauthData
    
    // Check if user exists with this email
    let user = users.find(u => u.email === email)
    
    if (user) {
      // Check if OAuth connection already exists
      const existingConnection = user.oauthConnections.find(
        conn => conn.provider === provider && conn.providerId === providerId
      )
      
      if (!existingConnection) {
        // Add new OAuth connection
        user.oauthConnections.push({
          id: `oauth_${Date.now()}`,
          provider,
          providerId,
          email,
          connectedAt: new Date().toISOString()
        })
      }
    } else {
      // Create new user
      const [firstName, lastName] = name.split(' ')
      
      user = {
        id: Date.now().toString(),
        email,
        password: null, // OAuth users don't have passwords
        firstName,
        lastName: lastName || '',
        phone: '',
        avatar: picture || `https://ui-avatars.com/api/?name=${name}&background=2563EB&color=fff`,
        isEmailVerified: true, // OAuth emails are considered verified
        isPhoneVerified: false,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginAttempts: 0,
        lockoutUntil: null,
        refreshTokens: [],
        oauthConnections: [{
          id: `oauth_${Date.now()}`,
          provider,
          providerId,
          email,
          connectedAt: new Date().toISOString()
        }],
        securitySettings: {
          emailNotifications: true,
          smsNotifications: false,
          loginAlerts: true,
          sessionTimeout: 30
        }
      }
      
      users.push(user)
    }
    
    user.lastLogin = new Date().toISOString()
    
    // Generate tokens
    const accessToken = generateToken(
      { userId: user.id, email: user.email, role: user.role }
    )
    
    const refreshToken = generateSecureToken()
    
    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: Date.now(),
      userAgent: 'Browser',
      ipAddress: '127.0.0.1'
    })
    
    // Store active session
    const sessionId = generateSecureToken()
    activeSessions.set(sessionId, {
      userId: user.id,
      accessToken,
      refreshToken,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      userAgent: 'Browser',
      ipAddress: '127.0.0.1'
    })
    
    const { password, ...userWithoutPassword } = user
    
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      sessionId,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }
  },

  // Verify 2FA token
  async verifyTwoFactor(userId, token) {
    await delay(200)
    
    const user = users.find(u => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // In a real app, you would verify the TOTP token against the secret
    // For demo purposes, we'll accept any 6-digit number
    if (!/^\d{6}$/.test(token)) {
      throw new Error('Invalid 2FA token format')
    }
    
    // Mock verification - in real app, use a library like 'speakeasy'
    const isValid = token === '123456' || Math.random() > 0.3 // 70% success rate for demo
    
    if (!isValid) {
      throw new Error('Invalid 2FA token')
    }
    
    return { message: '2FA verification successful' }
  },

  // Get active sessions
  async getActiveSessions(userId) {
    await delay(200)
    
    const userSessions = []
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.userId === userId) {
        userSessions.push({
          id: sessionId,
          createdAt: new Date(session.createdAt).toISOString(),
          lastActivity: new Date(session.lastActivity).toISOString(),
          userAgent: session.userAgent,
          ipAddress: session.ipAddress,
          current: false // Would be determined by comparing with current session
        })
      }
    }
    
    return userSessions
  },

  // Revoke session
  async revokeSession(userId, sessionId) {
    await delay(200)
    
    const session = activeSessions.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found')
    }
    
    activeSessions.delete(sessionId)
    
    // Also remove associated refresh token
    const user = users.find(u => u.id === userId)
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== session.refreshToken)
    }
    
    return { message: 'Session revoked successfully' }
  }
}

export default authService