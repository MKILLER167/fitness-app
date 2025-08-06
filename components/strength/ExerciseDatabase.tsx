import { useState } from 'react'
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { Plus, Search, Clock, Target, Zap, Trophy, Play } from 'lucide-react'
import type { Exercise } from './exerciseDatabase'
import { EQUIPMENT_CATEGORIES, DIFFICULTY_LEVELS } from './exerciseDatabase'
import { useLanguage } from '../LanguageContext'

interface ExerciseDatabaseProps {
  exercises: Exercise[]
  personalRecords?: { [exerciseId: string]: { weight: number, maxReps: number, date: Date } }
  onExerciseSelect: (exercise: Exercise) => void
  onPremiumFeatureAccess?: (featureName: string) => boolean
  userSubscriptionTier?: string
}

export function ExerciseDatabase({ 
  exercises, 
  personalRecords = {}, 
  onExerciseSelect, 
  onPremiumFeatureAccess,
  userSubscriptionTier = 'free'
}: ExerciseDatabaseProps) {
  const { language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const categories = ['all', 'chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'functional'] as const

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesEquipment = selectedEquipment === 'all' || exercise.equipment.includes(selectedEquipment)
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty
    
    return matchesSearch && matchesEquipment && matchesDifficulty
  })

  const isPremiumExercise = (exercise: Exercise) => {
    return exercise.difficulty === 'advanced' || exercise.category === 'functional'
  }

  const canAccessExercise = (exercise: Exercise) => {
    if (!isPremiumExercise(exercise)) return true
    return userSubscriptionTier !== 'free'
  }

  const handleExerciseSelect = (exercise: Exercise) => {
    if (!canAccessExercise(exercise)) {
      onPremiumFeatureAccess?.('Advanced Exercises')
      return
    }
    onExerciseSelect(exercise)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      chest: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      back: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      shoulders: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      arms: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      legs: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      core: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      cardio: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      functional: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const ExerciseDetailDialog = ({ exercise }: { exercise: Exercise }) => (
    <DialogContent className="max-w-2xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          {exercise.name}
          <div className="flex gap-2">
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {DIFFICULTY_LEVELS[exercise.difficulty]}
            </Badge>
            <Badge className={getCategoryColor(exercise.category)}>
              {exercise.category}
            </Badge>
            {isPremiumExercise(exercise) && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                <Trophy size={12} className="mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="max-h-[70vh]">
        <div className="space-y-6">
          {/* Exercise Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exercise.repsRange && (
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Target size={20} className="mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">{language === 'ar' ? 'التكرارات' : 'Reps'}</div>
                <div className="text-xs text-muted-foreground">{exercise.repsRange}</div>
              </div>
            )}
            {exercise.setsRange && (
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Zap size={20} className="mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">{language === 'ar' ? 'المجموعات' : 'Sets'}</div>
                <div className="text-xs text-muted-foreground">{exercise.setsRange}</div>
              </div>
            )}
            {exercise.restTime && (
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Clock size={20} className="mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">{language === 'ar' ? 'الراحة' : 'Rest'}</div>
                <div className="text-xs text-muted-foreground">{exercise.restTime}</div>
              </div>
            )}
            {exercise.caloriesPerMinute && (
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Zap size={20} className="mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">{language === 'ar' ? 'السعرات' : 'Calories'}</div>
                <div className="text-xs text-muted-foreground">{exercise.caloriesPerMinute}/min</div>
              </div>
            )}
          </div>

          {/* Equipment */}
          <div>
            <h4 className="font-medium mb-2">{language === 'ar' ? 'المعدات المطلوبة' : 'Equipment Needed'}</h4>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map(equipment => (
                <Badge key={equipment} variant="outline">
                  {EQUIPMENT_CATEGORIES[equipment as keyof typeof EQUIPMENT_CATEGORIES] || equipment}
                </Badge>
              ))}
            </div>
          </div>

          {/* Muscles */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">{language === 'ar' ? 'العضلات الأساسية' : 'Primary Muscles'}</h4>
              <div className="flex flex-wrap gap-1">
                {exercise.primaryMuscles.map(muscle => (
                  <Badge key={muscle} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {muscle.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">{language === 'ar' ? 'العضلات الثانوية' : 'Secondary Muscles'}</h4>
              <div className="flex flex-wrap gap-1">
                {exercise.secondaryMuscles.map(muscle => (
                  <Badge key={muscle} variant="outline">
                    {muscle.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          <div>
            <h4 className="font-medium mb-3">{language === 'ar' ? 'التعليمات' : 'Instructions'}</h4>
            <ol className="space-y-2">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-sm">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-medium mb-3">{language === 'ar' ? 'نصائح' : 'Tips'}</h4>
            <ul className="space-y-2">
              {exercise.tips.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Variations */}
          {exercise.variations && exercise.variations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">{language === 'ar' ? 'التنويعات' : 'Variations'}</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.variations.map(variation => (
                  <Badge key={variation} variant="secondary">
                    {variation}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {exercise.benefits && exercise.benefits.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">{language === 'ar' ? 'الفوائد' : 'Benefits'}</h4>
              <ul className="grid md:grid-cols-2 gap-1">
                {exercise.benefits.map(benefit => (
                  <li key={benefit} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Mistakes */}
          {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-red-600">{language === 'ar' ? 'أخطاء شائعة' : 'Common Mistakes'}</h4>
              <ul className="space-y-1">
                {exercise.commonMistakes.map(mistake => (
                  <li key={mistake} className="flex items-center gap-2 text-sm text-red-600">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Personal Record */}
          {personalRecords[exercise.id] && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                {language === 'ar' ? 'الرقم القياسي الشخصي' : 'Personal Record'}
              </h4>
              <div className="text-sm text-green-700 dark:text-green-300">
                <span className="font-medium">{personalRecords[exercise.id].weight}kg</span> × 
                <span className="font-medium"> {personalRecords[exercise.id].maxReps} reps</span>
                <div className="text-xs mt-1">
                  {new Date(personalRecords[exercise.id].date).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  )

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder={language === 'ar' ? 'البحث في التمارين...' : 'Search exercises...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'ar' ? 'المعدات' : 'Equipment'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'جميع المعدات' : 'All Equipment'}</SelectItem>
              {Object.entries(EQUIPMENT_CATEGORIES).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'ar' ? 'المستوى' : 'Difficulty'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'جميع المستويات' : 'All Levels'}</SelectItem>
              {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Exercise Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-9">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize text-xs">
              {category === 'all' ? (language === 'ar' ? 'الكل' : 'All') : category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises
                .filter(exercise => category === 'all' || exercise.category === category)
                .map(exercise => {
                  const pr = personalRecords[exercise.id]
                  const isLocked = !canAccessExercise(exercise)
                  
                  return (
                    <Card key={exercise.id} className={`hover:bg-accent/50 transition-all duration-200 ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium leading-tight">{exercise.name}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getDifficultyColor(exercise.difficulty)} variant="outline">
                                {exercise.difficulty}
                              </Badge>
                              <Badge className={getCategoryColor(exercise.category)} variant="outline">
                                {exercise.category}
                              </Badge>
                              {isPremiumExercise(exercise) && (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                  <Trophy size={10} className="mr-1" />
                                  Pro
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Play size={14} />
                                </Button>
                              </DialogTrigger>
                              <ExerciseDetailDialog exercise={exercise} />
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExerciseSelect(exercise)}
                              disabled={isLocked}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0 space-y-3">
                        {pr && (
                          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                            <div className="text-sm text-green-800 dark:text-green-200">
                              <span className="font-medium">PR: </span>
                              {pr.weight}kg × {pr.maxReps} reps
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">{language === 'ar' ? 'أساسية:' : 'Primary:'} </span>
                            <span className="text-muted-foreground">
                              {exercise.primaryMuscles.slice(0, 2).join(', ')}
                              {exercise.primaryMuscles.length > 2 && '...'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{language === 'ar' ? 'المعدات:' : 'Equipment:'} </span>
                            <span className="text-muted-foreground">
                              {exercise.equipment.slice(0, 2).map(eq => 
                                EQUIPMENT_CATEGORIES[eq as keyof typeof EQUIPMENT_CATEGORIES] || eq
                              ).join(', ')}
                              {exercise.equipment.length > 2 && '...'}
                            </span>
                          </div>
                          {exercise.caloriesPerMinute && (
                            <div className="text-sm">
                              <span className="font-medium">{language === 'ar' ? 'السعرات:' : 'Calories:'} </span>
                              <span className="text-muted-foreground">{exercise.caloriesPerMinute}/min</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
            
            {filteredExercises.filter(exercise => category === 'all' || exercise.category === category).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target size={48} className="mx-auto mb-4 opacity-50" />
                <p>{language === 'ar' ? 'لم يتم العثور على تمارين' : 'No exercises found'}</p>
                <p className="text-sm">{language === 'ar' ? 'جرب تغيير المرشحات' : 'Try adjusting your filters'}</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}