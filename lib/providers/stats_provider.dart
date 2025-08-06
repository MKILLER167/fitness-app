import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class StatsProvider extends ChangeNotifier {
  final SharedPreferences _prefs;
  
  // User stats
  int _totalXP = 0;
  int _level = 1;
  int _achievements = 0;
  int _workoutsCompleted = 0;
  int _tiersUnlocked = 0;
  
  // Daily stats
  int _dailyCalories = 0;
  int _dailyWater = 0;
  int _dailySteps = 0;
  
  // Targets
  int _calorieTarget = 2000;
  int _waterTarget = 8;
  int _stepsTarget = 10000;

  StatsProvider(this._prefs) {
    _loadStats();
  }

  // Getters
  int get totalXP => _totalXP;
  int get level => _level;
  int get achievements => _achievements;
  int get workoutsCompleted => _workoutsCompleted;
  int get tiersUnlocked => _tiersUnlocked;
  int get dailyCalories => _dailyCalories;
  int get dailyWater => _dailyWater;
  int get dailySteps => _dailySteps;
  int get calorieTarget => _calorieTarget;
  int get waterTarget => _waterTarget;
  int get stepsTarget => _stepsTarget;

  void _loadStats() {
    final statsJson = _prefs.getString('userStats');
    if (statsJson != null) {
      try {
        final stats = jsonDecode(statsJson);
        _totalXP = stats['totalXP'] ?? 0;
        _level = stats['level'] ?? 1;
        _achievements = stats['achievements'] ?? 0;
        _workoutsCompleted = stats['workoutsCompleted'] ?? 0;
        _tiersUnlocked = stats['tiersUnlocked'] ?? 0;
        _dailyCalories = stats['dailyCalories'] ?? 0;
        _dailyWater = stats['dailyWater'] ?? 0;
        _dailySteps = stats['dailySteps'] ?? 0;
        _calorieTarget = stats['calorieTarget'] ?? 2000;
        _waterTarget = stats['waterTarget'] ?? 8;
        _stepsTarget = stats['stepsTarget'] ?? 10000;
        notifyListeners();
      } catch (e) {
        debugPrint('Error loading stats: $e');
      }
    }
  }

  Future<void> _saveStats() async {
    final stats = {
      'totalXP': _totalXP,
      'level': _level,
      'achievements': _achievements,
      'workoutsCompleted': _workoutsCompleted,
      'tiersUnlocked': _tiersUnlocked,
      'dailyCalories': _dailyCalories,
      'dailyWater': _dailyWater,
      'dailySteps': _dailySteps,
      'calorieTarget': _calorieTarget,
      'waterTarget': _waterTarget,
      'stepsTarget': _stepsTarget,
    };
    await _prefs.setString('userStats', jsonEncode(stats));
  }

  Future<void> addXP(int xp, String reason) async {
    _totalXP += xp;
    
    // Level up logic
    final newLevel = (_totalXP / 100).floor() + 1;
    if (newLevel > _level) {
      _level = newLevel;
      // TODO: Show level up animation/notification
    }
    
    await _saveStats();
    notifyListeners();
  }

  Future<void> addCalories(int calories) async {
    _dailyCalories += calories;
    await _saveStats();
    notifyListeners();
  }

  Future<void> addWater([int glasses = 1]) async {
    _dailyWater += glasses;
    await addXP(5, 'Water intake');
    await _saveStats();
    notifyListeners();
  }

  Future<void> addSteps(int steps) async {
    _dailySteps += steps;
    await _saveStats();
    notifyListeners();
  }

  Future<void> completeWorkout() async {
    _workoutsCompleted++;
    await addXP(20, 'Workout completed');
    await _saveStats();
    notifyListeners();
  }

  Future<void> unlockTier() async {
    _tiersUnlocked++;
    await addXP(50, 'New tier unlocked');
    await _saveStats();
    notifyListeners();
  }

  Future<void> unlockAchievement() async {
    _achievements++;
    await addXP(30, 'Achievement unlocked');
    await _saveStats();
    notifyListeners();
  }

  Future<void> setTargets({
    int? calorieTarget,
    int? waterTarget,
    int? stepsTarget,
  }) async {
    _calorieTarget = calorieTarget ?? _calorieTarget;
    _waterTarget = waterTarget ?? _waterTarget;
    _stepsTarget = stepsTarget ?? _stepsTarget;
    await _saveStats();
    notifyListeners();
  }

  Future<void> resetDailyStats() async {
    _dailyCalories = 0;
    _dailyWater = 0;
    _dailySteps = 0;
    await _saveStats();
    notifyListeners();
  }

  Future<void> resetAllStats() async {
    _totalXP = 0;
    _level = 1;
    _achievements = 0;
    _workoutsCompleted = 0;
    _tiersUnlocked = 0;
    _dailyCalories = 0;
    _dailyWater = 0;
    _dailySteps = 0;
    await _prefs.remove('userStats');
    notifyListeners();
  }
}