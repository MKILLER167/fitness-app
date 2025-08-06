import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Shield, Trophy } from 'lucide-react'
import type { StrengthTier } from './strengthTiers'

interface StrengthOverviewProps {
  currentTier: StrengthTier | undefined
  nextTier: StrengthTier | undefined
  personalRecords: { [exerciseId: string]: { weight: number, maxReps: number, date: Date } }
}

export function StrengthOverview({ currentTier, nextTier, personalRecords }: StrengthOverviewProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h3>
              {currentTier ? `${currentTier.name} ${currentTier.rewards.badge}` : 'Unranked Lifter'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentTier ? currentTier.rewards.title : 'Complete your first lifts to unlock tiers'}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nextTier && (
          <div className="space-y-3">
            <h4 className="font-medium">Next Tier: {nextTier.name}</h4>
            <div className="space-y-2">
              {nextTier.requirements.map((req) => {
                const pr = personalRecords[req.exerciseId]
                const weightProgress = pr ? Math.min((pr.weight / req.targetWeight) * 100, 100) : 0
                const repsProgress = pr ? Math.min((pr.maxReps / req.targetReps) * 100, 100) : 0
                const isComplete = weightProgress >= 100 && repsProgress >= 100
                
                return (
                  <div key={req.exerciseId} className="p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{req.exerciseName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {pr ? `${pr.weight}kg` : '0kg'} / {req.targetWeight}kg
                        </span>
                        {isComplete && <Trophy className="text-yellow-500" size={16} />}
                      </div>
                    </div>
                    <Progress value={Math.min(weightProgress, 100)} className="h-2" />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}