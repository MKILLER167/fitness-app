import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  final SharedPreferences _prefs;
  bool _isDarkMode = false;

  ThemeProvider(this._prefs) {
    _loadTheme();
  }

  bool get isDarkMode => _isDarkMode;

  void _loadTheme() {
    _isDarkMode = _prefs.getBool('isDarkMode') ?? false;
    notifyListeners();
  }

  Future<void> setDarkMode(bool isDark) async {
    if (isDark != _isDarkMode) {
      _isDarkMode = isDark;
      await _prefs.setBool('isDarkMode', isDark);
      notifyListeners();
    }
  }

  Future<void> toggleTheme() async {
    await setDarkMode(!_isDarkMode);
  }
}