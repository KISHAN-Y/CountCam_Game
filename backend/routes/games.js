const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');

// Create a new game session
router.post('/games', async (req, res) => {
  try {
    const game = new Game({
      userId: req.body.userId,
      gameType: req.body.gameType,
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      timeSpent: 0,
      completed: false,
      questions: []
    });
    
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all games for a user
router.get('/users/:userId/games', async (req, res) => {
  try {
    const games = await Game.find({ userId: req.params.userId });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific game
router.get('/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a game (add question, update score, etc.)
router.patch('/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    
    // Update game properties
    if (req.body.score !== undefined) game.score = req.body.score;
    if (req.body.questionsAnswered !== undefined) game.questionsAnswered = req.body.questionsAnswered;
    if (req.body.correctAnswers !== undefined) game.correctAnswers = req.body.correctAnswers;
    if (req.body.timeSpent !== undefined) game.timeSpent = req.body.timeSpent;
    if (req.body.completed !== undefined) game.completed = req.body.completed;
    
    // Add a new question if provided
    if (req.body.question) {
      game.questions.push({
        question: req.body.question.question,
        userAnswer: req.body.question.userAnswer,
        correctAnswer: req.body.question.correctAnswer,
        isCorrect: req.body.question.userAnswer === req.body.question.correctAnswer,
        timeToAnswer: req.body.question.timeToAnswer || 0
      });
    }
    
    const updatedGame = await game.save();
    
    // If game is completed, update user stats
    if (req.body.completed === true && game.completed === false) {
      const user = await User.findById(game.userId);
      if (user) {
        // Add game to user history
        user.gameHistory.push({
          gameType: game.gameType,
          score: game.score,
          date: new Date()
        });
        
        // Update stars
        user.stars += game.score;
        
        // Update badges logic (simplified)
        if (user.gameHistory.length % 5 === 0) {
          user.badges += 1;
        }
        
        await user.save();
      }
    }
    
    res.json(updatedGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user statistics
router.get('/users/:userId/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const games = await Game.find({ userId: req.params.userId, completed: true });
    
    // Calculate statistics
    const stats = {
      totalGames: games.length,
      practiceGames: games.filter(g => g.gameType === 'practice').length,
      timeChallengeGames: games.filter(g => g.gameType === 'timeChallenge').length,
      parentChallengeGames: games.filter(g => g.gameType === 'parentChallenge').length,
      totalScore: games.reduce((sum, game) => sum + game.score, 0),
      averageScore: games.length > 0 ? games.reduce((sum, game) => sum + game.score, 0) / games.length : 0,
      totalQuestionsAnswered: games.reduce((sum, game) => sum + game.questionsAnswered, 0),
      totalCorrectAnswers: games.reduce((sum, game) => sum + game.correctAnswers, 0),
      accuracy: games.reduce((sum, game) => sum + game.questionsAnswered, 0) > 0 
        ? (games.reduce((sum, game) => sum + game.correctAnswers, 0) / games.reduce((sum, game) => sum + game.questionsAnswered, 0)) * 100 
        : 0,
      streak: user.streak,
      stars: user.stars,
      badges: user.badges
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
