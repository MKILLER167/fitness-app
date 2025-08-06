import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../providers/user_provider.dart';
import '../providers/language_provider.dart';
import '../providers/theme_provider.dart';
import '../providers/stats_provider.dart';
import '../providers/navigation_provider.dart';
import '../widgets/gradient_card.dart';
import '../widgets/stats_card.dart';
import '../widgets/achievement_badge.dart';
import '../widgets/quick_action_button.dart';
import '../theme/app_theme.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer4<UserProvider, LanguageProvider, StatsProvider, NavigationProvider>(
      builder: (context, user, language, stats, navigation, child) {
        return FadeTransition(
          opacity: _fadeAnimation,
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Theme.of(context).colorScheme.background,
                  Theme.of(context).colorScheme.background.withOpacity(0.8),
                ],
              ),
            ),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(context, user, language),
                  const SizedBox(height: 24),
                  _buildQuickActions(context, navigation, language),
                  const SizedBox(height: 24),
                  _buildChallengesCard(context, language, user),
                  const SizedBox(height: 16),
                  _buildWorkoutPlansCard(context, language, navigation),
                  const SizedBox(height: 24),
                  _buildStatsGrid(context, stats, language, navigation),
                  const SizedBox(height: 24),
                  _buildAchievements(context, stats, language, navigation),
                  const SizedBox(height: 24),
                  _buildStrengthCTA(context, stats, language, navigation),
                  const SizedBox(height: 100), // Bottom padding for FAB
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context, UserProvider user, LanguageProvider language) {
    final now = DateTime.now();
    final hour = now.hour;
    
    String greeting;
    if (language.currentLanguage == 'ar') {
      if (hour < 12) {
        greeting = 'صباح الخير';
      } else if (hour < 17) {
        greeting = 'مساء الخير';
      } else {
        greeting = 'مساء الخير';
      }
    } else {
      if (hour < 12) {
        greeting = 'Good Morning';
      } else if (hour < 17) {
        greeting = 'Good Afternoon';
      } else {
        greeting = 'Good Evening';
      }
    }

    final motivationalMessages = language.currentLanguage == 'ar' 
      ? [
          '💪 تدرب بجنون أو ابق كما أنت!',
          '🔥 حدودك الوحيدة هي أنت!',
          '⚡ أقوى من الأمس!',
          '🎯 تم تفعيل وضع الوحش!',
          '🚀 الأبطال يتدربون!',
        ]
      : [
          '💪 Train Hard, Stay Strong!',
          '🔥 Your Only Limit is You!',
          '⚡ Stronger Than Yesterday!',
          '🎯 Beast Mode Activated!',
          '🚀 Champions Train Daily!',
        ];

    final randomMessage = motivationalMessages[DateTime.now().millisecond % motivationalMessages.length];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).colorScheme.background,
            Theme.of(context).colorScheme.surface.withOpacity(0.5),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$greeting, ${user.user?.profile?.name ?? (language.currentLanguage == 'ar' ? 'ضيف' : 'Guest')}!',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      DateFormat(language.currentLanguage == 'ar' ? 'EEEE، d MMMM' : 'EEEE, MMMM d')
                        .format(now),
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),
              Consumer<StatsProvider>(
                builder: (context, stats, child) {
                  return Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.secondary,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          language.currentLanguage == 'ar' 
                            ? 'المستوى ${stats.level}'
                            : 'Level ${stats.level}',
                          style: Theme.of(context).textTheme.labelMedium,
                        ),
                      ),
                      if (user.subscriptionTier != SubscriptionTier.free) ...[
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: user.subscriptionTier == SubscriptionTier.pro
                              ? AppTheme.purple500.withOpacity(0.1)
                              : AppTheme.orange500.withOpacity(0.1),
                            border: Border.all(
                              color: user.subscriptionTier == SubscriptionTier.pro
                                ? AppTheme.purple500.withOpacity(0.3)
                                : AppTheme.orange500.withOpacity(0.3),
                            ),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            user.subscriptionTier == SubscriptionTier.pro ? '✨ Pro' : '👑 Premium',
                            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                              color: user.subscriptionTier == SubscriptionTier.pro
                                ? AppTheme.purple500
                                : AppTheme.orange500,
                            ),
                          ),
                        ),
                      ],
                    ],
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            randomMessage,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context, NavigationProvider navigation, LanguageProvider language) {
    return Row(
      children: [
        Expanded(
          child: QuickActionButton(
            title: language.currentLanguage == 'ar' ? 'إضافة طعام' : 'Add Food',
            icon: Icons.restaurant,
            gradient: AppTheme.greenGradient,
            onTap: () => navigation.setCurrentIndex(1),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: QuickActionButton(
            title: language.currentLanguage == 'ar' ? 'تمرين' : 'Workout',
            icon: Icons.fitness_center,
            gradient: AppTheme.blueGradient,
            onTap: () => navigation.setCurrentIndex(2),
          ),
        ),
      ],
    );
  }

  Widget _buildChallengesCard(BuildContext context, LanguageProvider language, UserProvider user) {
    return GradientCard(
      gradient: AppTheme.purpleGradient,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    language.currentLanguage == 'ar' ? 'انضم للتحديات' : 'Join Challenges',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    language.currentLanguage == 'ar' ? 'تنافس مع الآخرين' : 'Compete with others',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                  if (user.subscriptionTier == SubscriptionTier.free) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        language.currentLanguage == 'ar' ? 'مميز' : 'Premium',
                        style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Icon(
                Icons.people,
                color: Colors.white,
                size: 24,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkoutPlansCard(BuildContext context, LanguageProvider language, NavigationProvider navigation) {
    return GradientCard(
      gradient: AppTheme.pinkGradient,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    language.currentLanguage == 'ar' ? 'خطط التمرين الاحترافية' : 'Professional Workout Plans',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    language.currentLanguage == 'ar' ? 'خطط مصممة من قبل خبراء' : 'Workout plans designed by fitness experts',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Icon(
                Icons.calendar_today,
                color: Colors.white,
                size: 24,
              ),
            ),
          ],
        ),
      ),
      onTap: () => navigation.setCurrentIndex(2),
    );
  }

  Widget _buildStatsGrid(BuildContext context, StatsProvider stats, LanguageProvider language, NavigationProvider navigation) {
    return Row(
      children: [
        Expanded(
          child: StatsCard(
            title: language.currentLanguage == 'ar' ? 'سعرة' : 'Calories',
            value: stats.dailyCalories.toString(),
            target: stats.calorieTarget,
            current: stats.dailyCalories,
            icon: Icons.local_fire_department,
            color: AppTheme.orange500,
            onTap: () => navigation.setCurrentIndex(1),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: StatsCard(
            title: language.currentLanguage == 'ar' ? 'أكواب' : 'Glasses',
            value: '${stats.dailyWater}/${stats.waterTarget}',
            target: stats.waterTarget,
            current: stats.dailyWater,
            icon: Icons.water_drop,
            color: AppTheme.blue500,
            onTap: () => stats.addWater(),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: StatsCard(
            title: language.currentLanguage == 'ar' ? 'خطوات' : 'Steps',
            value: '${(stats.dailySteps / 1000).toStringAsFixed(1)}k',
            target: stats.stepsTarget,
            current: stats.dailySteps,
            icon: Icons.directions_walk,
            color: AppTheme.green500,
            onTap: () => navigation.setCurrentIndex(3),
          ),
        ),
      ],
    );
  }

  Widget _buildAchievements(BuildContext context, StatsProvider stats, LanguageProvider language, NavigationProvider navigation) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              language.currentLanguage == 'ar' ? 'الإنجازات الحديثة' : 'Recent Achievements',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            TextButton(
              onPressed: () => navigation.setCurrentIndex(3),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    language.currentLanguage == 'ar' ? 'عرض الكل' : 'View All',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    Icons.arrow_forward_ios,
                    size: 12,
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            AchievementBadge(
              title: language.currentLanguage == 'ar' ? 'المبتدئ' : 'First Steps',
              description: language.currentLanguage == 'ar' ? 'أول تمرين مكتمل' : 'Completed first workout',
              tier: AchievementTier.bronze,
              isUnlocked: true,
              progress: 100,
              onTap: () => navigation.setCurrentIndex(3),
            ),
            AchievementBadge(
              title: language.currentLanguage == 'ar' ? 'محارب الأسبوع' : 'Week Warrior',
              description: language.currentLanguage == 'ar' ? '7 أيام متتالية' : '7 day streak',
              tier: AchievementTier.silver,
              isUnlocked: false,
              progress: (stats.workoutsCompleted / 7 * 100).clamp(0, 100).toInt(),
              onTap: () => navigation.setCurrentIndex(3),
            ),
            AchievementBadge(
              title: language.currentLanguage == 'ar' ? 'محترف القوة' : 'Strength Pro',
              description: language.currentLanguage == 'ar' ? 'فتح مستوى قوة جديد' : 'Unlocked new strength tier',
              tier: AchievementTier.gold,
              isUnlocked: stats.tiersUnlocked > 0,
              progress: stats.tiersUnlocked > 0 ? 100 : 75,
              onTap: () => navigation.setCurrentIndex(2),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStrengthCTA(BuildContext context, StatsProvider stats, LanguageProvider language, NavigationProvider navigation) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).colorScheme.background,
            Theme.of(context).colorScheme.surface.withOpacity(0.5),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).colorScheme.onSurface.withOpacity(0.1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.fitness_center,
                  color: Theme.of(context).colorScheme.primary,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      language.currentLanguage == 'ar' 
                        ? 'بناء القوة وفتح مستويات الإنجاز'
                        : 'Build strength and unlock achievement levels',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      language.currentLanguage == 'ar'
                        ? 'سجل تمارينك واكتشف مستويات قوة جديدة مع نظام الإنجازات المتقدم'
                        : 'Log your workouts and discover new strength levels with our advanced achievement system',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildStatBadge(
                context,
                Icons.star,
                AppTheme.orange500,
                stats.tiersUnlocked.toString(),
                language.currentLanguage == 'ar' ? 'مستويات' : 'Tiers',
              ),
              const SizedBox(width: 16),
              _buildStatBadge(
                context,
                Icons.emoji_events,
                AppTheme.purple500,
                stats.achievements.toString(),
                language.currentLanguage == 'ar' ? 'إنجازات' : 'Achievements',
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => navigation.setCurrentIndex(2),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.trending_up, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    language.currentLanguage == 'ar' ? 'ابدأ التدريب' : 'Start Training',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.arrow_forward, size: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatBadge(BuildContext context, IconData icon, Color color, String value, String label) {
    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, size: 12, color: color),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
          ),
        ),
      ],
    );
  }
}