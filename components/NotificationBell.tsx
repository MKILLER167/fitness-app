"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useReminderService } from './ReminderService'
import { useLanguage } from './LanguageContext'
import { toast } from 'sonner@2.0.3'
import { 
  Bell, 
  Plus, 
  Clock, 
  Utensils, 
  Dumbbell, 
  Calendar,
  Settings,
  Trash2,
  Check,
  X,
  TestTube
} from 'lucide-react'

interface NotificationBellProps {
  onNavigate?: (tab: string) => void
}

export function NotificationBell({ onNavigate }: NotificationBellProps) {
  const { reminderService, notifications, unreadCount } = useReminderService()
  const { language, direction } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('notifications')
  const [newReminderData, setNewReminderData] = useState({
    type: 'meal' as 'meal' | 'workout',
    title: '',
    mealType: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    workoutType: '',
    time: '08:00',
    days: [1, 2, 3, 4, 5, 6, 0] as number[], // All days by default
    soundEnabled: true,
    vibrationEnabled: true,
    persistentNotification: false,
    customMessage: ''
  })

  const dayNames = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
  }

  const mealTypes = {
    breakfast: language === 'ar' ? 'الإفطار' : 'Breakfast',
    lunch: language === 'ar' ? 'الغداء' : 'Lunch', 
    dinner: language === 'ar' ? 'العشاء' : 'Dinner',
    snack: language === 'ar' ? 'وجبة خفيفة' : 'Snack'
  }

  // Load existing reminders
  const [mealReminders, setMealReminders] = useState(reminderService.getMealReminders())
  const [workoutReminders, setWorkoutReminders] = useState(reminderService.getWorkoutReminders())

  useEffect(() => {
    // Refresh reminders when component mounts
    setMealReminders(reminderService.getMealReminders())
    setWorkoutReminders(reminderService.getWorkoutReminders())
  }, [reminderService, isOpen])

  const handleDayToggle = (dayIndex: number) => {
    setNewReminderData(prev => ({
      ...prev,
      days: prev.days.includes(dayIndex) 
        ? prev.days.filter(d => d !== dayIndex)
        : [...prev.days, dayIndex]
    }))
  }

  const handleAddReminder = async () => {
    if (!newReminderData.title.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال عنوان التذكير' : 'Please enter reminder title')
      return
    }

    if (newReminderData.days.length === 0) {
      toast.error(language === 'ar' ? 'يرجى اختيار يوم واحد على الأقل' : 'Please select at least one day')
      return
    }

    try {
      if (newReminderData.type === 'meal') {
        await reminderService.addMealReminder({
          title: newReminderData.title,
          mealType: newReminderData.mealType,
          time: newReminderData.time,
          days: newReminderData.days,
          isActive: true,
          soundEnabled: newReminderData.soundEnabled,
          vibrationEnabled: newReminderData.vibrationEnabled,
          persistentNotification: newReminderData.persistentNotification,
          customMessage: newReminderData.customMessage
        })
      } else {
        await reminderService.addWorkoutReminder({
          title: newReminderData.title,
          workoutType: newReminderData.workoutType || 'General Workout',
          time: newReminderData.time,
          days: newReminderData.days,
          isActive: true,
          soundEnabled: newReminderData.soundEnabled,
          vibrationEnabled: newReminderData.vibrationEnabled,
          customMessage: newReminderData.customMessage
        })
      }

      // Reset form
      setNewReminderData({
        type: 'meal',
        title: '',
        mealType: 'breakfast',
        workoutType: '',
        time: '08:00',
        days: [1, 2, 3, 4, 5, 6, 0],
        soundEnabled: true,
        vibrationEnabled: true,
        persistentNotification: false,
        customMessage: ''
      })

      // Refresh reminders
      setMealReminders(reminderService.getMealReminders())
      setWorkoutReminders(reminderService.getWorkoutReminders())
      
      setActiveTab('manage')
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في إضافة التذكير' : 'Failed to add reminder')
    }
  }

  const handleDeleteReminder = (id: string, type: 'meal' | 'workout') => {
    if (type === 'meal') {
      reminderService.deleteMealReminder(id)
      setMealReminders(reminderService.getMealReminders())
    } else {
      reminderService.deleteWorkoutReminder(id)
      setWorkoutReminders(reminderService.getWorkoutReminders())
    }
  }

  const handleToggleReminder = (id: string, type: 'meal' | 'workout', currentStatus: boolean) => {
    if (type === 'meal') {
      reminderService.updateMealReminder(id, { isActive: !currentStatus })
      setMealReminders(reminderService.getMealReminders())
    } else {
      reminderService.updateWorkoutReminder(id, { isActive: !currentStatus })
      setWorkoutReminders(reminderService.getWorkoutReminders())
    }
  }

  const handleNotificationAction = (notification: any) => {
    if (notification.type === 'meal') {
      onNavigate?.('meals')
    } else if (notification.type === 'workout') {
      onNavigate?.('workouts')
    }
    reminderService.markNotificationAsRead(notification.id)
    setIsOpen(false)
  }

  const handleQuickMealReminders = () => {
    const promises = [
      reminderService.addQuickMealReminder('breakfast', '08:00'),
      reminderService.addQuickMealReminder('lunch', '12:30'),
      reminderService.addQuickMealReminder('dinner', '18:30')
    ]

    Promise.all(promises).then(() => {
      setMealReminders(reminderService.getMealReminders())
      toast.success(language === 'ar' ? 'تم إضافة تذكيرات الوجبات السريعة' : 'Quick meal reminders added!')
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDays = (days: number[]) => {
    if (days.length === 7) return language === 'ar' ? 'يومياً' : 'Daily'
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) {
      return language === 'ar' ? 'أيام الأسبوع' : 'Weekdays'
    }
    if (days.length === 2 && days.includes(0) && days.includes(6)) {
      return language === 'ar' ? 'عطلة نهاية الأسبوع' : 'Weekends'
    }
    
    const dayList = language === 'ar' ? dayNames.ar : dayNames.en
    return days.map(d => dayList[d]).join(', ')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[80vh] p-0" dir={direction}>
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {language === 'ar' ? 'التذكيرات والإشعارات' : 'Reminders & Notifications'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notifications" className="text-xs">
                {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="add" className="text-xs">
                {language === 'ar' ? 'إضافة' : 'Add'}
              </TabsTrigger>
              <TabsTrigger value="manage" className="text-xs">
                {language === 'ar' ? 'إدارة' : 'Manage'}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="h-full mt-0">
              <ScrollArea className="h-96 px-6">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <Card 
                        key={notification.id} 
                        className={`cursor-pointer transition-all ${
                          !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
                        }`}
                        onClick={() => handleNotificationAction(notification)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              notification.type === 'meal' ? 'bg-orange-100 dark:bg-orange-950/30' : 'bg-blue-100 dark:bg-blue-950/30'
                            }`}>
                              {notification.type === 'meal' ? (
                                <Utensils className={`h-4 w-4 ${notification.type === 'meal' ? 'text-orange-500' : 'text-blue-500'}`} />
                              ) : (
                                <Dumbbell className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {notifications.length > 0 && (
                <div className="p-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => reminderService.markAllNotificationsAsRead()}
                    className="w-full"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All as Read'}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Add Reminder Tab */}
            <TabsContent value="add" className="h-full mt-0">
              <ScrollArea className="h-96 px-6">
                <div className="space-y-4 pb-4">
                  {/* Quick Setup */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        {language === 'ar' ? 'إعداد سريع' : 'Quick Setup'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button onClick={handleQuickMealReminders} className="w-full" size="sm">
                        <Utensils className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'تذكيرات الوجبات الأساسية' : 'Basic Meal Reminders'}
                      </Button>
                      
                      <Button 
                        onClick={() => reminderService.addTestReminder()} 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'تذكير تجريبي (دقيقة واحدة)' : 'Test Reminder (1 minute)'}
                      </Button>
                    </CardContent>
                  </Card>

                  <Separator />

                  {/* Custom Reminder */}
                  <div className="space-y-4">
                    <h3 className="font-medium">
                      {language === 'ar' ? 'تذكير مخصص' : 'Custom Reminder'}
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="reminder-type">
                          {language === 'ar' ? 'نوع التذكير' : 'Reminder Type'}
                        </Label>
                        <Select 
                          value={newReminderData.type} 
                          onValueChange={(value: 'meal' | 'workout') => 
                            setNewReminderData(prev => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meal">
                              {language === 'ar' ? 'وجبة' : 'Meal'}
                            </SelectItem>
                            <SelectItem value="workout">
                              {language === 'ar' ? 'تمرين' : 'Workout'}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="reminder-title">
                          {language === 'ar' ? 'عنوان التذكير' : 'Reminder Title'}
                        </Label>
                        <Input
                          id="reminder-title"
                          value={newReminderData.title}
                          onChange={(e) => setNewReminderData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder={language === 'ar' ? 'مثال: تذكير الإفطار' : 'e.g. Breakfast Reminder'}
                        />
                      </div>

                      {newReminderData.type === 'meal' && (
                        <div>
                          <Label htmlFor="meal-type">
                            {language === 'ar' ? 'نوع الوجبة' : 'Meal Type'}
                          </Label>
                          <Select 
                            value={newReminderData.mealType} 
                            onValueChange={(value: any) => 
                              setNewReminderData(prev => ({ ...prev, mealType: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(mealTypes).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {newReminderData.type === 'workout' && (
                        <div>
                          <Label htmlFor="workout-type">
                            {language === 'ar' ? 'نوع التمرين' : 'Workout Type'}
                          </Label>
                          <Input
                            id="workout-type"
                            value={newReminderData.workoutType}
                            onChange={(e) => setNewReminderData(prev => ({ ...prev, workoutType: e.target.value }))}
                            placeholder={language === 'ar' ? 'مثال: تمرين الصدر' : 'e.g. Chest Workout'}
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="reminder-time">
                          {language === 'ar' ? 'الوقت' : 'Time'}
                        </Label>
                        <Input
                          id="reminder-time"
                          type="time"
                          value={newReminderData.time}
                          onChange={(e) => setNewReminderData(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label>{language === 'ar' ? 'الأيام' : 'Days'}</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(language === 'ar' ? dayNames.ar : dayNames.en).map((day, index) => (
                            <Button
                              key={index}
                              variant={newReminderData.days.includes(index) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleDayToggle(index)}
                              className="text-xs"
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sound-enabled">
                            {language === 'ar' ? 'تفعيل الصوت' : 'Enable Sound'}
                          </Label>
                          <Switch
                            id="sound-enabled"
                            checked={newReminderData.soundEnabled}
                            onCheckedChange={(checked) => 
                              setNewReminderData(prev => ({ ...prev, soundEnabled: checked }))
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vibration-enabled">
                            {language === 'ar' ? 'تفعيل الاهتزاز' : 'Enable Vibration'}
                          </Label>
                          <Switch
                            id="vibration-enabled"
                            checked={newReminderData.vibrationEnabled}
                            onCheckedChange={(checked) => 
                              setNewReminderData(prev => ({ ...prev, vibrationEnabled: checked }))
                            }
                          />
                        </div>

                        {newReminderData.type === 'meal' && (
                          <div className="flex items-center justify-between">
                            <Label htmlFor="persistent-notification">
                              {language === 'ar' ? 'إشعار مستمر' : 'Persistent Notification'}
                            </Label>
                            <Switch
                              id="persistent-notification"
                              checked={newReminderData.persistentNotification}
                              onCheckedChange={(checked) => 
                                setNewReminderData(prev => ({ ...prev, persistentNotification: checked }))
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="custom-message">
                          {language === 'ar' ? 'رسالة مخصصة (اختيارية)' : 'Custom Message (Optional)'}
                        </Label>
                        <Input
                          id="custom-message"
                          value={newReminderData.customMessage}
                          onChange={(e) => setNewReminderData(prev => ({ ...prev, customMessage: e.target.value }))}
                          placeholder={language === 'ar' ? 'رسالة التذكير المخصصة' : 'Custom reminder message'}
                        />
                      </div>

                      <Button onClick={handleAddReminder} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'إضافة التذكير' : 'Add Reminder'}
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Manage Reminders Tab */}
            <TabsContent value="manage" className="h-full mt-0">
              <ScrollArea className="h-96 px-6">
                <div className="space-y-4 pb-4">
                  {/* Permission Status */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">
                            {language === 'ar' ? 'إذن الإشعارات' : 'Notification Permission'}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {reminderService.getPermissionStatus() === 'granted' 
                              ? (language === 'ar' ? 'مفعل' : 'Enabled')
                              : (language === 'ar' ? 'معطل' : 'Disabled')
                            }
                          </p>
                        </div>
                        <Badge 
                          variant={reminderService.getPermissionStatus() === 'granted' ? 'secondary' : 'destructive'}
                        >
                          {reminderService.getPermissionStatus()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Meal Reminders */}
                  {mealReminders.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Utensils className="h-4 w-4" />
                        {language === 'ar' ? 'تذكيرات الوجبات' : 'Meal Reminders'}
                      </h3>
                      <div className="space-y-2">
                        {mealReminders.map((reminder) => (
                          <Card key={reminder.id}>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm truncate">{reminder.title}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {mealTypes[reminder.mealType]}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(reminder.time)} • {formatDays(reminder.days)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={reminder.isActive}
                                    onCheckedChange={() => handleToggleReminder(reminder.id, 'meal', reminder.isActive)}
                                    size="sm"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteReminder(reminder.id, 'meal')}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Workout Reminders */}
                  {workoutReminders.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Dumbbell className="h-4 w-4" />
                        {language === 'ar' ? 'تذكيرات التمارين' : 'Workout Reminders'}
                      </h3>
                      <div className="space-y-2">
                        {workoutReminders.map((reminder) => (
                          <Card key={reminder.id}>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm truncate">{reminder.title}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {reminder.workoutType}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(reminder.time)} • {formatDays(reminder.days)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={reminder.isActive}
                                    onCheckedChange={() => handleToggleReminder(reminder.id, 'workout', reminder.isActive)}
                                    size="sm"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteReminder(reminder.id, 'workout')}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {mealReminders.length === 0 && workoutReminders.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {language === 'ar' ? 'لا توجد تذكيرات' : 'No reminders set'}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActiveTab('add')}
                        className="mt-2"
                      >
                        {language === 'ar' ? 'إضافة تذكير' : 'Add Reminder'}
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}