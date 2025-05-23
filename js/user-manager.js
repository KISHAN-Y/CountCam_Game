// User Manager for CountCam app
// This file handles all user-related functionality

// Default user template with all fields
const userTemplate = {
    id: null,
    name: 'Guest',
    password: '',
    role: 'user',
    avatar: 'https://readdy.ai/api/search-image?query=cute+cartoon+avatar+of+a+fox+character%2C+simple%2C+colorful%2C+child-friendly%2C+digital+art%2C+white+background&width=40&height=40&seq=9&orientation=squarish',
    age: null,
    gradeLevel: '',
    stars: 0,
    badges: 0,
    streak: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    mathSkillLevels: {
        addition: 1,
        subtraction: 1,
        multiplication: 1,
        division: 1
    },
    preferences: {
        soundEffects: true,
        notifications: true,
        difficultyLevel: 'easy'
    },
    gameHistory: [],
    achievements: []
};

// Current user data - use _currentUser internally to avoid conflicts with script.js
let _currentUser = { ...userTemplate };

// Initialize user from localStorage or default
function initUser() {
    const storedUser = localStorage.getItem('countcam_user');
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            _currentUser = { ...userTemplate, ...parsedUser };
        } catch (e) {
            console.error('Error parsing stored user:', e);
        }
    }
    return _currentUser;
}

// Save user to localStorage
function saveUser(userData) {
    localStorage.setItem('countcam_user', JSON.stringify(userData));
}

// Update user with data from MongoDB
async function loginUser(loginData) {
    try {
        // Show loading state could be handled by the caller
        
        // Call API to login or create user
        const userData = await UserAPI.loginUser(loginData);
        
        if (userData) {
            // Update current user with all fields from MongoDB
            _currentUser = {
                ...userTemplate,
                id: userData._id,
                name: userData.name,
                password: userData.password || '',
                role: userData.role || 'user',
                avatar: userData.avatar,
                age: userData.age || null,
                gradeLevel: userData.gradeLevel || '',
                stars: userData.stars || 0,
                badges: userData.badges || 0,
                streak: userData.streak || 0,
                totalQuestionsAnswered: userData.totalQuestionsAnswered || 0,
                totalCorrectAnswers: userData.totalCorrectAnswers || 0,
                mathSkillLevels: userData.mathSkillLevels || userTemplate.mathSkillLevels,
                preferences: userData.preferences || userTemplate.preferences,
                gameHistory: userData.gameHistory || [],
                achievements: userData.achievements || []
            };
            
            // Save to localStorage
            saveUser(_currentUser);
            
            return _currentUser;
        }
    } catch (error) {
        console.error('Error in loginUser:', error);
        // Fallback to local user with provided data
        _currentUser = {
            ...userTemplate,
            name: loginData.name || 'Guest',
            password: loginData.password || '',
            role: loginData.role || 'user',
            avatar: loginData.avatar || userTemplate.avatar,
            age: loginData.age || null,
            gradeLevel: loginData.gradeLevel || ''
        };
        
        // Save fallback user
        saveUser(_currentUser);
    }
    
    return _currentUser;
}

// Update user profile in UI
function updateUserInterface() {
    // Update header
    updateUserHeader();
    
    // Update profile screen
    updateProfileScreen();
}

// Update user header with current user information
function updateUserHeader() {
    const userAvatarImg = document.querySelector('.home-screen .flex.items-center .w-10.h-10.rounded-full img');
    const userNameSpan = document.querySelector('.home-screen .flex.items-center span.text-gray-700');
    
    if (userAvatarImg) {
        userAvatarImg.src = _currentUser.avatar;
        userAvatarImg.alt = `${_currentUser.name}'s Avatar`;
    }
    
    if (userNameSpan) {
        userNameSpan.textContent = _currentUser.name;
    }
}

