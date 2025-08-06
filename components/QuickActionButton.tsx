"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Plus, Dumbbell, Utensils, Droplets, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface QuickActionButtonProps {
  onAction: (action: string) => void
}

export function QuickActionButton({ onAction }: QuickActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const quickActions = [
    { id: 'meal', icon: Utensils, label: 'Add Meal', color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'workout', icon: Dumbbell, label: 'Strength', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'water', icon: Droplets, label: 'Water', color: 'bg-cyan-500 hover:bg-cyan-600' },
  ]

  const handleAction = (actionId: string) => {
    onAction(actionId)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-2"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  size="sm"
                  className={`${action.color} text-white shadow-lg min-w-[100px] justify-start gap-2`}
                  onClick={() => handleAction(action.id)}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-foreground text-background shadow-lg hover:shadow-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  )
}