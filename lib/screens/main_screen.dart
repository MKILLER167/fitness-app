import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/navigation_provider.dart';
import '../providers/user_provider.dart';
import '../providers/language_provider.dart';
import '../providers/theme_provider.dart';
import '../widgets/bottom_navigation.dart';
import '../widgets/sidebar_drawer.dart';
import '../widgets/floating_action_buttons.dart';
import 'home_screen.dart';
import 'meals_screen.dart';
import 'workouts_screen.dart';
import 'stats_screen.dart';
import 'profile_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Consumer3<NavigationProvider, UserProvider, LanguageProvider>(
      builder: (context, navigation, user, language, child) {
        return Scaffold(
          key: _scaffoldKey,
          drawer: const SidebarDrawer(),
          body: SafeArea(
            child: _buildCurrentScreen(navigation.currentIndex),
          ),
          bottomNavigationBar: const BottomNavigation(),
          floatingActionButton: _buildFloatingActionButton(navigation.currentIndex),
          floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
        );
      },
    );
  }

  Widget _buildCurrentScreen(int index) {
    switch (index) {
      case 0:
        return const HomeScreen();
      case 1:
        return const MealsScreen();
      case 2:
        return const WorkoutsScreen();
      case 3:
        return const StatsScreen();
      case 4:
        return const ProfileScreen();
      default:
        return const HomeScreen();
    }
  }

  Widget? _buildFloatingActionButton(int currentIndex) {
    return Consumer<NavigationProvider>(
      builder: (context, navigation, child) {
        return FloatingActionButtons(
          currentIndex: currentIndex,
          onNavigate: navigation.setCurrentIndex,
        );
      },
    );
  }
}