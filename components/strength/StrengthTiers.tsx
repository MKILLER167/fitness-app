import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Crown, Trophy } from 'lucide-react'
import type { StrengthTier } from './strengthTiers'

interface StrengthTiersProps {
  tiers: StrengthTier[]
  personalRecords: { [exerciseId: string]: { weight: number, maxReps: number, date: Date } }
}

export function StrengthTiers({ tiers, personalRecords }: StrengthTiersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="text-purple-500" size={20} />
          Strength Tiers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tiers.map(tier => (
            <div 
              key={tier.id} 
              className={`p-4 rounded-lg border-2 transition-all ${
                tier.unlocked 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{tier.rewards.badge}</div>
                  <div>
                    <h4 className="font-medium">{tier.name}</h4>
                    <p className="text-sm text-muted-foreground">{tier.rewards.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">+{tier.rewards.xp} XP</div>
                  {tier.unlocked && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Unlocked
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tier.requirements.map(req => {
                  const pr = personalRecords[req.exerciseId]
                  const achieved = pr && pr.weight >= req.targetWeight && pr.maxReps >= req.targetReps
                  
                  return (
                    <div 
                      key={req.exerciseId} 
                      className={`p-3 rounded border ${
                        achieved ? 'bg-green-100 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="text-sm font-medium">{req.exerciseName}</div>
                      <div className="text-xs text-muted-foreground">
                        {req.targetWeight}kg × {req.targetReps} reps
                      </div>
                      {achieved && (
                        <div className="flex items-center gap-1 mt-1">
                          <Trophy className="text-yellow-500" size={12} />
                          <span className="text-xs text-green-600">Achieved</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}