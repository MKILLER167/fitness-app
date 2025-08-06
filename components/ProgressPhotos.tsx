"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { 
  Camera, 
  Calendar, 
  TrendingUp, 
  Download, 
  Share, 
  Plus,
  Grid3X3,
  List,
  Filter,
  Clock,
  Target,
  Ruler
} from 'lucide-react'

export function ProgressPhotos() {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = ['all', 'front', 'side', 'back', 'measurements']
  
  const progressPhotos = [
    {
      id: 1,
      date: '2024-03-15',
      category: 'front',
      weight: 72.5,
      bodyFat: 18.2,
      muscle: 45.8,
      notes: 'Feeling stronger after 3 weeks of consistent training!',
      measurements: { chest: 98, waist: 82, arms: 34 },
      thumbnail: '📸'
    },
    {
      id: 2,
      date: '2024-03-01',
      category: 'side',
      weight: 73.1,
      bodyFat: 19.1,
      muscle: 44.2,
      notes: 'Starting my cutting phase. Ready to see some definition!',
      measurements: { chest: 97, waist: 84, arms: 33 },
      thumbnail: '📷'
    },
    {
      id: 3,
      date: '2024-02-15',
      category: 'front',
      weight: 74.2,
      bodyFat: 20.5,
      muscle: 43.1,
      notes: 'Baseline photos. Let the transformation begin!',
      measurements: { chest: 96, waist: 86, arms: 32 },
      thumbnail: '📱'
    }
  ]

  const achievements = [
    { metric: 'Weight Lost', value: '-1.7 kg', change: '+12%', color: 'green' },
    { metric: 'Body Fat', value: '-2.3%', change: '-11%', color: 'blue' },
    { metric: 'Muscle Gain', value: '+2.7 kg', change: '+6%', color: 'purple' },
    { metric: 'Waist', value: '-4 cm', change: '-5%', color: 'orange' }
  ]

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-2xl">Progress Photos 📸</h1>
        <p className="text-muted-foreground">Visual journey of your transformation</p>
      </div>

      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-500" size={20} />
            Transformation Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((stat, index) => {
              const colorClasses = {
                green: 'bg-green-50 text-green-600 border-green-200',
                blue: 'bg-blue-50 text-blue-600 border-blue-200', 
                purple: 'bg-purple-50 text-purple-600 border-purple-200',
                orange: 'bg-orange-50 text-orange-600 border-orange-200'
              }
              
              return (
                <div key={index} className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]?.split(' ')[0] || 'bg-gray-50'}`}>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${colorClasses[stat.color as keyof typeof colorClasses]?.split(' ')[1] || 'text-gray-600'}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.metric}</div>
                    <Badge variant="outline" className={`mt-1 ${colorClasses[stat.color as keyof typeof colorClasses]?.split(' ').slice(1).join(' ') || 'text-gray-600 border-gray-200'}`}>
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-20 flex-col gap-2 bg-gradient-to-r from-blue-500 to-purple-500">
          <Camera size={24} />
          <span>Take Photo</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Ruler size={24} />
          <span>Log Measurements</span>
        </Button>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <List size={16} />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Progress Photos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4">
          {progressPhotos.map(photo => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">
                {photo.thumbnail}
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {photo.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(photo.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{photo.weight} kg</div>
                  <div className="text-muted-foreground">{photo.bodyFat}% BF</div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add Photo Card */}
          <Card className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="aspect-square flex flex-col items-center justify-center text-muted-foreground">
              <Plus size={32} className="mb-2" />
              <span className="text-sm">Add Photo</span>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {progressPhotos.map(photo => (
            <Card key={photo.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {photo.thumbnail}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{photo.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(photo.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Share size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{photo.weight} kg</div>
                        <div className="text-muted-foreground">Weight</div>
                      </div>
                      <div>
                        <div className="font-medium">{photo.bodyFat}%</div>
                        <div className="text-muted-foreground">Body Fat</div>
                      </div>
                      <div>
                        <div className="font-medium">{photo.muscle} kg</div>
                        <div className="text-muted-foreground">Muscle</div>
                      </div>
                    </div>
                    
                    {photo.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        "{photo.notes}"
                      </p>
                    )}
                    
                    {photo.measurements && (
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Measurements</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <span>Chest: {photo.measurements.chest}cm</span>
                          <span>Waist: {photo.measurements.waist}cm</span>
                          <span>Arms: {photo.measurements.arms}cm</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-blue-500" size={20} />
            Insights & Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm font-medium text-blue-800">Great Progress! 🎉</p>
            <p className="text-sm text-blue-700">You've consistently lost weight while gaining muscle mass. Keep up the excellent work!</p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm font-medium text-green-800">Photo Tip 📸</p>
            <p className="text-sm text-green-700">Take photos in the same lighting and pose for best comparison results.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}