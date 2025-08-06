class AppConstants {
  // App Info
  static const String appName = 'FitTracker';
  static const String appVersion = '1.0.0';
  
  // Storage Keys
  static const String userKey = 'user';
  static const String userStatsKey = 'userStats';
  static const String languageKey = 'language';
  static const String themeKey = 'isDarkMode';
  static const String isLoggedInKey = 'isLoggedIn';
  static const String isOnboardedKey = 'isOnboarded';
  
  // API URLs (if needed)
  static const String baseUrl = 'https://api.fittracker.com';
  static const String nutritionApiUrl = '$baseUrl/nutrition';
  static const String exerciseApiUrl = '$baseUrl/exercises';
  
  // Subscription Tiers
  static const Map<String, dynamic> subscriptionFeatures = {
    'free': {
      'name': 'Free',
      'price': 0,
      'features': [
        'Basic tracking',
        'Limited exercises',
        'Basic nutrition',
      ],
    },
    'premium': {
      'name': 'Premium',
      'price': 9.99,
      'features': [
        'Advanced tracking',
        'All exercises',
        'Detailed nutrition',
        'Progress photos',
        'Barcode scanning',
      ],
    },
    'pro': {
      'name': 'Pro',
      'price': 19.99,
      'features': [
        'Everything in Premium',
        'Personal trainer AI',
        'Advanced analytics',
        'Custom meal plans',
        'Social challenges',
        'Priority support',
      ],
    },
  };
  
  // Default Values
  static const int defaultCalorieTarget = 2000;
  static const int defaultProteinTarget = 150;
  static const int defaultCarbsTarget = 200;
  static const int defaultFatTarget = 70;
  static const int defaultWaterTarget = 8;
  static const int defaultStepsTarget = 10000;
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 400);
  static const Duration longAnimation = Duration(milliseconds: 800);
  
  // UI Constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double defaultBorderRadius = 8.0;
  static const double cardBorderRadius = 12.0;
  static const double buttonBorderRadius = 8.0;
  
  // Exercise Categories
  static const List<String> exerciseCategories = [
    'Chest',
    'Back',
    'Shoulders',
    'Arms',
    'Legs',
    'Core',
    'Cardio',
    'Full Body',
  ];
  
  // Meal Types
  static const List<String> mealTypes = [
    'breakfast',
    'lunch',
    'dinner',
    'snack',
  ];
  
  // Activity Levels
  static const Map<String, dynamic> activityLevels = {
    'sedentary': {
      'name': 'Sedentary',
      'description': 'Little or no exercise',
      'multiplier': 1.2,
    },
    'light': {
      'name': 'Lightly Active',
      'description': 'Light exercise 1-3 days/week',
      'multiplier': 1.375,
    },
    'moderate': {
      'name': 'Moderately Active',
      'description': 'Moderate exercise 3-5 days/week',
      'multiplier': 1.55,
    },
    'active': {
      'name': 'Very Active',
      'description': 'Hard exercise 6-7 days/week',
      'multiplier': 1.725,
    },
    'extra': {
      'name': 'Extra Active',
      'description': 'Very hard exercise, physical job',
      'multiplier': 1.9,
    },
  };
  
  // Fitness Goals
  static const Map<String, dynamic> fitnessGoals = {
    'lose_weight': {
      'name': 'Lose Weight',
      'description': 'Reduce body weight',
      'calorieAdjustment': -500,
    },
    'maintain_weight': {
      'name': 'Maintain Weight',
      'description': 'Keep current weight',
      'calorieAdjustment': 0,
    },
    'gain_weight': {
      'name': 'Gain Weight',
      'description': 'Increase body weight',
      'calorieAdjustment': 500,
    },
    'build_muscle': {
      'name': 'Build Muscle',
      'description': 'Increase muscle mass',
      'calorieAdjustment': 300,
    },
  };
  
  // Achievement Tiers
  static const Map<String, dynamic> achievementTiers = {
    'bronze': {
      'name': 'Bronze',
      'color': 0xFFCD7F32,
      'icon': 'bronze_medal',
    },
    'silver': {
      'name': 'Silver',
      'color': 0xFFC0C0C0,
      'icon': 'silver_medal',
    },
    'gold': {
      'name': 'Gold',
      'color': 0xFFFFD700,
      'icon': 'gold_medal',
    },
    'platinum': {
      'name': 'Platinum',
      'color': 0xFFE5E4E2,
      'icon': 'platinum_medal',
    },
  };
}

// Enum definitions
enum AppState { login, onboarding, subscription, app }

enum SubscriptionTier { free, premium, pro }

enum AchievementTier { bronze, silver, gold, platinum }

enum MealType { breakfast, lunch, dinner, snack }

enum ExerciseType { strength, cardio, flexibility, sports }

enum ActivityLevel { sedentary, light, moderate, active, extra }

enum FitnessGoal { loseWeight, maintainWeight, gainWeight, buildMuscle }