// Update profile screen with user information
function updateProfileScreen() {
    const profileAvatar = document.querySelector('.profile-screen .w-24.h-24.rounded-full img');
    const profileName = document.querySelector('.profile-screen h2.text-2xl.font-bold');
    const profileAge = document.querySelector('.profile-screen p.text-gray-600');
    
    // Update avatar
    if (profileAvatar) {
        profileAvatar.src = _currentUser.avatar;
        profileAvatar.alt = `${_currentUser.name}'s Avatar`;
    }
    
    // Update name
    if (profileName) {
        profileName.textContent = _currentUser.name;
    }
    
    // Update age if available
    if (profileAge && _currentUser.age) {
        profileAge.textContent = `Age: ${_currentUser.age}`;
    }
    
    // Update stats
    updateProfileStats();
}

// Update profile statistics
function updateProfileStats() {
    // Stars
    const starsElement = document.querySelector('.profile-screen .flex.space-x-4.mb-6 div:nth-child(1) p.text-2xl');
    if (starsElement) {
        starsElement.textContent = _currentUser.stars;
    }
    
    // Badges
    const badgesElement = document.querySelector('.profile-screen .flex.space-x-4.mb-6 div:nth-child(2) p.text-2xl');
    if (badgesElement) {
        badgesElement.textContent = _currentUser.badges;
    }
    
    // Streak
    const streakElement = document.querySelector('.profile-screen .flex.space-x-4.mb-6 div:nth-child(3) p.text-2xl');
    if (streakElement) {
        streakElement.textContent = _currentUser.streak;
    }
    
    // Update achievements if they exist
    updateAchievements();
}

// Update achievements section
function updateAchievements() {
    const achievementsContainer = document.querySelector('.profile-screen .grid.grid-cols-2.gap-4');
    
    if (achievementsContainer && _currentUser.achievements && _currentUser.achievements.length > 0) {
        // Clear existing achievements
        achievementsContainer.innerHTML = '';
        
        // Add each achievement
        _currentUser.achievements.forEach(achievement => {
            const achievementHTML = `
                <div class="flex items-center p-3 bg-yellow-50 rounded-xl">
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <i class="${achievement.iconName || 'ri-medal-fill'} ri-xl text-yellow-500"></i>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">${achievement.name}</p>
                        <p class="text-sm text-gray-600">${achievement.description}</p>
                    </div>
                </div>
            `;
            
            // Add to container
            achievementsContainer.innerHTML += achievementHTML;
        });
    }
}

// Record game completion
async function recordGameCompletion(gameData) {
    if (!_currentUser.id) {
        // Just update local stats if not connected to MongoDB
        _currentUser.stars += gameData.score || 0;
        _currentUser.totalQuestionsAnswered += gameData.questionsAnswered || 0;
        _currentUser.totalCorrectAnswers += gameData.correctAnswers || 0;
        
        // Save to localStorage
        saveUser(_currentUser);
        return;
    }
    
    try {
        // Add game to user history in MongoDB
        const updatedUser = await UserAPI.addGameToHistory(_currentUser.id, gameData);
        
        if (updatedUser) {
            // Update local user data
            _currentUser.stars = updatedUser.stars || _currentUser.stars;
            _currentUser.badges = updatedUser.badges || _currentUser.badges;
            _currentUser.streak = updatedUser.streak || _currentUser.streak;
            _currentUser.gameHistory = updatedUser.gameHistory || _currentUser.gameHistory;
            _currentUser.achievements = updatedUser.achievements || _currentUser.achievements;
            
            // Save to localStorage
            saveUser(_currentUser);
            
            // Update UI
            updateUserInterface();
        }
    } catch (error) {
        console.error('Error recording game completion:', error);
    }
}

// Start a new game session
async function startGameSession(gameType) {
    if (!_currentUser.id) {
        console.log('Starting local game session');
        return Promise.resolve();
    }
    
    try {
        // Create a new game session in MongoDB
        const game = await GameAPI.createGame({
            userId: _currentUser.id,
            gameType: gameType
        });
        
        // Store the game ID in a module-level variable
        currentGameId = game ? game._id : null;
        return game;
    } catch (error) {
        console.error('Error starting game session:', error);
        return Promise.reject(error);
    }
}

