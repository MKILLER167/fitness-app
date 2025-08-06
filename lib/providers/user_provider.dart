import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

enum SubscriptionTier { free, premium, pro }

class UserProfile {
  final String name;
  final String email;
  final int age;
  final String gender;
  final double height;
  final double weight;
  final String activityLevel;
  final String goal;
  final int calorieTarget;
  final int proteinTarget;
  final int carbsTarget;
  final int fatTarget;

  UserProfile({
    required this.name,
    required this.email,
    required this.age,
    required this.gender,
    required this.height,
    required this.weight,
    required this.activityLevel,
    required this.goal,
    required this.calorieTarget,
    required this.proteinTarget,
    required this.carbsTarget,
    required this.fatTarget,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'age': age,
      'gender': gender,
      'height': height,
      'weight': weight,
      'activityLevel': activityLevel,
      'goal': goal,
      'calorieTarget': calorieTarget,
      'proteinTarget': proteinTarget,
      'carbsTarget': carbsTarget,
      'fatTarget': fatTarget,
    };
  }

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      age: json['age'] ?? 0,
      gender: json['gender'] ?? '',
      height: json['height']?.toDouble() ?? 0.0,
      weight: json['weight']?.toDouble() ?? 0.0,
      activityLevel: json['activityLevel'] ?? '',
      goal: json['goal'] ?? '',
      calorieTarget: json['calorieTarget'] ?? 2000,
      proteinTarget: json['proteinTarget'] ?? 150,
      carbsTarget: json['carbsTarget'] ?? 200,
      fatTarget: json['fatTarget'] ?? 70,
    );
  }
}

class User {
  final String id;
  final String email;
  final bool isGuest;
  final bool isOnboarded;
  final SubscriptionTier subscriptionTier;
  final UserProfile? profile;
  final DateTime createdAt;

  User({
    required this.id,
    required this.email,
    required this.isGuest,
    required this.isOnboarded,
    required this.subscriptionTier,
    this.profile,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'isGuest': isGuest,
      'isOnboarded': isOnboarded,
      'subscriptionTier': subscriptionTier.toString(),
      'profile': profile?.toJson(),
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      isGuest: json['isGuest'] ?? false,
      isOnboarded: json['isOnboarded'] ?? false,
      subscriptionTier: SubscriptionTier.values.firstWhere(
        (e) => e.toString() == json['subscriptionTier'],
        orElse: () => SubscriptionTier.free,
      ),
      profile: json['profile'] != null 
        ? UserProfile.fromJson(json['profile']) 
        : null,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  User copyWith({
    String? id,
    String? email,
    bool? isGuest,
    bool? isOnboarded,
    SubscriptionTier? subscriptionTier,
    UserProfile? profile,
    DateTime? createdAt,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      isGuest: isGuest ?? this.isGuest,
      isOnboarded: isOnboarded ?? this.isOnboarded,
      subscriptionTier: subscriptionTier ?? this.subscriptionTier,
      profile: profile ?? this.profile,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

class UserProvider extends ChangeNotifier {
  final SharedPreferences _prefs;
  User? _user;

  UserProvider(this._prefs) {
    _loadUser();
  }

  User? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get isGuest => _user?.isGuest ?? false;
  SubscriptionTier get subscriptionTier => _user?.subscriptionTier ?? SubscriptionTier.free;

  void _loadUser() {
    final userJson = _prefs.getString('user');
    if (userJson != null) {
      try {
        _user = User.fromJson(jsonDecode(userJson));
        notifyListeners();
      } catch (e) {
        debugPrint('Error loading user: $e');
      }
    }
  }

  Future<bool> login(String email, String password, {bool isGoogleAuth = false, bool isGuest = false}) async {
    try {
      // Simulate login logic
      final user = User(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        email: isGuest ? 'guest@fittracker.com' : email,
        isGuest: isGuest,
        isOnboarded: false,
        subscriptionTier: SubscriptionTier.free,
        createdAt: DateTime.now(),
      );

      _user = user;
      await _saveUser();
      await _prefs.setBool('isLoggedIn', true);
      
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Login error: $e');
      return false;
    }
  }

  Future<bool> completeOnboarding(UserProfile profile) async {
    if (_user == null) return false;

    try {
      _user = _user!.copyWith(
        isOnboarded: true,
        profile: profile,
      );

      await _saveUser();
      await _prefs.setBool('isOnboarded', true);
      
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Onboarding error: $e');
      return false;
    }
  }

  Future<bool> updateSubscription(SubscriptionTier tier) async {
    if (_user == null) return false;

    try {
      _user = _user!.copyWith(subscriptionTier: tier);
      await _saveUser();
      
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Subscription update error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    _user = null;
    await _prefs.remove('user');
    await _prefs.remove('isLoggedIn');
    await _prefs.remove('isOnboarded');
    
    notifyListeners();
  }

  Future<void> _saveUser() async {
    if (_user != null) {
      await _prefs.setString('user', jsonEncode(_user!.toJson()));
    }
  }

  bool canAccessPremiumFeature(String featureName) {
    final tier = subscriptionTier;
    if (tier == SubscriptionTier.premium || tier == SubscriptionTier.pro) {
      return true;
    }
    return false;
  }

  bool canAccessProFeature(String featureName) {
    return subscriptionTier == SubscriptionTier.pro;
  }
}