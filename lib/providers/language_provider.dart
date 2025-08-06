import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider extends ChangeNotifier {
  final SharedPreferences _prefs;
  String _currentLanguage = 'en';

  LanguageProvider(this._prefs) {
    _loadLanguage();
  }

  String get currentLanguage => _currentLanguage;
  bool get isRTL => _currentLanguage == 'ar';
  bool get isArabic => _currentLanguage == 'ar';
  bool get isEnglish => _currentLanguage == 'en';

  void _loadLanguage() {
    _currentLanguage = _prefs.getString('language') ?? 'en';
    notifyListeners();
  }

  Future<void> setLanguage(String language) async {
    if (language != _currentLanguage) {
      _currentLanguage = language;
      await _prefs.setString('language', language);
      notifyListeners();
    }
  }

  Future<void> toggleLanguage() async {
    final newLanguage = _currentLanguage == 'en' ? 'ar' : 'en';
    await setLanguage(newLanguage);
  }

  String translate(String key, [Map<String, String>? params]) {
    final translations = _getTranslations();
    String value = translations[_currentLanguage]?[key] ?? key;
    
    // Replace parameters in the translation
    if (params != null) {
      params.forEach((paramKey, paramValue) {
        value = value.replaceAll('{$paramKey}', paramValue);
      });
    }
    
    return value;
  }

  Map<String, Map<String, String>> _getTranslations() {
    return {
      'en': {
        // Navigation
        'home': 'Home',
        'meals': 'Meals',
        'workouts': 'Workouts',
        'stats': 'Stats',
        'profile': 'Profile',
        
        // Common
        'add': 'Add',
        'edit': 'Edit',
        'delete': 'Delete',
        'save': 'Save',
        'cancel': 'Cancel',
        'continue': 'Continue',
        'back': 'Back',
        'next': 'Next',
        'done': 'Done',
        'loading': 'Loading...',
        'error': 'Error',
        'success': 'Success',
        
        // Home
        'good_morning': 'Good Morning',
        'good_afternoon': 'Good Afternoon',
        'good_evening': 'Good Evening',
        'guest': 'Guest',
        'level': 'Level {level}',
        'join_challenges': 'Join Challenges',
        'compete_with_others': 'Compete with others',
        'professional_workout_plans': 'Professional Workout Plans',
        'workout_plans_by_experts': 'Workout plans designed by fitness experts',
        'recent_achievements': 'Recent Achievements',
        'view_all': 'View All',
        'build_strength': 'Build strength and unlock achievement levels',
        'log_workouts_discover': 'Log your workouts and discover new strength levels with our advanced achievement system',
        'start_training': 'Start Training',
        'tiers': 'Tiers',
        'achievements': 'Achievements',
        
        // Meals
        'nutrition_tracker': 'Nutrition Tracker',
        'track_meals_reach_goals': 'Track your meals and reach your nutrition goals',
        'add_food': 'Add Food',
        'quick_add_food': 'Quick Add Food',
        'calories': 'Calories',
        'protein': 'Protein',
        'carbs': 'Carbs',
        'fat': 'Fat',
        'remaining': 'Remaining',
        'daily_goal_achieved': 'Daily goal achieved!',
        'close_to_goal': 'Close to your goal!',
        'percent_remaining': '{percent}% remaining for daily goal',
        
        // Subscription
        'premium': 'Premium',
        'pro': 'Pro',
        'free': 'Free',
        
        // Motivational messages
        'train_hard_stay_strong': 'Train Hard, Stay Strong!',
        'your_only_limit_is_you': 'Your Only Limit is You!',
        'stronger_than_yesterday': 'Stronger Than Yesterday!',
        'beast_mode_activated': 'Beast Mode Activated!',
        'champions_train_daily': 'Champions Train Daily!',
      },
      'ar': {
        // Navigation
        'home': 'الرئيسية',
        'meals': 'الوجبات',
        'workouts': 'التمارين',
        'stats': 'الإحصائيات',
        'profile': 'الملف',
        
        // Common
        'add': 'إضافة',
        'edit': 'تعديل',
        'delete': 'حذف',
        'save': 'حفظ',
        'cancel': 'إلغاء',
        'continue': 'متابعة',
        'back': 'رجوع',
        'next': 'التالي',
        'done': 'تم',
        'loading': 'جاري التحميل...',
        'error': 'خطأ',
        'success': 'نجح',
        
        // Home
        'good_morning': 'صباح الخير',
        'good_afternoon': 'مساء الخير',
        'good_evening': 'مساء الخير',
        'guest': 'ضيف',
        'level': 'المستوى {level}',
        'join_challenges': 'انضم للتحديات',
        'compete_with_others': 'تنافس مع الآخرين',
        'professional_workout_plans': 'خطط التمرين الاحترافية',
        'workout_plans_by_experts': 'خطط مصممة من قبل خبراء',
        'recent_achievements': 'الإنجازات الحديثة',
        'view_all': 'عرض الكل',
        'build_strength': 'بناء القوة وفتح مستويات الإنجاز',
        'log_workouts_discover': 'سجل تمارينك واكتشف مستويات قوة جديدة مع نظام الإنجازات المتقدم',
        'start_training': 'ابدأ التدريب',
        'tiers': 'مستويات',
        'achievements': 'إنجازات',
        
        // Meals
        'nutrition_tracker': 'متتبع التغذية',
        'track_meals_reach_goals': 'تتبع وجباتك وحقق أهدافك الغذائية',
        'add_food': 'إضافة طعام',
        'quick_add_food': 'إضافة طعام سريع',
        'calories': 'سعرة حرارية',
        'protein': 'البروتين',
        'carbs': 'الكربوهيدرات',
        'fat': 'الدهون',
        'remaining': 'المتبقي',
        'daily_goal_achieved': 'تم تحقيق الهدف اليومي!',
        'close_to_goal': 'قريب من الهدف!',
        'percent_remaining': '{percent}% متبقي للهدف اليومي',
        
        // Subscription
        'premium': 'مميز',
        'pro': 'برو',
        'free': 'مجاني',
        
        // Motivational messages
        'train_hard_stay_strong': 'تدرب بجنون أو ابق كما أنت!',
        'your_only_limit_is_you': 'حدودك الوحيدة هي أنت!',
        'stronger_than_yesterday': 'أقوى من الأمس!',
        'beast_mode_activated': 'تم تفعيل وضع الوحش!',
        'champions_train_daily': 'الأبطال يتدربون!',
      },
    };
  }

  // Convenience method for translations
  String t(String key, [Map<String, String>? params]) {
    return translate(key, params);
  }
}