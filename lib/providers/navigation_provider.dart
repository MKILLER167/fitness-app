import 'package:flutter/foundation.dart';

class NavigationProvider extends ChangeNotifier {
  int _currentIndex = 0;
  String _currentTab = 'home';

  int get currentIndex => _currentIndex;
  String get currentTab => _currentTab;

  void setCurrentIndex(int index) {
    _currentIndex = index;
    _currentTab = _getTabName(index);
    notifyListeners();
  }

  void setCurrentTab(String tab) {
    _currentTab = tab;
    _currentIndex = _getTabIndex(tab);
    notifyListeners();
  }

  String _getTabName(int index) {
    switch (index) {
      case 0:
        return 'home';
      case 1:
        return 'meals';
      case 2:
        return 'workouts';
      case 3:
        return 'stats';
      case 4:
        return 'profile';
      default:
        return 'home';
    }
  }

  int _getTabIndex(String tab) {
    switch (tab) {
      case 'home':
        return 0;
      case 'meals':
        return 1;
      case 'workouts':
        return 2;
      case 'stats':
        return 3;
      case 'profile':
        return 4;
      default:
        return 0;
    }
  }

  void navigateToMeals() => setCurrentIndex(1);
  void navigateToWorkouts() => setCurrentIndex(2);
  void navigateToStats() => setCurrentIndex(3);
  void navigateToProfile() => setCurrentIndex(4);
  void navigateToHome() => setCurrentIndex(0);
}