// Record a game answer
async function recordGameAnswer(answerData) {
    if (!_currentUser.id || !currentGameId) {
        // Just track locally if not connected to MongoDB
        return Promise.resolve();
    }
    
    try {
        // Update the game in MongoDB with the answer
        return await GameAPI.updateGame(currentGameId, {
            score: answerData.isCorrect ? 1 : 0,
            question: answerData
        });
    } catch (error) {
        console.error('Error recording game answer:', error);
        return Promise.reject(error);
    }
}

// Current game session ID
let currentGameId = null;

// Sign out user
function signOut() {
    // Reset current user to default template
    _currentUser = { ...userTemplate };
    
    // Remove user data from localStorage
    localStorage.removeItem('countcam_user');
    
    // Hide all screens
    const screens = [
        '.profile-screen',
        '.profile-update-screen',
        '.home-screen',
        '.game-screen',
        '.settings-screen',
        '.progress-tracker'
    ];
    
    screens.forEach(screen => {
        const element = document.querySelector(screen);
        if (element) element.style.display = 'none';
    });
    
    // Show login screen
    const loginScreen = document.querySelector('.login-screen');
    if (loginScreen) loginScreen.style.display = 'flex';
    
    // Clear any user-specific data from login screen
    clearLoginScreenUserData();
    
    return true;
}

// Clear user data from login screen
function clearLoginScreenUserData() {
    // Clear username input
    const usernameInput = document.getElementById('username');
    if (usernameInput) usernameInput.value = '';
    
    // Clear password input
    const passwordInput = document.getElementById('user-password');
    if (passwordInput) passwordInput.value = '';
    
    // Clear login form fields
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    if (loginUsername) loginUsername.value = '';
    if (loginPassword) loginPassword.value = '';
    
    // Clear any error messages
    const loginError = document.getElementById('login-error');
    const profileError = document.getElementById('profile-error');
    if (loginError) {
        loginError.classList.add('hidden');
        loginError.textContent = '';
    }
    if (profileError) {
        profileError.classList.add('hidden');
        profileError.textContent = '';
    }
    
    // Clear age input
    const ageInput = document.getElementById('user-age');
    if (ageInput) ageInput.value = '';
    
    // Reset grade level select
    const gradeLevelSelect = document.getElementById('grade-level');
    if (gradeLevelSelect) gradeLevelSelect.selectedIndex = 0;
    
    // Reset the first avatar as selected and deselect others
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach((option, index) => {
        if (index === 0) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Update user profile
async function updateUserProfile(profileData) {
    // Update local user data
    if (profileData.name) _currentUser.name = profileData.name;
    if (profileData.age) _currentUser.age = profileData.age;
    if (profileData.avatar) _currentUser.avatar = profileData.avatar;
    if (profileData.gradeLevel) _currentUser.gradeLevel = profileData.gradeLevel;
    if (profileData.preferences) _currentUser.preferences = {..._currentUser.preferences, ...profileData.preferences};
    
    // Save to localStorage
    saveUser(_currentUser);
    
    // Update UI
    updateUserInterface();
    
    // If connected to backend, update user in database
    if (_currentUser.id) {
        try {
            await UserAPI.updateUser(_currentUser.id, profileData);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }
    
    return _currentUser;
}

// Delete user account
async function deleteAccount() {
    // If connected to backend, delete user from database
    if (_currentUser.id) {
        try {
            // Call API to delete user
            await UserAPI.deleteUser(_currentUser.id);
        } catch (error) {
            console.error('Error deleting user account:', error);
            
            // For demo purposes, we'll continue with local deletion even if API fails
            // In a production app, you might want to handle this differently
            console.warn('API deletion failed, proceeding with local deletion only');
            
            // Don't return here, continue with local deletion
        }
    }
    
    // Reset current user to default template
    _currentUser = { ...userTemplate };
    
    // Remove user data from localStorage
    localStorage.removeItem('countcam_user');
    
    return Promise.resolve(true);
}

// Export user manager functions
window.UserManager = {
    getCurrentUser: () => _currentUser,
    initUser,
    loginUser,
    updateUserInterface,
    updateUserHeader,
    updateProfileScreen,
    updateProfileStats,
    updateAchievements,
    recordGameCompletion,
    startGameSession,
    recordGameAnswer,
    signOut,
    updateUserProfile,
    deleteAccount
};
