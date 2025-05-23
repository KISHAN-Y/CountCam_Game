const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    enum: ['practice', 'timeChallenge', 'parentChallenge'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,  // in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  questions: [{
    question: String,
    userAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean,
    timeToAnswer: Number  // in seconds
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
