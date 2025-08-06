import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/navigation_provider.dart';
import '../providers/language_provider.dart';

class BottomNavigation extends StatefulWidget {
  const BottomNavigation({Key? key}) : super(key: key);

  @override
  State<BottomNavigation> createState() => _BottomNavigationState();
}

class _BottomNavigationState extends State<BottomNavigation>
    with TickerProviderStateMixin {
  late List<AnimationController> _animationControllers;
  late List<Animation<double>> _animations;

  @override
  void initState() {
    super.initState();
    _animationControllers = List.generate(
      5,
      (index) => AnimationController(
        duration: const Duration(milliseconds: 200),
        vsync: this,
      ),
    );
    _animations = _animationControllers
        .map((controller) => Tween<double>(begin: 1.0, end: 1.2).animate(
              CurvedAnimation(parent: controller, curve: Curves.elasticOut),
            ))
        .toList();
  }

  @override
  void dispose() {
    for (var controller in _animationControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  void _animateIcon(int index) {
    _animationControllers[index].forward().then((_) {
      _animationControllers[index].reverse();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<NavigationProvider, LanguageProvider>(
      builder: (context, navigation, language, child) {
        final tabs = [
          {
            'icon': Icons.home_outlined,
            'activeIcon': Icons.home,
            'label': language.currentLanguage == 'ar' ? 'الرئيسية' : 'Home',
          },
          {
            'icon': Icons.restaurant_outlined,
            'activeIcon': Icons.restaurant,
            'label': language.currentLanguage == 'ar' ? 'الوجبات' : 'Meals',
          },
          {
            'icon': Icons.fitness_center_outlined,
            'activeIcon': Icons.fitness_center,
            'label': language.currentLanguage == 'ar' ? 'التمارين' : 'Workouts',
          },
          {
            'icon': Icons.bar_chart_outlined,
            'activeIcon': Icons.bar_chart,
            'label': language.currentLanguage == 'ar' ? 'الإحصائيات' : 'Stats',
          },
          {
            'icon': Icons.person_outline,
            'activeIcon': Icons.person,
            'label': language.currentLanguage == 'ar' ? 'الملف' : 'Profile',
          },
        ];

        return Container(
          decoration: BoxDecoration(
            color: Theme.of(context).bottomNavigationBarTheme.backgroundColor,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: tabs.asMap().entries.map((entry) {
                  final index = entry.key;
                  final tab = entry.value;
                  final isActive = navigation.currentIndex == index;

                  return Expanded(
                    child: InkWell(
                      onTap: () {
                        navigation.setCurrentIndex(index);
                        _animateIcon(index);
                      },
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            AnimatedBuilder(
                              animation: _animations[index],
                              builder: (context, child) {
                                return Transform.scale(
                                  scale: _animations[index].value,
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    curve: Curves.easeInOut,
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: isActive
                                          ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                                          : Colors.transparent,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Icon(
                                      isActive ? tab['activeIcon'] as IconData : tab['icon'] as IconData,
                                      color: isActive
                                          ? Theme.of(context).colorScheme.primary
                                          : Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                                      size: 24,
                                    ),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: 2),
                            AnimatedDefaultTextStyle(
                              duration: const Duration(milliseconds: 200),
                              style: Theme.of(context).textTheme.labelSmall!.copyWith(
                                color: isActive
                                    ? Theme.of(context).colorScheme.primary
                                    : Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                              ),
                              child: Text(
                                tab['label'] as String,
                                textAlign: TextAlign.center,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        );
      },
    );
  }
}