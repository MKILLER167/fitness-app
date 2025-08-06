import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Color palette
  static const Color primaryBlack = Color(0xFF000000);
  static const Color primaryWhite = Color(0xFFFFFFFF);
  static const Color grey50 = Color(0xFFF5F5F5);
  static const Color grey100 = Color(0xFFF0F0F0);
  static const Color grey200 = Color(0xFFE5E5E5);
  static const Color grey300 = Color(0xFFD0D0D0);
  static const Color grey400 = Color(0xFFE0E0E0);
  static const Color grey600 = Color(0xFF666666);
  static const Color grey900 = Color(0xFF1A1A1A);
  static const Color grey800 = Color(0xFF333333);
  
  // Accent colors
  static const Color orange500 = Color(0xFFF59E0B);
  static const Color orange600 = Color(0xFFD97706);
  static const Color green500 = Color(0xFF10B981);
  static const Color green600 = Color(0xFF059669);
  static const Color blue500 = Color(0xFF3B82F6);
  static const Color blue600 = Color(0xFF2563EB);
  static const Color purple500 = Color(0xFF8B5CF6);
  static const Color purple600 = Color(0xFF7C3AED);
  static const Color pink500 = Color(0xFFEC4899);
  static const Color pink600 = Color(0xFFDB2777);

  // Light theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    
    // Color scheme
    colorScheme: const ColorScheme.light(
      primary: primaryBlack,
      onPrimary: primaryWhite,
      secondary: grey50,
      onSecondary: primaryBlack,
      surface: primaryWhite,
      onSurface: primaryBlack,
      background: primaryWhite,
      onBackground: primaryBlack,
      error: primaryBlack,
      onError: primaryWhite,
    ),
    
    // Typography
    textTheme: _buildTextTheme(primaryBlack),
    
    // App bar
    appBarTheme: const AppBarTheme(
      backgroundColor: primaryWhite,
      foregroundColor: primaryBlack,
      elevation: 0,
      centerTitle: false,
    ),
    
    // Card
    cardTheme: CardTheme(
      color: primaryWhite,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: const BorderSide(color: grey400, width: 1),
      ),
    ),
    
    // Elevated button
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryBlack,
        foregroundColor: primaryWhite,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    // Outlined button
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primaryBlack,
        side: const BorderSide(color: grey400),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    // Text button
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: primaryBlack,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    ),
    
    // Input decoration
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFFF8F8F8),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: grey400),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: grey400),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: primaryBlack, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
    ),
    
    // Bottom navigation
    bottomNavigationBarTheme: const BottomNavigationBarTheme(
      backgroundColor: primaryWhite,
      selectedItemColor: primaryBlack,
      unselectedItemColor: grey600,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),
    
    // Switch
    switchTheme: SwitchThemeData(
      thumbColor: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return primaryWhite;
        }
        return grey600;
      }),
      trackColor: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return primaryBlack;
        }
        return grey300;
      }),
    ),
    
    // Floating action button
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: primaryBlack,
      foregroundColor: primaryWhite,
    ),
  );

  // Dark theme
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    
    // Color scheme
    colorScheme: const ColorScheme.dark(
      primary: primaryWhite,
      onPrimary: primaryBlack,
      secondary: grey900,
      onSecondary: primaryWhite,
      surface: primaryBlack,
      onSurface: primaryWhite,
      background: primaryBlack,
      onBackground: primaryWhite,
      error: primaryWhite,
      onError: primaryBlack,
    ),
    
    // Typography
    textTheme: _buildTextTheme(primaryWhite),
    
    // App bar
    appBarTheme: const AppBarTheme(
      backgroundColor: primaryBlack,
      foregroundColor: primaryWhite,
      elevation: 0,
      centerTitle: false,
    ),
    
    // Card
    cardTheme: CardTheme(
      color: primaryBlack,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: const BorderSide(color: grey800, width: 1),
      ),
    ),
    
    // Elevated button
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryWhite,
        foregroundColor: primaryBlack,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    // Outlined button
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primaryWhite,
        side: const BorderSide(color: grey800),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    // Text button
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: primaryWhite,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    ),
    
    // Input decoration
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: grey900,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: grey800),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: grey800),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: primaryWhite, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
    ),
    
    // Bottom navigation
    bottomNavigationBarTheme: const BottomNavigationBarTheme(
      backgroundColor: primaryBlack,
      selectedItemColor: primaryWhite,
      unselectedItemColor: grey600,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),
    
    // Switch
    switchTheme: SwitchThemeData(
      thumbColor: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return primaryBlack;
        }
        return grey600;
      }),
      trackColor: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return primaryWhite;
        }
        return grey800;
      }),
    ),
    
    // Floating action button
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: primaryWhite,
      foregroundColor: primaryBlack,
    ),
  );

  static TextTheme _buildTextTheme(Color textColor) {
    return GoogleFonts.interTextTheme(
      TextTheme(
        headlineLarge: GoogleFonts.inter(
          fontSize: 24,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        headlineMedium: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        headlineSmall: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        titleLarge: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        titleMedium: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        titleSmall: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: textColor,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: textColor,
          height: 1.5,
        ),
        bodySmall: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: textColor,
          height: 1.5,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        labelMedium: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        labelSmall: GoogleFonts.inter(
          fontSize: 10,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
      ),
    );
  }

  // Custom gradients
  static const LinearGradient purpleGradient = LinearGradient(
    colors: [purple500, purple600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient pinkGradient = LinearGradient(
    colors: [pink500, pink600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient orangeGradient = LinearGradient(
    colors: [orange500, orange600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient greenGradient = LinearGradient(
    colors: [green500, green600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient blueGradient = LinearGradient(
    colors: [blue500, blue600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

// Arabic text theme
class ArabicTextTheme {
  static TextTheme buildArabicTextTheme(Color textColor) {
    return GoogleFonts.notoSansArabicTextTheme(
      TextTheme(
        headlineLarge: GoogleFonts.notoSansArabic(
          fontSize: 24,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        headlineMedium: GoogleFonts.notoSansArabic(
          fontSize: 20,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        headlineSmall: GoogleFonts.notoSansArabic(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        titleLarge: GoogleFonts.notoSansArabic(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        titleMedium: GoogleFonts.notoSansArabic(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        titleSmall: GoogleFonts.notoSansArabic(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        bodyLarge: GoogleFonts.notoSansArabic(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: textColor,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.notoSansArabic(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: textColor,
          height: 1.5,
        ),
        bodySmall: GoogleFonts.notoSansArabic(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: textColor,
          height: 1.5,
        ),
        labelLarge: GoogleFonts.notoSansArabic(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        labelMedium: GoogleFonts.notoSansArabic(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
        labelSmall: GoogleFonts.notoSansArabic(
          fontSize: 10,
          fontWeight: FontWeight.w500,
          color: textColor,
          height: 1.4,
        ),
      ),
    );
  }
}