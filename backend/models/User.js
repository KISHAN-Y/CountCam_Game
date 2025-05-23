const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number,
    min: 1,
    max: 18
  },
  gradeLevel: {
    type: String,
    enum: ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th', ''],
    default: ''
  },
  stars: { 
    type: Number, 
    default: 0 
  },
  badges: { 
    type: Number, 
    default: 0 
  },
  streak: { 
    type: Number, 
    default: 0 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  },
  totalQuestionsAnswered: {
    type: Number,
    default: 0
  },
  totalCorrectAnswers: {
    type: Number,
    default: 0
  },
  mathSkillLevels: {
    addition: { type: Number, default: 1, min: 1, max: 5 },
    subtraction: { type: Number, default: 1, min: 1, max: 5 },
    multiplication: { type: Number, default: 1, min: 1, max: 5 },
    division: { type: Number, default: 1, min: 1, max: 5 }
  },
  preferences: {
    soundEffects: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' }
  },
  gameHistory: [{
    gameType: {
      type: String,
      enum: ['practice', 'timeChallenge', 'parentChallenge'],
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    questionsAnswered: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    mathOperations: {
      type: [String],
      enum: ['addition', 'subtraction', 'multiplication', 'division']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  achievements: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    dateEarned: {
      type: Date,
      default: Date.now
    },
    iconName: {
      type: String,
      default: 'ri-medal-fill'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
