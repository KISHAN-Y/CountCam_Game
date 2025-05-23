// API service for CountCam app
const API_URL = 'http://localhost:3001/api';

// User API functions
const UserAPI = {
  // Login or create a user
  async loginUser(userData) {
    try {
      // If password is provided but no id, check if this is a login attempt
      if (userData.password && !userData.id) {
        // First try to authenticate with existing credentials
        const loginResponse = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userData.name,
            password: userData.password
          }),
        });
        
        // If login is successful, return the user data
        if (loginResponse.ok) {
          return await loginResponse.json();
        }
        
        // If login failed and we have additional user data, this might be a registration
        // Only proceed with registration if we have avatar (required for new users)
        if (!userData.avatar) {
          // This was a login attempt that failed
          console.error('Login failed: Invalid credentials');
          return null;
        }
      }
      
      // This is a new user registration or guest login
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register or login');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in loginUser:', error);
      return null;
    }
  },
  
  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  },
  
  // Update user data
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in updateUser:', error);
      return null;
    }
  },
  
  // Add game to user history
  async addGameToHistory(userId, gameData) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add game to history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in addGameToHistory:', error);
      return null;
    }
  },
  
  // Get user statistics
  async getUserStats(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to get user stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return null;
    }
  },
  
  // Delete user account
  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      // Instead of returning null, throw the error so we can handle it properly
      throw error;
    }
  }
};

// Game API functions
const GameAPI = {
  // Create a new game session
  async createGame(gameData) {
    try {
      const response = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in createGame:', error);
      return null;
    }
  },
  
  // Get all games for a user
  async getUserGames(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/games`);
      
      if (!response.ok) {
        throw new Error('Failed to get user games');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getUserGames:', error);
      return null;
    }
  },
  
  // Update a game (add question, update score, etc.)
  async updateGame(gameId, gameData) {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update game');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in updateGame:', error);
      return null;
    }
  }
};

// Export the API services
window.UserAPI = UserAPI;
window.GameAPI = GameAPI;
