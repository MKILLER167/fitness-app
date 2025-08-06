import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Trophy, Dumbbell } from 'lucide-react'
import type { Exercise } from './exerciseDatabase'

interface PersonalRecordsProps {
  personalRecords: { [exerciseId: string]: { weight: number, maxReps: number, date: Date } }
  exercises: Exercise[]
}

export function PersonalRecords({ personalRecords, exercises }: PersonalRecordsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} />
          Personal Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(personalRecords).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Dumbbell size={32} className="mx-auto mb-2 opacity-50" />
            <p>No personal records yet</p>
            <p className="text-sm">Start logging workouts to track your progress!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(personalRecords).map(([exerciseId, record]) => {
              const exercise = exercises.find(e => e.id === exerciseId)
              return (
                <div key={exerciseId} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{exercise?.name}</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Weight:</span>
                      <span className="font-semibold">{record.weight}kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Reps:</span>
                      <span className="font-semibold">{record.maxReps}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {record.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}