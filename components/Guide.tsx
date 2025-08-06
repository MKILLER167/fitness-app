"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { BookOpen, Heart, Target, Zap, Clock, TrendingUp, Search, Star, Play, Users, Lightbulb, Brain, Utensils, Dumbbell, Moon, Droplets, Coffee, Timer, Award, ChevronRight, Filter, Calendar, CheckCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useLanguage } from './LanguageContext'

interface UserProfile {
  name?: string
  fitnessLevel?: string
}

interface GuideProps {
  userProfile?: UserProfile
  subscriptionTier?: 'free' | 'premium' | 'pro'
  onPremiumFeatureAccess?: (featureName: string) => boolean
}

export function Guide({ userProfile, subscriptionTier = 'free', onPremiumFeatureAccess }: GuideProps) {
  const { t, direction } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  // Enhanced fitness guides with more comprehensive content
  const fitnessGuides = [
    {
      category: 'Nutrition',
      categoryAr: 'التغذية',
      icon: Heart,
      color: 'text-red-500',
      articles: [
        {
          title: 'Calorie Counting Basics',
          titleAr: 'أساسيات حساب السعرات الحرارية',
          description: 'Learn how to track calories effectively for weight management and body composition goals',
          descriptionAr: 'تعلم كيفية تتبع السعرات الحرارية بفعالية لإدارة الوزن وأهداف تركيب الجسم',
          readTime: '5 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: true,
          rating: 4.8,
          views: 12450
        },
        {
          title: 'Macronutrient Balance',
          titleAr: 'توازن المغذيات الكبرى',
          description: 'Understanding proteins, carbohydrates, and fats in your diet for optimal performance',
          descriptionAr: 'فهم البروتينات والكربوهيدرات والدهون في نظامك الغذائي للأداء الأمثل',
          readTime: '8 min',
          difficulty: 'Intermediate',
          difficultyAr: 'متوسط',
          featured: false,
          rating: 4.6,
          views: 9870
        },
        {
          title: 'Meal Prep Strategies',
          titleAr: 'استراتيجيات تحضير الوجبات',
          description: 'How to prepare healthy meals for the week ahead and save time',
          descriptionAr: 'كيفية تحضير وجبات صحية للأسبوع القادم وتوفير الوقت',
          readTime: '10 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: true,
          rating: 4.9,
          views: 15230
        },
        {
          title: 'Hydration Guidelines',
          titleAr: 'إرشادات الترطيب',
          description: 'The importance of water intake for fitness goals and daily performance',
          descriptionAr: 'أهمية تناول الماء لأهداف اللياقة والأداء اليومي',
          readTime: '4 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: false,
          rating: 4.7,
          views: 8650
        },
        {
          title: 'Supplements Guide',
          titleAr: 'دليل المكملات الغذائية',
          description: 'Essential supplements for fitness enthusiasts and when to use them',
          descriptionAr: 'المكملات الأساسية لعشاق اللياقة ومتى تستخدمها',
          readTime: '12 min',
          difficulty: 'Advanced',
          difficultyAr: 'متقدم',
          featured: false,
          rating: 4.5,
          views: 7890
        }
      ]
    },
    {
      category: 'Exercise',
      categoryAr: 'التمارين',
      icon: Zap,
      color: 'text-yellow-500',
      articles: [
        {
          title: 'HIIT vs Steady Cardio',
          titleAr: 'الهيت مقابل الكارديو الثابت',
          description: 'Compare different cardio approaches for fat loss and cardiovascular health',
          descriptionAr: 'مقارنة بين طرق الكارديو المختلفة لفقدان الدهون وصحة القلب',
          readTime: '7 min',
          difficulty: 'Intermediate',
          difficultyAr: 'متوسط',
          featured: true,
          rating: 4.8,
          views: 18750
        },
        {
          title: 'Strength Training Basics',
          titleAr: 'أساسيات تدريب القوة',
          description: 'Getting started with resistance training safely and effectively',
          descriptionAr: 'البدء في تدريب المقاومة بأمان وفعالية',
          readTime: '12 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: true,
          rating: 4.9,
          views: 22100
        },
        {
          title: 'Recovery and Rest Days',
          titleAr: 'التعافي وأيام الراحة',
          description: 'Why rest is crucial for fitness progress and how to optimize recovery',
          descriptionAr: 'لماذا الراحة مهمة لتقدم اللياقة وكيفية تحسين التعافي',
          readTime: '6 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: false,
          rating: 4.7,
          views: 11340
        },
        {
          title: 'Progressive Overload',
          titleAr: 'التحميل التدريجي',
          description: 'How to gradually increase workout intensity for continuous improvement',
          descriptionAr: 'كيفية زيادة شدة التمرين تدريجياً للتحسن المستمر',
          readTime: '9 min',
          difficulty: 'Advanced',
          difficultyAr: 'متقدم',
          featured: false,
          rating: 4.6,
          views: 9450
        },
        {
          title: 'Home Workout Guide',
          titleAr: 'دليل التمارين المنزلية',
          description: 'Effective exercises you can do at home without equipment',
          descriptionAr: 'تمارين فعالة يمكنك القيام بها في المنزل بدون معدات',
          readTime: '8 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: true,
          rating: 4.8,
          views: 16780
        }
      ]
    },
    {
      category: 'Wellness',
      categoryAr: 'العافية',
      icon: Target,
      color: 'text-blue-500',
      articles: [
        {
          title: 'Sleep and Fitness',
          titleAr: 'النوم واللياقة',
          description: 'How quality sleep affects your fitness goals and recovery',
          descriptionAr: 'كيف يؤثر النوم الجيد على أهداف اللياقة والتعافي',
          readTime: '6 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: false,
          rating: 4.7,
          views: 13450
        },
        {
          title: 'Stress Management',
          titleAr: 'إدارة التوتر',
          description: 'Techniques to manage stress for better health and performance',
          descriptionAr: 'تقنيات إدارة التوتر لصحة وأداء أفضل',
          readTime: '8 min',
          difficulty: 'Intermediate',
          difficultyAr: 'متوسط',
          featured: true,
          rating: 4.8,
          views: 14890
        },
        {
          title: 'Setting SMART Goals',
          titleAr: 'وضع أهداف ذكية',
          description: 'Create achievable and measurable fitness objectives',
          descriptionAr: 'إنشاء أهداف لياقة قابلة للتحقيق والقياس',
          readTime: '5 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: false,
          rating: 4.6,
          views: 10230
        },
        {
          title: 'Mind-Body Connection',
          titleAr: 'الصلة بين العقل والجسد',
          description: 'The psychological aspects of fitness and health',
          descriptionAr: 'الجوانب النفسية للياقة والصحة',
          readTime: '10 min',
          difficulty: 'Intermediate',
          difficultyAr: 'متوسط',
          featured: false,
          rating: 4.5,
          views: 8760
        }
      ]
    },
    {
      category: 'Psychology',
      categoryAr: 'علم النفس',
      icon: Brain,
      color: 'text-purple-500',
      articles: [
        {
          title: 'Motivation Techniques',
          titleAr: 'تقنيات التحفيز',
          description: 'Stay motivated throughout your fitness journey',
          descriptionAr: 'ابق متحفزاً طوال رحلة اللياقة البدنية',
          readTime: '7 min',
          difficulty: 'Beginner',
          difficultyAr: 'مبتدئ',
          featured: true,
          rating: 4.9,
          views: 19650
        },
        {
          title: 'Habit Formation',
          titleAr: 'تكوين العادات',
          description: 'How to build lasting healthy habits',
          descriptionAr: 'كيفية بناء عادات صحية دائمة',
          readTime: '9 min',
          difficulty: 'Intermediate',
          difficultyAr: 'متوسط',
          featured: false,
          rating: 4.7,
          views: 12340
        }
      ]
    }
  ]

  // Enhanced daily tips with more variety
  const dailyTips = [
    {
      icon: Droplets,
      title: direction === 'rtl' ? 'نصيحة الترطيب' : 'Hydration Tip',
      content: direction === 'rtl' ? 'اشرب كوب ماء قبل كل وجبة لتعزيز عملية الأيض' : 'Drink a glass of water before each meal to boost metabolism',
      category: direction === 'rtl' ? 'التغذية' : 'Nutrition',
      difficulty: direction === 'rtl' ? 'مبتدئ' : 'Beginner'
    },
    {
      icon: Dumbbell,
      title: direction === 'rtl' ? 'نصيحة التمرين' : 'Exercise Tip',
      content: direction === 'rtl' ? 'جرب التمارين المركبة مثل السكوات والرفعة الميتة للحصول على أقصى تفاعل عضلي' : 'Try compound movements like squats and deadlifts for maximum muscle engagement',
      category: direction === 'rtl' ? 'التمرين' : 'Workout',
      difficulty: direction === 'rtl' ? 'متوسط' : 'Intermediate'
    },
    {
      icon: Moon,
      title: direction === 'rtl' ? 'نصيحة التعافي' : 'Recovery Tip',
      content: direction === 'rtl' ? 'اهدف للحصول على 7-9 ساعات من النوم الج��د للتعافي الأمثل للعضلات' : 'Aim for 7-9 hours of quality sleep for optimal muscle recovery',
      category: direction === 'rtl' ? 'التعافي' : 'Recovery',
      difficulty: direction === 'rtl' ? 'مبتدئ' : 'Beginner'
    },
    {
      icon: Brain,
      title: direction === 'rtl' ? 'نصيحة نفسية' : 'Mental Tip',
      content: direction === 'rtl' ? 'احتفل بالانتصارات الصغيرة - كل خطوة تقدم تستحق الاعتراف' : 'Celebrate small wins - every step forward deserves recognition',
      category: direction === 'rtl' ? 'علم النفس' : 'Psychology',
      difficulty: direction === 'rtl' ? 'مبتدئ' : 'Beginner'
    },
    {
      icon: Coffee,
      title: direction === 'rtl' ? 'نصيحة الطاقة' : 'Energy Tip',
      content: direction === 'rtl' ? 'تناول كوب من القهوة الخضراء 30 دقيقة قبل التمرين لتعزيز الأداء' : 'Have a cup of green coffee 30 minutes before workout for enhanced performance',
      category: direction === 'rtl' ? 'التغذية' : 'Nutrition',
      difficulty: direction === 'rtl' ? 'متقدم' : 'Advanced'
    },
    {
      icon: Timer,
      title: direction === 'rtl' ? 'نصيحة الوقت' : 'Time Tip',
      content: direction === 'rtl' ? 'استخدم تقنية البومودورو: 25 دقيقة تمرين، 5 دقائق راحة' : 'Use Pomodoro technique: 25 minutes workout, 5 minutes rest',
      category: direction === 'rtl' ? 'التمرين' : 'Workout',
      difficulty: direction === 'rtl' ? 'متوسط' : 'Intermediate'
    }
  ]

  // Get random daily tips (rotate daily)
  const getTodaysTips = () => {
    const today = new Date().getDate()
    const shuffled = [...dailyTips].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  const todaysTips = getTodaysTips()

  const getDifficultyColor = (difficulty: string) => {
    const difficultyKey = direction === 'rtl' ? 
      (difficulty === 'مبتدئ' ? 'Beginner' : difficulty === 'متوسط' ? 'Intermediate' : 'Advanced') : 
      difficulty
    
    switch (difficultyKey) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Filter articles based on search and filters
  const filterArticles = (articles: any[]) => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.titleAr.includes(searchQuery) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.descriptionAr.includes(searchQuery)
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
        article.difficulty === selectedDifficulty ||
        article.difficultyAr === selectedDifficulty
      
      return matchesSearch && matchesDifficulty
    })
  }

  // Get all articles for global search
  const allArticles = fitnessGuides.flatMap(category => 
    category.articles.map(article => ({
      ...article,
      category: category.category,
      categoryAr: category.categoryAr,
      categoryIcon: category.icon,
      categoryColor: category.color
    }))
  )

  const filteredAllArticles = filterArticles(allArticles)

  return (
    <div className={`p-6 space-y-6 pb-32 ${direction === 'rtl' ? 'text-right' : ''}`}>
      {/* Enhanced Header */}
      <div className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <BookOpen className="text-white" size={24} />
          </div>
        </div>
        <h1 className="text-3xl">{direction === 'rtl' ? 'دليل اللياقة البدنية' : 'Fitness Guide & Tips'}</h1>
        <p className="text-muted-foreground">
          {direction === 'rtl' ? 'تعلم وحسن رحلة اللياقة البدنية الخاصة بك' : 'Learn and improve your fitness journey with expert guidance'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200">
            📚 {allArticles.length} {direction === 'rtl' ? 'مقال' : 'Articles'}
          </Badge>
          <Badge variant="outline" className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
            💡 {dailyTips.length} {direction === 'rtl' ? 'نصيحة يومية' : 'Daily Tips'}
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className={`absolute top-3 ${direction === 'rtl' ? 'right-3' : 'left-3'} text-muted-foreground`} size={16} />
              <Input
                placeholder={direction === 'rtl' ? 'ابحث عن المقالات والنصائح...' : 'Search articles and tips...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={direction === 'rtl' ? 'pr-10' : 'pl-10'}
              />
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Filter size={16} className="text-muted-foreground" />
              <Button
                variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty('all')}
              >
                {direction === 'rtl' ? 'الكل' : 'All Levels'}
              </Button>
              <Button
                variant={selectedDifficulty === 'Beginner' || selectedDifficulty === 'مبتدئ' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(direction === 'rtl' ? 'مبتدئ' : 'Beginner')}
              >
                {direction === 'rtl' ? 'مبتدئ' : 'Beginner'}
              </Button>
              <Button
                variant={selectedDifficulty === 'Intermediate' || selectedDifficulty === 'متوسط' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(direction === 'rtl' ? 'متوسط' : 'Intermediate')}
              >
                {direction === 'rtl' ? 'متوسط' : 'Intermediate'}
              </Button>
              <Button
                variant={selectedDifficulty === 'Advanced' || selectedDifficulty === 'متقدم' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(direction === 'rtl' ? 'متقدم' : 'Advanced')}
              >
                {direction === 'rtl' ? 'متقدم' : 'Advanced'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Daily Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-yellow-500" size={24} />
            {direction === 'rtl' ? 'نصائح اليوم' : "Today's Tips"}
            <Badge variant="secondary" className="ml-auto">
              <Calendar size={12} className="mr-1" />
              {new Date().toLocaleDateString(direction === 'rtl' ? 'ar-SA' : 'en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysTips.map((tip, index) => (
              <div key={index} className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg">
                    <tip.icon className="text-purple-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{tip.title}</h4>
                      <Badge variant="outline" className="text-xs">{tip.category}</Badge>
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(tip.difficulty)}`}>
                        {tip.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.content}</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <CheckCircle size={16} className="text-green-500" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Lightbulb size={16} className="mr-2" />
              {direction === 'rtl' ? 'عرض المزيد من النصائح' : 'View More Tips'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guide Categories with Enhanced Design */}
      <Tabs defaultValue={searchQuery ? "all" : "Nutrition"} className="w-full">
        <TabsList className={`grid w-full ${searchQuery ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {searchQuery && (
            <TabsTrigger value="all">
              {direction === 'rtl' ? 'جميع النتائج' : 'All Results'} ({filteredAllArticles.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="Nutrition">{direction === 'rtl' ? 'التغذية' : 'Nutrition'}</TabsTrigger>
          <TabsTrigger value="Exercise">{direction === 'rtl' ? 'التمارين' : 'Exercise'}</TabsTrigger>
          <TabsTrigger value="Wellness">{direction === 'rtl' ? 'العافية' : 'Wellness'}</TabsTrigger>
        </TabsList>

        {/* All Results Tab (when searching) */}
        {searchQuery && (
          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="text-blue-500" size={20} />
              <h3>{direction === 'rtl' ? 'نتائج البحث' : 'Search Results'}</h3>
              <Badge variant="outline">{filteredAllArticles.length} {direction === 'rtl' ? 'نتيجة' : 'results'}</Badge>
            </div>
            
            {filteredAllArticles.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>{direction === 'rtl' ? 'لم يتم العثور على نتائج' : 'No results found'}</p>
                  <p className="text-sm mt-2">
                    {direction === 'rtl' ? 'جرب مصطلحات بحث مختلفة' : 'Try different search terms'}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredAllArticles.map((article, index) => {
                  const Icon = article.categoryIcon
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className={article.categoryColor} size={16} />
                              <Badge variant="outline" className="text-xs">
                                {direction === 'rtl' ? article.categoryAr : article.category}
                              </Badge>
                              {article.featured && (
                                <Badge className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800">
                                  <Star size={10} className="mr-1" />
                                  {direction === 'rtl' ? 'مميز' : 'Featured'}
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium mb-2 group-hover:text-primary transition-colors">
                              {direction === 'rtl' ? article.titleAr : article.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                              {direction === 'rtl' ? article.descriptionAr : article.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getDifficultyColor(direction === 'rtl' ? article.difficultyAr : article.difficulty)}`}
                              >
                                {direction === 'rtl' ? article.difficultyAr : article.difficulty}
                              </Badge>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock size={12} />
                                {article.readTime}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star size={12} />
                                {article.rating}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users size={12} />
                                {article.views.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-4">
                            <Play size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        )}

        {/* Category-specific tabs */}
        {fitnessGuides.map((category) => {
          const Icon = category.icon
          const filteredArticles = filterArticles(category.articles)
          
          return (
            <TabsContent key={category.category} value={category.category} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon className={category.color} size={24} />
                <h3>{direction === 'rtl' ? category.categoryAr : category.category} {direction === 'rtl' ? 'مقالات' : 'Articles'}</h3>
                <Badge variant="outline">{filteredArticles.length} {direction === 'rtl' ? 'مقال' : 'articles'}</Badge>
              </div>
              
              {/* Featured articles first */}
              {filteredArticles.filter(article => article.featured).length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="flex items-center gap-2 font-medium text-sm">
                    <Star className="text-yellow-500" size={16} />
                    {direction === 'rtl' ? 'المقالات المميزة' : 'Featured Articles'}
                  </h4>
                  {filteredArticles.filter(article => article.featured).map((article, index) => (
                    <Card key={`featured-${index}`} className="hover:shadow-md transition-shadow cursor-pointer group bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800">
                                <Star size={10} className="mr-1" />
                                {direction === 'rtl' ? 'مميز' : 'Featured'}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getDifficultyColor(direction === 'rtl' ? article.difficultyAr : article.difficulty)}`}
                              >
                                {direction === 'rtl' ? article.difficultyAr : article.difficulty}
                              </Badge>
                            </div>
                            <h4 className="font-medium mb-2 group-hover:text-primary transition-colors">
                              {direction === 'rtl' ? article.titleAr : article.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                              {direction === 'rtl' ? article.descriptionAr : article.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock size={12} />
                                {article.readTime}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star size={12} />
                                {article.rating}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users size={12} />
                                {article.views.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Button variant="default" size="sm" className="ml-4">
                            <Play size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Regular articles */}
              <div className="space-y-3">
                {filteredArticles.filter(article => !article.featured).map((article, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2 group-hover:text-primary transition-colors">
                            {direction === 'rtl' ? article.titleAr : article.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {direction === 'rtl' ? article.descriptionAr : article.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getDifficultyColor(direction === 'rtl' ? article.difficultyAr : article.difficulty)}`}
                            >
                              {direction === 'rtl' ? article.difficultyAr : article.difficulty}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock size={12} />
                              {article.readTime}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star size={12} />
                              {article.rating}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users size={12} />
                              {article.views.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-4">
                          <BookOpen size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Community Section */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-green-500" size={20} />
            {direction === 'rtl' ? 'مجتمع اللياقة' : 'Fitness Community'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {direction === 'rtl' ? 
                'انضم إلى مجتمعنا المتنامي من عشاق اللياقة البدنية. شارك تجربتك، واطلب المشورة، وحفز الآخرين.' :
                'Join our growing community of fitness enthusiasts. Share your experience, seek advice, and motivate others.'
              }
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-bold text-lg text-green-600">12.5k</div>
                  <div className="text-xs text-muted-foreground">{direction === 'rtl' ? 'الأعضاء' : 'Members'}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-600">2.3k</div>
                  <div className="text-xs text-muted-foreground">{direction === 'rtl' ? 'منشورات اليوم' : 'Posts Today'}</div>
                </div>
              </div>
              <Button>
                <Users size={16} className="mr-2" />
                {direction === 'rtl' ? 'انضم الآن' : 'Join Now'}
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}