"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { useLanguage } from './LanguageContext'
import { 
  User, 
  Target, 
  Activity, 
  Calendar, 
  Scale, 
  Ruler, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Heart,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react'

export interface UserProfile {
  name: string
  age: number
  gender: string
  height: number // cm
  weight: number // kg
  activityLevel: string
  fitnessGoal: string
  targetWeight: number // kg
  weeklyGoal: number // kg per week
  dailyCalorieGoal: number
  workoutFrequency: number // days per week
  dietaryRestrictions: string[]
  experience: string
  language?: string
  goal?: string
  calorieTarget?: number
  targetCalories?: number
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void
  isDarkMode?: boolean
  isGuest?: boolean
}

export function Onboarding({ onComplete, isDarkMode = false, isGuest = false }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { t, language, direction } = useLanguage()
  
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    dailyCalorieGoal: 2000,
    workoutFrequency: 3,
    dietaryRestrictions: [],
    language: 'en', // Default to English
    name: isGuest ? (language === 'ar' ? 'ضيف' : 'Guest') : ''
  })

  const totalSteps = 7
  const progress = ((currentStep + 1) / totalSteps) * 100

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Calculate BMR and adjust calorie goal based on activity level
    const bmr = calculateBMR()
    const adjustedCalories = calculateDailyCalories(bmr)
    
    const finalProfile: UserProfile = {
      name: profile.name || (language === 'ar' ? 'ضيف' : 'Guest'),
      age: profile.age || 25,
      gender: profile.gender || 'other',
      height: profile.height || 170,
      weight: profile.weight || 70,
      activityLevel: profile.activityLevel || 'moderate',
      fitnessGoal: profile.fitnessGoal || 'maintain',
      targetWeight: profile.targetWeight || profile.weight || 70,
      weeklyGoal: profile.weeklyGoal || 0.5,
      dailyCalorieGoal: adjustedCalories,
      workoutFrequency: profile.workoutFrequency || 3,
      dietaryRestrictions: profile.dietaryRestrictions || [],
      experience: profile.experience || 'beginner',
      language: 'en', // Always set to English as default
      goal: profile.fitnessGoal || 'maintain',
      calorieTarget: adjustedCalories,
      targetCalories: adjustedCalories
    }
    
    onComplete(finalProfile)
  }

  const calculateBMR = () => {
    const { weight = 70, height = 170, age = 25, gender = 'other' } = profile
    
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5
    } else if (gender === 'female') {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161
    }
    return (10 * weight) + (6.25 * height) - (5 * age) - 78 // Average
  }

  const calculateDailyCalories = (bmr: number) => {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    const multiplier = activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.55
    let calories = bmr * multiplier
    
    // Adjust based on goal
    if (profile.fitnessGoal === 'lose') {
      calories -= (profile.weeklyGoal || 0.5) * 7700 / 7 // 7700 cal per kg
    } else if (profile.fitnessGoal === 'gain') {
      calories += (profile.weeklyGoal || 0.5) * 7700 / 7
    }
    
    return Math.round(calories)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6" dir={direction}>
            <div className="text-center">
              <User className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl mb-2">
                {language === 'ar' ? 'دعنا نتعرف عليك' : "Let's get to know you"}
                {isGuest && <Badge variant="secondary" className="ml-2">{language === 'ar' ? 'ضيف' : 'Guest'}</Badge>}
              </h2>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'أخبرنا عن نفسك لتخصيص رحلة اللياقة البدنية الخاصة بك' : 'Tell us about yourself to personalize your fitness journey'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>{language === 'ar' ? 'ما اسمك؟' : "What's your name?"}</Label>
                <Input
                  placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                  value={profile.name || ''}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="mt-2"
                  dir={direction}
                />
              </div>
              
              <div>
                <Label>{language === 'ar' ? 'كم عمرك؟' : 'How old are you?'}</Label>
                <Input
                  type="number"
                  placeholder={language === 'ar' ? 'العمر' : 'Age'}
                  value={profile.age || ''}
                  onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
                  className="mt-2 ltr-numbers"
                />
              </div>
              
              <div>
                <Label>{language === 'ar' ? 'الجنس' : 'Gender'}</Label>
                <RadioGroup 
                  value={profile.gender || ''} 
                  onValueChange={(value) => updateProfile({ gender: value })}
                  className="mt-2"
                >
                  <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">{language === 'ar' ? 'ذكر' : 'Male'}</Label>
                  </div>
                  <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">{language === 'ar' ? 'أنثى' : 'Female'}</Label>
                  </div>
                  <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">{language === 'ar' ? 'آخر' : 'Other'}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6" dir={direction}>
            <div className="text-center">
              <Ruler className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl mb-2">{language === 'ar' ? 'القياسات الجسدية' : 'Physical measurements'}</h2>
              <p className="text-muted-foreground">{language === 'ar' ? 'هذا يساعدنا في حساب احتياجاتك اليومية من السعرات الحرارية' : 'This helps us calculate your daily calorie needs'}</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label>{language === 'ar' ? 'الطول (سم)' : 'Height (cm)'}</Label>
                <div className="mt-2">
                  <Slider
                    value={[profile.height || 170]}
                    onValueChange={(value) => updateProfile({ height: value[0] })}
                    max={220}
                    min={140}
                    step={1}
                    className="w-full"
                  />
                  <div className={`flex justify-between text-sm text-muted-foreground mt-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>140 {language === 'ar' ? 'سم' : 'cm'}</span>
                    <span className="font-medium ltr-numbers">{profile.height || 170} {language === 'ar' ? 'سم' : 'cm'}</span>
                    <span>220 {language === 'ar' ? 'سم' : 'cm'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>{language === 'ar' ? 'الوزن الحالي (كجم)' : 'Current Weight (kg)'}</Label>
                <div className="mt-2">
                  <Slider
                    value={[profile.weight || 70]}
                    onValueChange={(value) => updateProfile({ weight: value[0] })}
                    max={150}
                    min={40}
                    step={0.5}
                    className="w-full"
                  />
                  <div className={`flex justify-between text-sm text-muted-foreground mt-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>40 {language === 'ar' ? 'كجم' : 'kg'}</span>
                    <span className="font-medium ltr-numbers">{profile.weight || 70} {language === 'ar' ? 'كجم' : 'kg'}</span>
                    <span>150 {language === 'ar' ? 'كجم' : 'kg'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6" dir={direction}>
            <div className="text-center">
              <Activity className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl mb-2">{language === 'ar' ? 'مستوى النشاط' : 'Activity level'}</h2>
              <p className="text-muted-foreground">{language === 'ar' ? 'ما مدى نشاطك في حياتك اليومية؟' : 'How active are you in your daily life?'}</p>
            </div>
            
            <RadioGroup 
              value={profile.activityLevel || ''} 
              onValueChange={(value) => updateProfile({ activityLevel: value })}
              className="space-y-3"
            >
              <div className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value="sedentary" id="sedentary" />
                <div className="flex-1">
                  <Label htmlFor="sedentary" className="cursor-pointer">
                    <div className="font-medium">{language === 'ar' ? 'مستقر' : 'Sedentary'}</div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'تمارين قليلة أو معدومة، وظيفة مكتبية' : 'Little to no exercise, desk job'}</div>
                  </Label>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value="light" id="light" />
                <div className="flex-1">
                  <Label htmlFor="light" className="cursor-pointer">
                    <div className="font-medium">{language === 'ar' ? 'نشط قليلاً' : 'Lightly Active'}</div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'تمارين خفيفة 1-3 أيام/أسبوع' : 'Light exercise 1-3 days/week'}</div>
                  </Label>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value="moderate" id="moderate" />
                <div className="flex-1">
                  <Label htmlFor="moderate" className="cursor-pointer">
                    <div className="font-medium">{language === 'ar' ? 'نشط معتدل' : 'Moderately Active'}</div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'تمارين معتدلة 3-5 أيام/أسبوع' : 'Moderate exercise 3-5 days/week'}</div>
                  </Label>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value="active" id="active" />
                <div className="flex-1">
                  <Label htmlFor="active" className="cursor-pointer">
                    <div className="font-medium">{language === 'ar' ? 'نشط جداً' : 'Very Active'}</div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'تمارين قوية 6-7 أيام/أسبوع' : 'Hard exercise 6-7 days/week'}</div>
                  </Label>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value="very_active" id="very_active" />
                <div className="flex-1">
                  <Label htmlFor="very_active" className="cursor-pointer">
                    <div className="font-medium">{language === 'ar' ? 'نشط للغاية' : 'Extremely Active'}</div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'تمارين شاقة جداً، وظيفة بدنية' : 'Very hard exercise, physical job'}</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6" dir={direction}>
            <div className="text-center">
              <Target className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl mb-2">{language === 'ar' ? 'ما هو هدفك؟' : "What's your goal?"}</h2>
              <p className="text-muted-foreground">{language === 'ar' ? 'سيساعدنا هذا في تخصيص أهداف السعرات الحرارية الخاصة بك' : 'This will help us customize your calorie targets'}</p>
            </div>
            
            <RadioGroup 
              value={profile.fitnessGoal || ''} 
              onValueChange={(value) => updateProfile({ fitnessGoal: value })}
              className="space-y-3"
            >
              <div className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value="lose" id="lose" />
                <div className="flex-1">
                  <Label htmlFor="lose" className="cursor-pointer">
                    <div className={`font-medium flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <TrendingUp className="text-red-500" size={18} />
                      {language === 'ar' ? 'فقدان الوزن' : 'Lose Weight'}
                    </div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'تقليل وزن الجسم والدهون' : 'Reduce body weight and fat'}</div>
                  </Label>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value="maintain" id="maintain" />
                <div className="flex-1">
                  <Label htmlFor="maintain" className="cursor-pointer">
                    <div className={`font-medium flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Shield className="text-blue-500" size={18} />
                      {language === 'ar' ? 'الحفاظ على الوزن' : 'Maintain Weight'}
                    </div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'البقاء على الوزن الحالي، تحسين اللياقة' : 'Stay at current weight, improve fitness'}</div>
                  </Label>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value="gain" id="gain" />
                <div className="flex-1">
                  <Label htmlFor="gain" className="cursor-pointer">
                    <div className={`font-medium flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Zap className="text-green-500" size={18} />
                      {language === 'ar' ? 'زيادة الوزن' : 'Gain Weight'}
                    </div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'بناء العضلات وزيادة الوزن' : 'Build muscle and increase weight'}</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6" dir={direction}>
            <div className="text-center">
              <Scale className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl mb-2">{language === 'ar' ? 'تفاصيل الهدف' : 'Target details'}</h2>
              <p className="text-muted-foreground">{language === 'ar' ? 'حدد أهداف الوزن المحددة' : 'Set your specific weight targets'}</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label>{language === 'ar' ? 'الوزن المستهدف (كجم)' : 'Target Weight (kg)'}</Label>
                <div className="mt-2">
                  <Slider
                    value={[profile.targetWeight || profile.weight || 70]}
                    onValueChange={(value) => updateProfile({ targetWeight: value[0] })}
                    max={150}
                    min={40}
                    step={0.5}
                    className="w-full"
                  />
                  <div className={`flex justify-between text-sm text-muted-foreground mt-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>40 {language === 'ar' ? 'كجم' : 'kg'}</span>
                    <span className="font-medium ltr-numbers">{profile.targetWeight || profile.weight || 70} {language === 'ar' ? 'كجم' : 'kg'}</span>
                    <span>150 {language === 'ar' ? 'كجم' : 'kg'}</span>
                  </div>
                </div>
              </div>
              
              {profile.fitnessGoal !== 'maintain' && (
                <div>
                  <Label>{language === 'ar' ? 'الهدف الأسبوعي (كجم في الأسبوع)' : 'Weekly Goal (kg per week)'}</Label>
                  <div className="mt-2">
                    <Slider
                      value={[profile.weeklyGoal || 0.5]}
                      onValueChange={(value) => updateProfile({ weeklyGoal: value[0] })}
                      max={1.0}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className={`flex justify-between text-sm text-muted-foreground mt-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="ltr-numbers">0.1 {language === 'ar' ? 'كجم/أسبوع' : 'kg/week'}</span>
                      <span className="font-medium ltr-numbers">{profile.weeklyGoal || 0.5} {language === 'ar' ? 'كجم/أسبوع' : 'kg/week'}</span>
                      <span className="ltr-numbers">1.0 {language === 'ar' ? 'كجم/أسبوع' : 'kg/week'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'ar' ? 'موصى به: 0.3-0.7 كجم في الأسبوع للحصول على نتائج مستدامة' : 'Recommended: 0.3-0.7 kg per week for sustainable results'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6" dir={direction}>
            <div className="text-center">
              <Calendar className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl mb-2">{language === 'ar' ? 'تكرار التمرين' : 'Workout frequency'}</h2>
              <p className="text-muted-foreground">{language === 'ar' ? 'كم مرة تخطط لممارسة الرياضة؟' : 'How often do you plan to exercise?'}</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label>{language === 'ar' ? 'أيام في الأسبوع' : 'Days per week'}</Label>
                <div className="mt-2">
                  <Slider
                    value={[profile.workoutFrequency || 3]}
                    onValueChange={(value) => updateProfile({ workoutFrequency: value[0] })}
                    max={7}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className={`flex justify-between text-sm text-muted-foreground mt-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>0 {language === 'ar' ? 'أيام' : 'days'}</span>
                    <span className="font-medium ltr-numbers">{profile.workoutFrequency || 3} {language === 'ar' ? 'أيام/أسبوع' : 'days/week'}</span>
                    <span>7 {language === 'ar' ? 'أيام' : 'days'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>{language === 'ar' ? 'مستوى الخبرة' : 'Experience Level'}</Label>
                <RadioGroup 
                  value={profile.experience || ''} 
                  onValueChange={(value) => updateProfile({ experience: value })}
                  className="mt-2"
                >
                  <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">{language === 'ar' ? 'مبتدئ (0-6 أشهر)' : 'Beginner (0-6 months)'}</Label>
                  </div>
                  <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">{language === 'ar' ? 'متوسط (6 أشهر - 2 سنة)' : 'Intermediate (6 months - 2 years)'}</Label>
                  </div>
                  <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">{language === 'ar' ? 'متقدم (2+ سنوات)' : 'Advanced (2+ years)'}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )

      case 6:
        const estimatedCalories = calculateDailyCalories(calculateBMR())
        return (
          <div className="space-y-6" dir={direction}>
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
              <h2 className="text-2xl mb-2">{language === 'ar' ? 'خطتك الشخصية' : 'Your personalized plan'}</h2>
              <p className="text-muted-foreground">{language === 'ar' ? 'راجع ملف اللياقة البدنية الخاص بك' : 'Review your fitness profile'}</p>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-primary/10 to-accent/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1 ltr-numbers">{estimatedCalories}</div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'هدف السعرات اليومي' : 'Daily Calorie Goal'}</div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <div className="font-semibold ltr-numbers">{profile.workoutFrequency}</div>
                  <div className="text-sm text-muted-foreground">{language === 'ar' ? 'تمارين/أسبوع' : 'Workouts/week'}</div>
                </div>
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <div className="font-semibold ltr-numbers">{profile.targetWeight} {language === 'ar' ? 'كجم' : 'kg'}</div>
                  <div className="text-sm text-muted-foreground">{language === 'ar' ? 'الوزن المستهدف' : 'Target weight'}</div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">{language === 'ar' ? 'ملخص ملفك الشخصي:' : 'Your Profile Summary:'}</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• {profile.name}, {profile.age} {language === 'ar' ? 'سنة' : 'years old'}</li>
                  <li className="ltr-numbers">• {profile.height} {language === 'ar' ? 'سم' : 'cm'}, {profile.weight} {language === 'ar' ? 'كجم' : 'kg'}</li>
                  <li>• {language === 'ar' ? 'الهدف:' : 'Goal:'} {profile.fitnessGoal === 'lose' ? (language === 'ar' ? 'فقدان الوزن' : 'lose weight') : 
                        profile.fitnessGoal === 'gain' ? (language === 'ar' ? 'زيادة الوزن' : 'gain weight') : 
                        (language === 'ar' ? 'الحفاظ على الوزن' : 'maintain weight')}</li>
                  <li>• {language === 'ar' ? 'مستوى النشاط:' : 'Activity level:'} {profile.activityLevel}</li>
                  <li>• {language === 'ar' ? 'الخبرة:' : 'Experience:'} {profile.experience}</li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return profile.name && profile.age && profile.gender
      case 1:
        return profile.height && profile.weight
      case 2:
        return profile.activityLevel
      case 3:
        return profile.fitnessGoal
      case 4:
        return profile.targetWeight && (profile.fitnessGoal === 'maintain' || profile.weeklyGoal)
      case 5:
        return profile.workoutFrequency !== undefined && profile.experience
      case 6:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/20 flex items-center justify-center p-4" dir={direction}>
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className={`flex items-center justify-between mb-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              {language === 'ar' ? `خطوة ${currentStep + 1} من ${totalSteps}` : `Step ${currentStep + 1} of ${totalSteps}`}
            </Badge>
            <div className="text-sm text-muted-foreground ltr-numbers">
              {Math.round(progress)}% {language === 'ar' ? 'مكتمل' : 'Complete'}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <Card className="backdrop-blur-sm bg-card/80 shadow-xl border-0">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className={`flex justify-between mt-6 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`bg-white/50 backdrop-blur-sm ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft size={16} className={`${direction === 'rtl' ? 'ml-2 rtl-flip' : 'mr-2'}`} />
            {language === 'ar' ? 'السابق' : 'Previous'}
          </Button>
          
          {currentStep === totalSteps - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid()}
              size="lg"
              className={`bg-primary hover:bg-primary/90 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <Heart size={16} className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'ابدأ رحلتي' : 'Start My Journey'}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              size="lg"
              className={`${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              {language === 'ar' ? 'التالي' : 'Next'}
              <ArrowRight size={16} className={`${direction === 'rtl' ? 'mr-2 rtl-flip' : 'ml-2'}`} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}