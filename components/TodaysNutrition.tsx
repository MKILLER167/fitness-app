"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { useLanguage } from './LanguageContext'
import { motion } from 'motion/react'

interface NutritionData {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface TodaysNutritionProps {
  currentNutrition: NutritionData
  targetCalories: number
  className?: string
}

export function TodaysNutrition({ 
  currentNutrition, 
  targetCalories, 
  className = "" 
}: TodaysNutritionProps) {
  const { language, direction } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const caloriesProgress = Math.min((currentNutrition.calories / targetCalories) * 100, 100)
  const remainingCalories = Math.max(0, targetCalories - currentNutrition.calories)

  const LoadingShimmer = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-muted/30 rounded ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-transparent via-muted/50 to-transparent animate-shimmer" />
    </div>
  )

  return (
    <div className={`space-y-4 ${className}`} dir={direction}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {language === 'ar' ? 'تغذية اليوم' : "Today's Nutrition"}
        </h2>
      </div>

      {/* Calories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-background border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            {isLoading ? (
              <LoadingShimmer className="h-12 w-16 mx-auto mb-2" />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="text-3xl font-bold text-primary ltr-numbers">
                  {currentNutrition.calories}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'سعرة حرارية' : 'calories'}
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="flex-1 mx-6">
            {isLoading ? (
              <LoadingShimmer className="h-2 w-full" />
            ) : (
              <div className="relative">
                <Progress 
                  value={caloriesProgress} 
                  className="h-2 bg-muted"
                />
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/30 to-primary/10 rounded-full"
                  style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                  transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                />
              </div>
            )}
          </div>

          <div className="text-right">
            {isLoading ? (
              <LoadingShimmer className="h-6 w-12 ml-auto mb-1" />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'متبقي' : 'remaining'}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress details */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className="ltr-numbers">{targetCalories}</span>
        </div>
      </motion.div>

      {/* Macronutrients Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Protein */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/30 hover:shadow-sm transition-all duration-200">
            <CardContent className="p-4 text-center">
              {isLoading ? (
                <>
                  <LoadingShimmer className="h-4 w-12 mx-auto mb-2" />
                  <LoadingShimmer className="h-6 w-8 mx-auto" />
                </>
              ) : (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-1">
                    {language === 'ar' ? 'البروتين' : 'Protein'}
                  </div>
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300 ltr-numbers">
                    {Math.round(currentNutrition.protein)}g
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Carbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/30 hover:shadow-sm transition-all duration-200">
            <CardContent className="p-4 text-center">
              {isLoading ? (
                <>
                  <LoadingShimmer className="h-4 w-12 mx-auto mb-2" />
                  <LoadingShimmer className="h-6 w-8 mx-auto" />
                </>
              ) : (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="text-green-600 dark:text-green-400 font-medium text-sm mb-1">
                    {language === 'ar' ? 'الكربوهيدرات' : 'Carbs'}
                  </div>
                  <div className="text-xl font-bold text-green-700 dark:text-green-300 ltr-numbers">
                    {Math.round(currentNutrition.carbs)}g
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Fat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <Card className="bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-800/30 hover:shadow-sm transition-all duration-200">
            <CardContent className="p-4 text-center">
              {isLoading ? (
                <>
                  <LoadingShimmer className="h-4 w-12 mx-auto mb-2" />
                  <LoadingShimmer className="h-6 w-8 mx-auto" />
                </>
              ) : (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-orange-600 dark:text-orange-400 font-medium text-sm mb-1">
                    {language === 'ar' ? 'الدهون' : 'Fat'}
                  </div>
                  <div className="text-xl font-bold text-orange-700 dark:text-orange-300 ltr-numbers">
                    {Math.round(currentNutrition.fat)}g
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Remaining */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-800/30 hover:shadow-sm transition-all duration-200">
            <CardContent className="p-4 text-center">
              {isLoading ? (
                <>
                  <LoadingShimmer className="h-4 w-16 mx-auto mb-2" />
                  <LoadingShimmer className="h-6 w-10 mx-auto" />
                </>
              ) : (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="text-purple-600 dark:text-purple-400 font-medium text-sm mb-1">
                    {language === 'ar' ? 'المتبقي' : 'Remaining'}
                  </div>
                  <div className="text-xl font-bold text-purple-700 dark:text-purple-300 ltr-numbers">
                    {remainingCalories}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Text */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground pt-2"
        >
          {caloriesProgress >= 100 ? (
            <span className="text-green-600 dark:text-green-400">
              {language === 'ar' ? '🎉 تم تحقيق الهدف اليومي!' : '🎉 Daily goal achieved!'}
            </span>
          ) : caloriesProgress >= 80 ? (
            <span className="text-orange-600 dark:text-orange-400">
              {language === 'ar' ? 'قريب من الهدف!' : 'Close to your goal!'}
            </span>
          ) : (
            <span>
              {language === 'ar' ? 
                `${Math.round(100 - caloriesProgress)}% متبقي للهدف اليومي` :
                `${Math.round(100 - caloriesProgress)}% remaining for daily goal`
              }
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}