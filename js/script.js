// Initialize user from UserManager
let currentUser = UserManager.initUser();

document.addEventListener('DOMContentLoaded', function () {
    // Use UserManager for user-related functions
    const updateUserHeader = UserManager.updateUserHeader;
    const updateProfileScreen = UserManager.updateProfileScreen;
    
    // Function to update home screen progress section with dynamic data
    function updateHomeProgress() {
        // Get current user data
        const currentUser = UserManager.getCurrentUser();
        
        // Update streak display
        const streakElement = document.querySelector('.home-screen .flex.justify-between .flex.items-center:nth-child(1) span.text-2xl');
        if (streakElement && currentUser) {
            streakElement.textContent = `${currentUser.streak} Days`;
        }
        
        // Update stars display
        const starsElement = document.querySelector('.home-screen .flex.justify-between .flex.items-center:nth-child(2) span.text-2xl');
        if (starsElement && currentUser) {
            starsElement.textContent = currentUser.stars.toString();
        }
        
        // Update badges display
        const badgesElement = document.querySelector('.home-screen .flex.justify-between .flex.items-center:nth-child(3) span.text-2xl');
        if (badgesElement && currentUser) {
            badgesElement.textContent = currentUser.badges.toString();
        }
    }

    // Function to update navigation
    function updateNavigation(activeButton) {
        const navButtons = ['nav-home-btn', 'nav-progress-btn', 'nav-profile-btn', 'nav-settings-btn'];
        navButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                if (btnId === activeButton) {
                    btn.classList.remove('text-gray-400');
                    btn.classList.add('text-primary');
                } else {
                    btn.classList.remove('text-primary');
                    btn.classList.add('text-gray-400');
                }
            }
        });
    }

    // Load Splash Screen
    fetch('screens/splash-screen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('splash-screen').innerHTML = html;
            setTimeout(function () {
                document.querySelector('.splash-screen').classList.add('fade-out');
                setTimeout(function () {
                    document.querySelector('.splash-screen').style.display = 'none';
                    document.querySelector('.onboarding-screen').style.display = 'flex';
                }, 1000);
            }, 2000);
        });

    // Load Onboarding Screen
    fetch('screens/onboarding-screen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('onboarding-screen').innerHTML = html;

            // Onboarding Navigation
            let currentSlide = 1;
            const totalSlides = 3;

            function updateSlide() {
                document.querySelectorAll('.onboarding-slide').forEach(slide => {
                    slide.classList.add('hidden');
                });
                document.querySelector(`.onboarding-slide[data-slide="${currentSlide}"]`).classList.remove('hidden');

                // Update dots
                document.querySelectorAll('.flex.space-x-2 span').forEach((dot, index) => {
                    if (index === currentSlide - 1) {
                        dot.classList.remove('bg-gray-300');
                        dot.classList.add('bg-primary');
                    } else {
                        dot.classList.remove('bg-primary');
                        dot.classList.add('bg-gray-300');
                    }
                });

                // Show/hide prev button
                const prevBtn = document.getElementById('prev-btn');
                if (currentSlide === 1) {
                    prevBtn.classList.add('hidden');
                } else {
                    prevBtn.classList.remove('hidden');
                }

                // Update next button text
                const nextBtn = document.getElementById('next-btn');
                if (currentSlide === totalSlides) {
                    nextBtn.textContent = 'Get Started';
                } else {
                    nextBtn.textContent = 'Next';
                }
            }

            const nextBtn = document.getElementById('next-btn');
            const prevBtn = document.getElementById('prev-btn');
            const skipBtn = document.getElementById('skip-btn');

            if (nextBtn) {
                nextBtn.addEventListener('click', function () {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateSlide();
                    } else {
                        // Last slide, go to login screen
                        document.querySelector('.onboarding-screen').style.display = 'none';
                        document.querySelector('.login-screen').style.display = 'flex';
                    }
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', function () {
                    if (currentSlide > 1) {
                        currentSlide--;
                        updateSlide();
                    }
                });
            }

            if (skipBtn) {
                skipBtn.addEventListener('click', function () {
                    document.querySelector('.onboarding-screen').style.display = 'none';
                    document.querySelector('.login-screen').style.display = 'flex';
                });
            }

            // Initialize the first slide
            updateSlide();
        });

    // Load Login Screen
    fetch('screens/login-screen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('login-screen').innerHTML = html;

            // Avatar Selection
            document.querySelectorAll('.avatar-option').forEach(option => {
                option.addEventListener('click', function () {
                    // Remove 'selected' class from all avatars
                    document.querySelectorAll('.avatar-option').forEach(opt => {
                        opt.classList.remove('selected');
                        // Also update the border styling
                        const img = opt.querySelector('img');
                        if (img) {
                            img.classList.remove('border-primary');
                            img.classList.add('border-transparent');
                        }
                    });
                    
                    // Add 'selected' class to clicked avatar
                    this.classList.add('selected');
                    
                    // Update the border styling for the selected avatar
                    const selectedImg = this.querySelector('img');
                    if (selectedImg) {
                        selectedImg.classList.remove('border-transparent');
                        selectedImg.classList.add('border-primary');
                    }
                });
            });

            // Kid Profile Button (Register new user)
            const kidProfileBtn = document.getElementById('kid-profile-btn');
            if (kidProfileBtn) {
                kidProfileBtn.addEventListener('click', function () {
                    // Hide the login buttons
                    const loginButtons = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
                    if (loginButtons) {
                        loginButtons.style.display = 'none';
                    }
                    
                    // Show the profile selection section
                    const profileSelection = document.getElementById('profile-selection');
                    if (profileSelection) {
                        profileSelection.classList.remove('hidden');
                    }
                });
            }
            
            // Kids Login Button (Existing users)
            const kidsLoginBtn = document.getElementById('kids-login-btn');
            if (kidsLoginBtn) {
                kidsLoginBtn.addEventListener('click', function () {
                    // Hide the login buttons
                    const loginButtons = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
                    if (loginButtons) {
                        loginButtons.style.display = 'none';
                    }
                    
                    // Show the login form
                    const loginForm = document.getElementById('kids-login-form');
                    if (loginForm) {
                        loginForm.classList.remove('hidden');
                    }
                });
            }
            
            // Back from Login Button
            const backFromLoginBtn = document.getElementById('back-from-login');
            if (backFromLoginBtn) {
                backFromLoginBtn.addEventListener('click', function() {
                    // Hide login form
                    const loginForm = document.getElementById('kids-login-form');
                    if (loginForm) {
                        loginForm.classList.add('hidden');
                    }
                    
                    // Show login buttons
                    const loginButtons = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
                    if (loginButtons) {
                        loginButtons.style.display = 'grid';
                    }
                    
                    // Clear any error messages
                    const loginError = document.getElementById('login-error');
                    if (loginError) {
                        loginError.classList.add('hidden');
                        loginError.textContent = '';
                    }
                    
                    // Clear form fields
                    const usernameInput = document.getElementById('login-username');
                    const passwordInput = document.getElementById('login-password');
                    if (usernameInput) usernameInput.value = '';
                    if (passwordInput) passwordInput.value = '';
                });
            }
            
            // Login Button
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.addEventListener('click', async function () {
                    // Get username and password from form
                    const usernameInput = document.getElementById('login-username');
                    const passwordInput = document.getElementById('login-password');
                    const loginError = document.getElementById('login-error');
                    
                    if (!usernameInput || !usernameInput.value.trim()) {
                        if (loginError) {
                            loginError.textContent = 'Please enter your name';
                            loginError.classList.remove('hidden');
                        }
                        return;
                    }
                    
                    if (!passwordInput || !passwordInput.value.trim()) {
                        if (loginError) {
                            loginError.textContent = 'Please enter your password';
                            loginError.classList.remove('hidden');
                        }
                        return;
                    }
                    
                    const username = usernameInput.value.trim();
                    const password = passwordInput.value.trim();
                    
                    // Show loading indicator
                    this.disabled = true;
                    const originalBtnContent = this.innerHTML;
                    this.innerHTML = '<span class="flex items-center justify-center"><i class="ri-loader-4-line animate-spin mr-2"></i>Logging in...</span>';
                    
                    try {
                        // Use UserManager to login with credentials
                        const loginResult = await UserManager.loginUser({
                            name: username,
                            password: password,
                            role: 'user' // Default role for kids login
                        });
                        
                        // Check if login was successful by verifying if a user ID was returned
                        if (!loginResult || !loginResult.id) {
                            throw new Error('Invalid credentials');
                        }
                        
                        // Get the updated current user
                        currentUser = UserManager.getCurrentUser();
                        
                        // Update UI
                        UserManager.updateUserInterface();
                        
                        // Go to home screen
                        document.querySelector('.login-screen').style.display = 'none';
                        document.querySelector('.home-screen').style.display = 'block';
                    } catch (error) {
                        console.error('Error logging in:', error);
                        if (loginError) {
                            loginError.textContent = 'Login failed. Please check your username and password.';
                            loginError.classList.remove('hidden');
                        }
                    } finally {
                        // Reset button
                        this.disabled = false;
                        this.innerHTML = originalBtnContent;
                    }
                });
            }
            
            // Back to Login Button
            const backToLoginBtn = document.getElementById('back-to-login');
            if (backToLoginBtn) {
                backToLoginBtn.addEventListener('click', function() {
                    // Hide profile selection
                    const profileSelection = document.getElementById('profile-selection');
                    if (profileSelection) {
                        profileSelection.classList.add('hidden');
                    }
                    
                    // Show login buttons
                    const loginButtons = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
                    if (loginButtons) {
                        loginButtons.style.display = 'grid';
                    }
                });
            }

            // Guest Button
            const guestBtn = document.getElementById('guest-btn');
            if (guestBtn) {
                guestBtn.addEventListener('click', async function () {
                    // Show loading indicator
                    this.disabled = true;
                    this.innerHTML = '<div class="w-10 h-10 flex items-center justify-center mr-3"><i class="ri-loader-4-line ri-lg animate-spin"></i></div><span class="text-lg font-medium">Loading...</span>';
                    
                    // Set default guest user data
                    const guestData = {
                        name: 'Guest',
                        avatar: 'https://readdy.ai/api/search-image?query=cute+cartoon+avatar+of+a+fox+character%2C+simple%2C+colorful%2C+child-friendly%2C+digital+art%2C+white+background&width=40&height=40&seq=9&orientation=squarish'
                    };
                    
                    try {
                        // Use UserManager to login as guest
                        await UserManager.loginUser(guestData);
                        
                        // Get the updated current user
                        currentUser = UserManager.getCurrentUser();
                        
                        // Update UI
                        UserManager.updateUserInterface();
                    } catch (error) {
                        console.error('Error logging in as guest:', error);
                    } finally {
                        // Reset button and go to home screen
                        this.disabled = false;
                        this.innerHTML = '<div class="w-10 h-10 flex items-center justify-center mr-3"><i class="ri-rocket-line ri-lg"></i></div><span class="text-lg font-medium">Play as Guest</span>';
                        document.querySelector('.login-screen').style.display = 'none';
                        document.querySelector('.home-screen').style.display = 'block';
                    }
                });
            }

            // Start Play Button
            const startPlayBtn = document.getElementById('start-play-btn');
            if (startPlayBtn) {
                startPlayBtn.addEventListener('click', async function () {
                    // Show loading indicator
                    this.disabled = true;
                    this.innerHTML = '<span class="text-lg font-medium">Loading...</span>';
                    
                    // Validate required fields
                    const usernameInput = document.getElementById('username');
                    if (!usernameInput || !usernameInput.value.trim()) {
                        alert('Please enter your name');
                        this.disabled = false;
                        this.innerHTML = 'Start Playing';
                        return;
                    }
                    
                    // Get selected avatar
                    const selectedAvatar = document.querySelector('.avatar-option.selected img');
                    const avatarSrc = selectedAvatar ? selectedAvatar.src : currentUser.avatar;
                    
                    // Get username
                    const username = usernameInput.value.trim();
                    
                    // Get age
                    const ageInput = document.getElementById('user-age');
                    const age = ageInput && ageInput.value ? parseInt(ageInput.value) : null;
                    
                    // Get grade level
                    const gradeLevelSelect = document.getElementById('grade-level');
                    const gradeLevel = gradeLevelSelect ? gradeLevelSelect.value : '';
                    
                    // Get password
                    const passwordInput = document.getElementById('user-password');
                    if (!passwordInput || !passwordInput.value.trim()) {
                        alert('Please enter a password');
                        this.disabled = false;
                        this.innerHTML = 'Start Playing';
                        return;
                    }
                    const password = passwordInput.value.trim();
                    
                    try {
                        // Show original button content with loading indicator
                        const originalBtnContent = '<span class="flex items-center justify-center"><i class="ri-gamepad-line mr-2"></i>Start Playing</span>';
                        this.innerHTML = '<span class="flex items-center justify-center"><i class="ri-loader-4-line animate-spin mr-2"></i>Registering...</span>';
                        
                        // Use UserManager to login with all collected information
                        const registerResult = await UserManager.loginUser({
                            name: username,
                            password: password,
                            role: 'user', // Default role for new users
                            avatar: avatarSrc,
                            age: age,
                            gradeLevel: gradeLevel,
                            preferences: {
                                soundEffects: true,
                                notifications: true,
                                difficultyLevel: 'easy'
                            }
                        });
                        
                        // Check if registration was successful
                        if (!registerResult || !registerResult.id) {
                            const profileError = document.getElementById('profile-error');
                            if (profileError) {
                                profileError.textContent = 'Registration failed. Username may already exist.';
                                profileError.classList.remove('hidden');
                            }
                            throw new Error('Registration failed');
                        }
                        
                        // Get the updated current user
                        currentUser = UserManager.getCurrentUser();
                        
                        // Update UI
                        UserManager.updateUserInterface();
                        
                        // Go to home screen
                        document.querySelector('.login-screen').style.display = 'none';
                        document.querySelector('.home-screen').style.display = 'block';
                    } catch (error) {
                        console.error('Error registering:', error);
                        // Show error message
                        const profileError = document.getElementById('profile-error');
                        if (profileError) {
                            profileError.textContent = 'Registration failed. Please try again.';
                            profileError.classList.remove('hidden');
                        }
                    } finally {
                        // Reset button to original state
                        this.disabled = false;
                        this.innerHTML = '<span class="flex items-center justify-center"><i class="ri-gamepad-line mr-2"></i>Start Playing</span>';
                    }
                });
            }
        });

    // Load Home Screen
    fetch('screens/home-screen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('home-screen').innerHTML = html;
            
            // Update user header with current user information
            updateUserHeader();
            
            // Update progress section with dynamic data
            updateHomeProgress();
            
            // Make user avatar and name clickable to open profile
            const userProfileSection = document.querySelector('.home-screen .flex.items-center');
            if (userProfileSection) {
                userProfileSection.style.cursor = 'pointer';
                userProfileSection.addEventListener('click', function() {
                    // Update profile screen with current user information
                    updateProfileScreen();
                    
                    // Show profile screen and hide home screen
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.profile-screen').style.display = 'block';
                    updateNavigation('nav-profile-btn');
                });
            }

            // Play Now Button
            const playNowBtn = document.getElementById('play-now-btn');
            if (playNowBtn) {
                playNowBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.game-screen').style.display = 'block';
                });
            }

            // Start Practice Mode Button
            const startPracticeBtn = document.getElementById('start-practice-btn');
            if (startPracticeBtn) {
                startPracticeBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.game-screen').style.display = 'block';
                    const gameModeTitle = document.getElementById('game-mode-title');
                    gameModeTitle.textContent = 'Practice Mode';
                    const gameModeIcon = gameModeTitle.previousElementSibling.querySelector('i');
                    gameModeIcon.className = 'ri-book-open-line text-green-500';
                    const timerSection = document.querySelector('.flex.justify-between.items-center.mb-2');
                    timerSection.innerHTML = `
                        <div class="flex items-center">
                            <div class="w-6 h-6 flex items-center justify-center mr-2">
                                <i class="ri-questionnaire-line text-green-500"></i>
                            </div>
                            <span id="question-progress" class="text-2xl font-bold text-green-500">1/10</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-6 h-6 flex items-center justify-center mr-2">
                                <i class="ri-star-fill text-yellow-500"></i>
                            </div>
                            <span id="score-display" class="text-2xl font-bold text-gray-800">0</span>
                        </div>
                    `;
                    const progressBar = document.querySelector('.progress-fill');
                    progressBar.className = 'progress-fill bg-green-500';
                    progressBar.style.width = '10%';
                    let currentQuestion = 1;
                    let totalQuestions = 10;
                    let score = 0;
                    const practiceQuestions = [
                        { question: '2 + 2 = ?', answer: 4 },
                        { question: '5 - 3 = ?', answer: 2 },
                        { question: '3 × 3 = ?', answer: 9 },
                        { question: '8 ÷ 2 = ?', answer: 4 },
                        { question: '6 + 4 = ?', answer: 10 },
                        { question: '10 - 5 = ?', answer: 5 },
                        { question: '2 × 4 = ?', answer: 8 },
                        { question: '9 ÷ 3 = ?', answer: 3 },
                        { question: '7 + 3 = ?', answer: 10 },
                        { question: '8 - 2 = ?', answer: 6 }
                    ];

                    function displayPracticeQuestion() {
                        if (currentQuestion <= totalQuestions) {
                            const questionData = practiceQuestions[currentQuestion - 1];
                            document.querySelector('.bg-white.rounded-2xl h2').textContent = questionData.question;
                            document.getElementById('question-progress').textContent = `${currentQuestion}/${totalQuestions}`;
                            document.querySelector('.progress-fill').style.width = `${(currentQuestion / totalQuestions) * 100}%`;
                            return questionData.answer;
                        } else {
                            // Game completed - use UserManager to record completion
                            UserManager.recordGameCompletion({
                                gameType: 'practice',
                                score: score,
                                questionsAnswered: totalQuestions,
                                correctAnswers: score,
                                mathOperations: ['addition', 'subtraction'] // Add appropriate operations based on questions
                            }).catch(err => console.error('Error recording game completion:', err));
                            
                            // Show celebration screen
                            document.querySelector('.game-screen').style.display = 'none';
                            document.querySelector('.celebration-screen').style.display = 'block';
                            createConfetti();
                        }
                    }

                    // Initialize game session using UserManager
                    UserManager.startGameSession('practice')
                        .then(() => {
                            console.log('Game session started');
                        })
                        .catch(err => console.error('Error starting game session:', err));
                    
                    function checkPracticeAnswer(userAnswer, correctAnswer) {
                        const isCorrect = userAnswer === correctAnswer;
                        if (isCorrect) {
                            score++;
                            document.getElementById('score-display').textContent = score;
                        }
                        
                        // Use UserManager to record the answer
                        UserManager.recordGameAnswer({
                            question: practiceQuestions[currentQuestion - 1].question,
                            userAnswer: userAnswer,
                            correctAnswer: correctAnswer,
                            isCorrect: isCorrect
                        }).catch(err => console.error('Error recording answer:', err));
                        
                        currentQuestion++;
                        return displayPracticeQuestion();
                    }
                    displayPracticeQuestion();
                });
            }

            // Start Time Challenge Button
            const startChallengeBtn = document.getElementById('start-challenge-btn');
            if (startChallengeBtn) {
                startChallengeBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.game-screen').style.display = 'block';
                    const gameModeTitle = document.getElementById('game-mode-title');
                    gameModeTitle.textContent = 'Time Challenge';
                    const gameModeIcon = gameModeTitle.previousElementSibling.querySelector('i');
                    gameModeIcon.className = 'ri-timer-line text-orange-500';
                    const timerSection = document.querySelector('.flex.justify-between.items-center.mb-2');
                    timerSection.innerHTML = `
                        <div class="flex items-center">
                            <div class="w-6 h-6 flex items-center justify-center mr-2">
                                <i class="ri-timer-line text-orange-500"></i>
                            </div>
                            <span id="timer-display" class="text-2xl font-bold text-orange-500">60</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-6 h-6 flex items-center justify-center mr-2">
                                <i class="ri-star-fill text-yellow-500"></i>
                            </div>
                            <span id="score-display" class="text-2xl font-bold text-gray-800">0</span>
                        </div>
                    `;
                    const progressBar = document.querySelector('.progress-fill');
                    progressBar.className = 'progress-fill bg-orange-500';
                    progressBar.style.width = '100%';
                    let timeLeft = 60;
                    let score = 0;
                    const timeQuestions = [
                        { question: '3 + 5 = ?', answer: 8 },
                        { question: '9 - 4 = ?', answer: 5 },
                        { question: '2 × 6 = ?', answer: 12 },
                        { question: '10 ÷ 2 = ?', answer: 5 },
                        { question: '7 + 8 = ?', answer: 15 },
                        { question: '12 - 7 = ?', answer: 5 },
                        { question: '4 × 3 = ?', answer: 12 },
                        { question: '15 ÷ 3 = ?', answer: 5 },
                        { question: '6 + 9 = ?', answer: 15 },
                        { question: '11 - 6 = ?', answer: 5 }
                    ];
                    let currentQuestionIndex = 0;

                    function displayTimeQuestion() {
                        const questionData = timeQuestions[currentQuestionIndex % timeQuestions.length];
                        document.querySelector('.bg-white.rounded-2xl h2').textContent = questionData.question;
                        return questionData.answer;
                    }

                    function checkTimeAnswer(userAnswer, correctAnswer) {
                        if (userAnswer === correctAnswer) {
                            score++;
                            document.getElementById('score-display').textContent = score;
                        }
                        currentQuestionIndex++;
                        return displayTimeQuestion();
                    }

                    // Initialize timers array if it doesn't exist
                    window.timers = window.timers || [];
                    
                    // Create and store the timer interval
                    const timerInterval = setInterval(function() {
                        timeLeft--;
                        document.getElementById('timer-display').textContent = timeLeft;
                        document.querySelector('.progress-fill').style.width = `${(timeLeft / 60) * 100}%`;
                        
                        if (timeLeft <= 0) {
                            clearInterval(timerInterval);
                            // Remove this timer from the timers array
                            const index = window.timers.indexOf(timerInterval);
                            if (index > -1) {
                                window.timers.splice(index, 1);
                            }
                            document.querySelector('.game-screen').style.display = 'none';
                            document.querySelector('.celebration-screen').style.display = 'block';
                            createConfetti();
                        }
                    }, 1000);
                    
                    // Add this timer to the timers array
                    window.timers.push(timerInterval);

                    displayTimeQuestion();
                });
            }

            // Start Parent Challenge Button
            const startParentChallengeBtn = document.getElementById('start-parent-challenge-btn');
            if (startParentChallengeBtn) {
                startParentChallengeBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.game-screen').style.display = 'block';
                    const gameModeTitle = document.getElementById('game-mode-title');
                    gameModeTitle.textContent = 'Parent Challenge';
                    const gameModeIcon = gameModeTitle.previousElementSibling.querySelector('i');
                    gameModeIcon.className = 'ri-parent-line text-purple-500';
                    const timerSection = document.querySelector('.flex.justify-between.items-center.mb-2');
                    timerSection.innerHTML = `
                        <div class="flex items-center">
                            <div class="w-6 h-6 flex items-center justify-center mr-2">
                                <i class="ri-questionnaire-line text-purple-500"></i>
                            </div>
                            <span id="question-progress" class="text-2xl font-bold text-purple-500">1/10</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-6 h-6 flex items-center justify-center mr-2">
                                <i class="ri-star-fill text-yellow-500"></i>
                            </div>
                            <span id="score-display" class="text-2xl font-bold text-gray-800">0</span>
                        </div>
                    `;
                    const progressBar = document.querySelector('.progress-fill');
                    progressBar.className = 'progress-fill bg-purple-500';
                    progressBar.style.width = '10%';
                    let currentQuestion = 1;
                    let totalQuestions = 10;
                    let score = 0;
                    const parentQuestions = [
                        { question: '7 + 3 = ?', answer: 10 },
                        { question: '15 - 6 = ?', answer: 9 },
                        { question: '4 × 2 = ?', answer: 8 },
                        { question: '12 ÷ 3 = ?', answer: 4 },
                        { question: '9 + 5 = ?', answer: 14 },
                        { question: '20 - 8 = ?', answer: 12 },
                        { question: '3 × 3 = ?', answer: 9 },
                        { question: '16 ÷ 4 = ?', answer: 4 },
                        { question: '11 + 7 = ?', answer: 18 },
                        { question: '25 - 9 = ?', answer: 16 }
                    ];

                    function displayParentQuestion() {
                        if (currentQuestion <= totalQuestions) {
                            const questionData = parentQuestions[currentQuestion - 1];
                            document.querySelector('.bg-white.rounded-2xl h2').textContent = questionData.question;
                            document.getElementById('question-progress').textContent = `${currentQuestion}/${totalQuestions}`;
                            document.querySelector('.progress-fill').style.width = `${(currentQuestion / totalQuestions) * 100}%`;
                            return questionData.answer;
                        } else {
                            document.querySelector('.game-screen').style.display = 'none';
                            document.querySelector('.celebration-screen').style.display = 'block';
                            createConfetti();
                        }
                    }

                    function checkParentAnswer(userAnswer, correctAnswer) {
                        if (userAnswer === correctAnswer) {
                            score++;
                            document.getElementById('score-display').textContent = score;
                        }
                        currentQuestion++;
                        return displayParentQuestion();
                    }
                    displayParentQuestion();
                });
            }

            // Note: Back to Home Button is now handled in the game screen fetch block

            // View Progress Button
            const viewProgressBtn = document.getElementById('view-progress-btn');
            if (viewProgressBtn) {
                viewProgressBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.progress-tracker').style.display = 'block';
                });
            }

            // Navigation Buttons
            const navHomeBtn = document.getElementById('nav-home-btn');
            const navProgressBtn = document.getElementById('nav-progress-btn');
            const navProfileBtn = document.getElementById('nav-profile-btn');
            const navSettingsBtn = document.getElementById('nav-settings-btn');

            if (navHomeBtn) {
                navHomeBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'block';
                    document.querySelector('.progress-tracker').style.display = 'none';
                    document.querySelector('.profile-screen').style.display = 'none';
                    document.querySelector('.settings-screen').style.display = 'none';
                    updateNavigation('nav-home-btn');
                });
            }

            if (navProgressBtn) {
                navProgressBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.progress-tracker').style.display = 'block';
                    document.querySelector('.profile-screen').style.display = 'none';
                    document.querySelector('.settings-screen').style.display = 'none';
                    updateNavigation('nav-progress-btn');
                });
            }

            if (navProfileBtn) {
                navProfileBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.progress-tracker').style.display = 'none';
                    document.querySelector('.profile-screen').style.display = 'block';
                    document.querySelector('.settings-screen').style.display = 'none';
                    updateNavigation('nav-profile-btn');
                });
            }

            if (navSettingsBtn) {
                navSettingsBtn.addEventListener('click', function () {
                    document.querySelector('.home-screen').style.display = 'none';
                    document.querySelector('.progress-tracker').style.display = 'none';
                    document.querySelector('.profile-screen').style.display = 'none';
                    document.querySelector('.settings-screen').style.display = 'block';
                    updateNavigation('nav-settings-btn');
                });
            }
        });

    // Load Profile Screen
    fetch('screens/profile-screen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('profile-screen').innerHTML = html;

            // Back to Home from Profile
            const backToHomeFromProfileBtn = document.getElementById('back-to-home-from-profile');
            if (backToHomeFromProfileBtn) {
                backToHomeFromProfileBtn.addEventListener('click', function () {
                    document.querySelector('.profile-screen').style.display = 'none';
                    document.querySelector('.home-screen').style.display = 'block';
                });
            }
            
            // Sign Out Button in Profile Screen
            const signOutBtn = document.getElementById('sign-out-btn');
            if (signOutBtn) {
                signOutBtn.addEventListener('click', function() {
                    // Use UserManager to sign out
                    if (UserManager.signOut()) {
                        // Hide all screens
                        document.querySelector('.profile-screen').style.display = 'none';
                        document.querySelector('.login-screen').style.display = 'flex';
                        
                        // If user was registered (not a guest), show the kids login form
                        const currentUser = UserManager.getCurrentUser();
                        if (currentUser.name !== 'Guest') {
                            // Display login buttons grid
                            const loginButtons = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
                            if (loginButtons) {
                                loginButtons.style.display = 'grid';
                            }
                            
                            // Hide profile selection if visible
                            const profileSelection = document.getElementById('profile-selection');
                            if (profileSelection) {
                                profileSelection.classList.add('hidden');
                            }
                        }
                    }
                });
            }
            
            // Sign Out Button
            const editProfileAvatarBtn = document.getElementById('edit-profile-avatar');
            if (editProfileAvatarBtn) {
                editProfileAvatarBtn.addEventListener('click', function() {
                    // Hide profile screen and show profile update screen
                    document.querySelector('.profile-screen').style.display = 'none';
                    document.querySelector('.profile-update-screen').style.display = 'block';
                    
                    // Populate the update form with current user data
                    const currentUser = UserManager.getCurrentUser();
                    document.getElementById('update-name').value = currentUser.name || '';
                    document.getElementById('update-age').value = currentUser.age || '';
                    document.getElementById('update-grade').value = currentUser.gradeLevel || '';
                    document.getElementById('profile-update-avatar').src = currentUser.avatar;
                });
            }
            
            // Make profile name and age clickable to open profile update screen
            const profileName = document.querySelector('.profile-screen h2.text-2xl.font-bold');
            const profileAge = document.querySelector('.profile-screen p.text-gray-600');
            
            const openProfileUpdateScreen = function() {
                document.querySelector('.profile-screen').style.display = 'none';
                document.querySelector('.profile-update-screen').style.display = 'block';
                
                // Populate the update form with current user data
                const currentUser = UserManager.getCurrentUser();
                document.getElementById('update-name').value = currentUser.name || '';
                document.getElementById('update-age').value = currentUser.age || '';
                document.getElementById('update-grade').value = currentUser.gradeLevel || '';
                document.getElementById('profile-update-avatar').src = currentUser.avatar;
            };
            
            if (profileName) {
                profileName.style.cursor = 'pointer';
                profileName.title = 'Click to edit your profile';
                profileName.addEventListener('click', openProfileUpdateScreen);
            }
            
            if (profileAge) {
                profileAge.style.cursor = 'pointer';
                profileAge.title = 'Click to edit your profile';
                profileAge.addEventListener('click', openProfileUpdateScreen);
            }
        });
        
    // Load Profile Update Screen
    fetch('screens/profile-update-screen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('profile-update-screen').innerHTML = html;
            
            // Back to Profile from Update Screen
            const backToProfileBtn = document.getElementById('back-to-profile-from-update');
            if (backToProfileBtn) {
                backToProfileBtn.addEventListener('click', function() {
                    document.querySelector('.profile-update-screen').style.display = 'none';
                    document.querySelector('.profile-screen').style.display = 'block';
                });
            }
            
            // Choose Avatar Button
            const chooseAvatarBtn = document.getElementById('choose-avatar-btn');
            if (chooseAvatarBtn) {
                chooseAvatarBtn.addEventListener('click', function() {
                    // In a real app, this would be a modal with avatar selection
                    // For now, we'll use a simple prompt
                    const newAvatarUrl = prompt('Enter new avatar URL:', UserManager.getCurrentUser().avatar);
                    
                    if (newAvatarUrl && newAvatarUrl.trim() !== '') {
                        // Update the avatar preview in the form
                        document.getElementById('profile-update-avatar').src = newAvatarUrl.trim();
                    }
                });
            }
            
            // Save Profile Button
            const saveProfileBtn = document.getElementById('save-profile-btn');
            if (saveProfileBtn) {
                saveProfileBtn.addEventListener('click', function() {
                    // Get form values
                    const name = document.getElementById('update-name').value.trim();
                    const age = document.getElementById('update-age').value.trim();
                    const grade = document.getElementById('update-grade').value;
                    const avatar = document.getElementById('profile-update-avatar').src;
                    
                    // Validate form
                    if (!name) {
                        alert('Please enter your name');
                        return;
                    }
                    
                    // Prepare profile data
                    const profileData = {
                        name: name,
                        avatar: avatar
                    };
                    
                    // Always include age in the update, even if it's null
                    // This ensures the field is updated in the database
                    if (age && age.trim() !== '') {
                        const ageNumber = parseInt(age);
                        if (!isNaN(ageNumber) && ageNumber > 0 && ageNumber <= 18) {
                            profileData.age = ageNumber;
                        } else {
                            alert('Age must be a number between 1 and 18');
                            return;
                        }
                    } else {
                        // If age field is empty, explicitly set to null
                        profileData.age = null;
                    }
                    
                    // Always include gradeLevel in the update, even if it's empty
                    // This ensures the field is updated in the database
                    profileData.gradeLevel = grade || '';
                    
                    // Update user profile
                    UserManager.updateUserProfile(profileData)
                        .then(() => {
                            console.log('Profile updated successfully');
                            // Go back to profile screen
                            document.querySelector('.profile-update-screen').style.display = 'none';
                            document.querySelector('.profile-screen').style.display = 'block';
                        })
                        .catch(err => {
                            console.error('Error updating profile:', err);
                            alert('Error updating profile. Please try again.');
                        });
                });
            }
        });

    // Load Game Screen
    fetch('screens/game-screen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('game-screen').innerHTML = html;
            
            // Back to Home Button
            const backToHomeBtn = document.getElementById('back-to-home');
            if (backToHomeBtn) {
                backToHomeBtn.addEventListener('click', function () {
                    document.querySelector('.game-screen').style.display = 'none';
                    document.querySelector('.home-screen').style.display = 'block';
                    
                    // Clear any timers that might be running
                    const timers = window.timers || [];
                    timers.forEach(timer => clearInterval(timer));
                    window.timers = [];
                });
            }
        });

    // Load Settings Screen
    fetch('screens/settings-screen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('settings-screen').innerHTML = html;

            // Back to Home from Settings
            const backToHomeFromSettingsBtn = document.getElementById('back-to-home-from-settings');
            if (backToHomeFromSettingsBtn) {
                backToHomeFromSettingsBtn.addEventListener('click', function () {
                    document.querySelector('.settings-screen').style.display = 'none';
                    document.querySelector('.home-screen').style.display = 'block';
                    updateNavigation('nav-home-btn');
                });
            }
            
            // Edit Profile Button
            const editProfileBtn = document.getElementById('settings-edit-profile-btn');
            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', function() {
                    // Hide settings screen and show profile update screen
                    document.querySelector('.settings-screen').style.display = 'none';
                    document.querySelector('.profile-update-screen').style.display = 'block';
                    
                    // Populate the update form with current user data
                    const currentUser = UserManager.getCurrentUser();
                    document.getElementById('update-name').value = currentUser.name || '';
                    document.getElementById('update-age').value = currentUser.age || '';
                    document.getElementById('update-grade').value = currentUser.gradeLevel || '';
                    document.getElementById('profile-update-avatar').src = currentUser.avatar;
                });
            }
            
            // Delete Account Button
            const deleteAccountBtn = document.getElementById('settings-delete-account-btn');
            if (deleteAccountBtn) {
                deleteAccountBtn.addEventListener('click', function() {
                    // Show confirmation dialog
                    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
                    
                    if (confirmed) {
                        // Use UserManager to delete account
                        UserManager.deleteAccount()
                            .then(() => {
                                console.log('Account deleted successfully');
                                // Account is deleted, sign out
                                UserManager.signOut();
                            })
                            .catch(err => {
                                console.error('Error deleting account:', err);
                                alert('Error deleting account. Please try again.');
                            });
                    }
                });
            }
            
            // Sign Out Button
            const signOutBtn = document.getElementById('settings-sign-out-btn');
            if (signOutBtn) {
                signOutBtn.addEventListener('click', function() {
                    // Use UserManager to sign out
                    if (UserManager.signOut()) {
                        // Hide all screens
                        document.querySelector('.settings-screen').style.display = 'none';
                        document.querySelector('.login-screen').style.display = 'flex';
                        
                        // If user was registered (not a guest), show the kids login form
                        // This ensures after sign out, they are redirected to the kids login
                        const currentUser = UserManager.getCurrentUser();
                        if (currentUser.name !== 'Guest') {
                            // Display login buttons grid
                            const loginButtons = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
                            if (loginButtons) {
                                loginButtons.style.display = 'grid';
                            }
                            
                            // Hide profile selection if visible
                            const profileSelection = document.getElementById('profile-selection');
                            if (profileSelection) {
                                profileSelection.classList.add('hidden');
                            }
                        }
                    }
                });
            }
        });

    // Load Progress Tracker Screen
    fetch('screens/progress-tracker.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('progress-tracker').innerHTML = html;

            // Back to Home from Progress
            const backToHomeFromProgressBtn = document.getElementById('back-to-home-from-progress');
            if (backToHomeFromProgressBtn) {
                backToHomeFromProgressBtn.addEventListener('click', function () {
                    document.querySelector('.progress-tracker').style.display = 'none';
                    document.querySelector('.home-screen').style.display = 'block';
                });
            }
        });

    // Simulate game completion after 5 seconds
    setTimeout(function () {
        const gameScreen = document.querySelector('.game-screen');
        const celebrationScreen = document.querySelector('.celebration-screen');
        if (gameScreen && celebrationScreen) {
            gameScreen.style.display = 'none';
            celebrationScreen.style.display = 'block';
            createConfetti();
        }
    }, 5000);
});
