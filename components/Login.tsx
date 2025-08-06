"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useLanguage } from './LanguageContext'
import { motion } from 'motion/react'
import { 
  Mail, 
  Lock, 
  Heart,
  Eye,
  EyeOff,
  Dumbbell,
  Target,
  Zap,
  Activity,
  Award,
  TrendingUp
} from 'lucide-react'
import { FloatingButton3D } from './3d/FloatingButton3D'
import { LoadingSpinner3D } from './3d/LoadingSpinner3D'

interface LoginProps {
  onLogin: (email: string, password: string, isGoogleAuth?: boolean, isGuest?: boolean) => void
  isDarkMode?: boolean
}

// 3D Floating Fitness Icon Component
function FloatingFitnessIcon({ 
  icon: Icon, 
  delay = 0, 
  duration = 6, 
  position 
}: { 
  icon: any, 
  delay?: number, 
  duration?: number,
  position: { x: string, y: string }
}) {
  return (
    <motion.div
      className="absolute opacity-10 pointer-events-none"
      style={{ left: position.x, top: position.y }}
      initial={{ 
        scale: 0, 
        rotateX: 0, 
        rotateY: 0,
        z: -100
      }}
      animate={{ 
        scale: [0, 1, 0.8, 1],
        rotateX: [0, 360, 0],
        rotateY: [0, 180, 360],
        y: [0, -20, 0],
        z: [0, 50, 0]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Icon size={32} className="text-primary/20" />
    </motion.div>
  )
}

// 3D Input Component
function Input3D({ icon: Icon, ...props }: any) {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <motion.div 
      className="relative"
      style={{ perspective: '1000px' }}
      whileHover={{ scale: 1.02 }}
      whileFocus={{ scale: 1.02 }}
    >
      <motion.div
        className="relative"
        animate={{
          rotateX: isFocused ? 5 : 0,
          z: isFocused ? 10 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          {...props}
          className={`pl-10 transition-all duration-300 hover:shadow-lg focus:shadow-xl ${props.className || ''}`}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          style={{
            background: isFocused 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
              : undefined
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// 3D Button Component
function Button3D({ children, className = "", ...props }: any) {
  return (
    <motion.div
      style={{ perspective: '500px' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        whileHover={{ 
          rotateX: -5,
          rotateY: 2,
          z: 15
        }}
        whileTap={{
          rotateX: 2,
          z: 5
        }}
        transition={{ duration: 0.2 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Button 
          {...props}
          className={`button-3d relative overflow-hidden ${className}`}
          style={{
            boxShadow: '0 8px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          {children}
        </Button>
      </motion.div>
    </motion.div>
  )
}

export function Login({ onLogin, isDarkMode = false }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { language, direction } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate loading
    setTimeout(() => {
      onLogin(email, password, false, false)
      setLoading(false)
    }, 1000)
  }

  const handleGuestLogin = () => {
    setLoading(true)
    setTimeout(() => {
      onLogin('', '', false, true)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4 relative overflow-hidden" dir={direction}>
      {/* Floating 3D Background Icons */}
      <FloatingFitnessIcon 
        icon={Dumbbell} 
        delay={0} 
        duration={8}
        position={{ x: '10%', y: '20%' }}
      />
      <FloatingFitnessIcon 
        icon={Target} 
        delay={1} 
        duration={10}
        position={{ x: '85%', y: '15%' }}
      />
      <FloatingFitnessIcon 
        icon={Zap} 
        delay={2} 
        duration={7}
        position={{ x: '15%', y: '70%' }}
      />
      <FloatingFitnessIcon 
        icon={Activity} 
        delay={3} 
        duration={9}
        position={{ x: '80%', y: '75%' }}
      />
      <FloatingFitnessIcon 
        icon={Award} 
        delay={4} 
        duration={6}
        position={{ x: '50%', y: '10%' }}
      />
      <FloatingFitnessIcon 
        icon={TrendingUp} 
        delay={2.5} 
        duration={8}
        position={{ x: '25%', y: '45%' }}
      />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ perspective: '1000px' }}
        >
          {/* 3D App Logo/Title */}
          <motion.div 
            className="text-center mb-8"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.1,
                rotateY: 360,
                rotateX: 15
              }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)'
              }}
            >
              <Heart className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              FitTracker
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground text-sm mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {language === 'ar' ? 'رفيقك الشخصي في اللياقة البدنية' : 'Your personal fitness companion'}
            </motion.p>
          </motion.div>

          {/* 3D Login Card */}
          <motion.div
            style={{ perspective: '1000px' }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              style={{ transformStyle: 'preserve-3d' }}
              animate={{
                rotateX: 0,
                rotateY: 0,
                z: 0
              }}
              whileHover={{
                rotateX: 5,
                rotateY: -2,
                z: 20
              }}
              transition={{ duration: 0.3 }}
            >
              <Card className="backdrop-blur-sm bg-card/90 shadow-2xl border-0 relative overflow-hidden">
                {/* Card glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <CardTitle className="text-xl">
                      {isSignUp ? 
                        (language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account') : 
                        (language === 'ar' ? 'مرحباً بعودتك' : 'Welcome Back')
                      }
                    </CardTitle>
                  </motion.div>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Label htmlFor="email" className="text-sm font-medium">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </Label>
                      <Input3D
                        icon={Mail}
                        id="email"
                        type="email"
                        placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                        required
                      />
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <Label htmlFor="password" className="text-sm font-medium">
                        {language === 'ar' ? 'كلمة المرور' : 'Password'}
                      </Label>
                      <div className="relative">
                        <Input3D
                          icon={Lock}
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                          value={password}
                          onChange={(e: any) => setPassword(e.target.value)}
                          className="pr-10"
                          required
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground z-20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </motion.button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      <Button3D 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium" 
                        disabled={loading}
                      >
                        {loading ? (
                          <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <LoadingSpinner3D size={20} color="#ffffff" speed={1.5} />
                            <span>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
                          </motion.div>
                        ) : (
                          isSignUp ? 
                            (language === 'ar' ? 'إنشاء الحساب' : 'Create Account') : 
                            (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                        )}
                      </Button3D>
                    </motion.div>
                  </motion.form>

                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-medium">
                        {language === 'ar' ? 'أو' : 'Or'}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    <Button3D 
                      variant="outline" 
                      className="w-full h-12 border-2 hover:bg-accent/50 transition-all duration-300" 
                      onClick={handleGuestLogin}
                      disabled={loading}
                    >
                      <motion.div
                        className="flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Heart className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {language === 'ar' ? 'تجربة كضيف' : 'Try as Guest'}
                        </span>
                      </motion.div>
                    </Button3D>
                  </motion.div>

                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSignUp ? 
                        (language === 'ar' ? 'لديك حساب؟ سجل الدخول' : 'Already have an account? Sign In') :
                        (language === 'ar' ? 'ليس لديك حساب؟ أنشئ حساباً' : "Don't have an account? Sign Up")
                      }
                    </motion.button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Additional 3D decorative elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}