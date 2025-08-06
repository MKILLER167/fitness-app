import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppState {
  login,
  onboarding,
  subscription,
  app,
}

class AppStateProvider extends ChangeNotifier {
  final SharedPreferences _prefs;
  AppState _currentState = AppState.login;

  AppStateProvider(this._prefs) {
    _loadState();
  }

  AppState get currentState => _currentState;

  void _loadState() {
    // Check if user is logged in and onboarded
    final isLoggedIn = _prefs.getBool('isLoggedIn') ?? false;
    final isOnboarded = _prefs.getBool('isOnboarded') ?? false;
    
    if (!isLoggedIn) {
      _currentState = AppState.login;
    } else if (!isOnboarded) {
      _currentState = AppState.onboarding;
    } else {
      _currentState = AppState.app;
    }
    
    notifyListeners();
  }

  void setState(AppState newState) {
    _currentState = newState;
    notifyListeners();
  }

  void goToLogin() {
    _currentState = AppState.login;
    notifyListeners();
  }

  void goToOnboarding() {
    _currentState = AppState.onboarding;
    notifyListeners();
  }

  void goToSubscription() {
    _currentState = AppState.subscription;
    notifyListeners();
  }

  void goToApp() {
    _currentState = AppState.app;
    notifyListeners();
  }

  void reset() {
    _currentState = AppState.login;
    _prefs.remove('isLoggedIn');
    _prefs.remove('isOnboarded');
    notifyListeners();
  }
}