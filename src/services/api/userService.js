import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'
import { delay } from '../utils'

// Import users from auth service (in real app, would use shared database)
import authService from './authService'

const userService = {
  // Get user profile
  async getProfile(userId) {
    await delay(200)
    
    // In real app, would fetch from database
    const user = await authService.getCurrentUser()
    if (!user || user.id !== userId) {
      throw new Error('User not found')
    }
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      securitySettings: user.securitySettings
    }
  },

  // Update user profile
  async updateProfile(userId, updates) {
    await delay(300)
    
    // Find user (in real app, would use database query)
    const users = [] // Would get from database
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    const user = users[userIndex]
    
    // Validate updates
    const allowedFields = ['firstName', 'lastName', 'phone', 'avatar']
    const filteredUpdates = {}
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    }
    
    // Update user
    Object.assign(user, filteredUpdates, { updatedAt: new Date().toISOString() })
    
    const { password, ...userWithoutPassword } = user
    
    return {
      user: userWithoutPassword,
      message: 'Profile updated successfully'
    }
  },

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    await delay(400)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Verify current password
    if (user.password) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect')
      }
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    
    // Invalidate all refresh tokens for security
    user.refreshTokens = []
    
    return { message: 'Password changed successfully' }
  },

  // Update email
  async updateEmail(userId, newEmail, password) {
    await delay(400)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Verify password
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new Error('Password is incorrect')
      }
    }
    
    // Check if email is already taken
    const existingUser = users.find(u => u.email === newEmail && u.id !== userId)
    if (existingUser) {
      throw new Error('Email is already taken')
    }
    
    user.email = newEmail
    user.isEmailVerified = false
    
    // Generate verification token
    const verificationToken = 'verification_' + Date.now()
    
    return {
      message: 'Email updated successfully. Please verify your new email address.',
      verificationToken
    }
  },

  // Setup 2FA
  async setupTwoFactor(userId) {
    await delay(300)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Generate secret (in real app, use speakeasy)
    const secret = 'JBSWY3DPEHPK3PXP' // Mock secret
    
    // Generate QR code
    const otpauthUrl = `otpauth://totp/FixItNow:${user.email}?secret=${secret}&issuer=FixItNow`
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl)
    
    // Store secret temporarily (not enabled until verified)
    user.twoFactorSecret = secret
    
    return {
      secret,
      qrCode: qrCodeUrl,
      backupCodes: [
        'ABC123DEF',
        'GHI456JKL',
        'MNO789PQR',
        'STU012VWX',
        'YZA345BCD'
      ]
    }
  },

  // Enable 2FA
  async enableTwoFactor(userId, token) {
    await delay(300)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    if (!user.twoFactorSecret) {
      throw new Error('2FA setup not initiated')
    }
    
    // Verify token (in real app, use speakeasy)
    if (token !== '123456') {
      throw new Error('Invalid 2FA token')
    }
    
    user.twoFactorEnabled = true
    
    return { message: '2FA enabled successfully' }
  },

  // Disable 2FA
  async disableTwoFactor(userId, password) {
    await delay(300)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Verify password
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new Error('Password is incorrect')
      }
    }
    
    user.twoFactorEnabled = false
    user.twoFactorSecret = null
    
    return { message: '2FA disabled successfully' }
  },

  // Get connected accounts
  async getConnectedAccounts(userId) {
    await delay(200)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user.oauthConnections || []
  },

  // Connect OAuth account
  async connectOAuthAccount(userId, provider, oauthData) {
    await delay(300)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Check if already connected
    const existingConnection = user.oauthConnections?.find(
      conn => conn.provider === provider && conn.providerId === oauthData.id
    )
    
    if (existingConnection) {
      throw new Error('Account already connected')
    }
    
    // Add connection
    const connection = {
      id: `oauth_${Date.now()}`,
      provider,
      providerId: oauthData.id,
      email: oauthData.email,
      connectedAt: new Date().toISOString()
    }
    
    if (!user.oauthConnections) {
      user.oauthConnections = []
    }
    
    user.oauthConnections.push(connection)
    
    return {
      connection,
      message: `${provider} account connected successfully`
    }
  },

  // Disconnect OAuth account
  async disconnectOAuthAccount(userId, connectionId) {
    await delay(300)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    const connectionIndex = user.oauthConnections?.findIndex(
      conn => conn.id === connectionId
    )
    
    if (connectionIndex === -1) {
      throw new Error('Connected account not found')
    }
    
    // Check if user has password or other OAuth connections
    const hasPassword = !!user.password
    const otherConnections = user.oauthConnections.filter(conn => conn.id !== connectionId)
    
    if (!hasPassword && otherConnections.length === 0) {
      throw new Error('Cannot disconnect the only login method. Please set a password first.')
    }
    
    user.oauthConnections.splice(connectionIndex, 1)
    
    return { message: 'Account disconnected successfully' }
  },

  // Update security settings
  async updateSecuritySettings(userId, settings) {
    await delay(300)
    
    const users = [] // Would get from database
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    const allowedSettings = [
      'emailNotifications',
      'smsNotifications', 
      'loginAlerts',
      'sessionTimeout'
    ]
    
    const filteredSettings = {}
    for (const setting of allowedSettings) {
      if (settings[setting] !== undefined) {
        filteredSettings[setting] = settings[setting]
      }
    }
    
    user.securitySettings = {
      ...user.securitySettings,
      ...filteredSettings
    }
    
    return {
      securitySettings: user.securitySettings,
      message: 'Security settings updated successfully'
    }
  },

  // Delete account
  async deleteAccount(userId, password) {
    await delay(500)
    
    const users = [] // Would get from database
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    const user = users[userIndex]
    
    // Verify password
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new Error('Password is incorrect')
      }
    }
    
    // In real app, would:
    // 1. Anonymize user data
    // 2. Delete associated records
    // 3. Revoke all tokens
    // 4. Send confirmation email
    
    users.splice(userIndex, 1)
    
    return { message: 'Account deleted successfully' }
  },

  // Get account activity
  async getAccountActivity(userId, limit = 20) {
    await delay(200)
    
    // Mock activity data
    const activities = [
      {
        id: '1',
        type: 'login',
        description: 'Logged in from Chrome on Windows',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: 'New York, US'
      },
      {
        id: '2',
        type: 'profile_update',
        description: 'Updated profile information',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        location: 'New York, US'
      },
      {
        id: '3',
        type: 'password_change',
        description: 'Password changed',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: 'New York, US'
      },
      {
        id: '4',
        type: 'oauth_connect',
        description: 'Connected Google account',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'New York, US'
      },
      {
        id: '5',
        type: 'login_failed',
        description: 'Failed login attempt',
        ipAddress: '192.168.1.200',
        userAgent: 'Firefox 119.0',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Unknown'
      }
    ]
    
    return activities.slice(0, limit)
  }
}

export default userService