"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { 
  Camera, 
  X, 
  Scan, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  Zap,
  Edit3,
  Search,
  History
} from 'lucide-react'
import { toast } from "sonner@2.0.3"

interface QRCodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (productCode: string) => void
  onScanError?: (error: string) => void
}

interface ScanResult {
  code: string
  format: string
  timestamp: number
}

export function QRCodeScanner({ isOpen, onClose, onScanSuccess, onScanError }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasCamera, setHasCamera] = useState(true)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])
  const [currentScan, setCurrentScan] = useState<string | null>(null)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [isManualEntryMode, setIsManualEntryMode] = useState(false)

  // Load scan history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('barcode_scan_history')
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save scan history to localStorage
  useEffect(() => {
    localStorage.setItem('barcode_scan_history', JSON.stringify(scanHistory))
  }, [scanHistory])

  // Initialize camera when component opens
  useEffect(() => {
    if (isOpen && !isManualEntryMode) {
      initializeCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, isManualEntryMode])

  const initializeCamera = async () => {
    try {
      setIsLoading(true)
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Camera not supported in this environment')
        setHasCamera(false)
        setIsLoading(false)
        setIsManualEntryMode(true)
        toast.info('Camera not available. Using manual entry mode.')
        return
      }

      // Check if we have camera access
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput')
        
        if (!hasVideoDevice) {
          console.warn('No video input devices found')
          setHasCamera(false)
          setIsLoading(false)
          setIsManualEntryMode(true)
          toast.info('No camera found. Using manual entry mode.')
          return
        }
      } catch (deviceError) {
        console.warn('Could not enumerate devices:', deviceError)
        // Continue with camera request anyway
      }

      // Request camera permission and start stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasCamera(true)
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsLoading(false)
          startScanning()
        }
        
        // Handle video errors
        videoRef.current.onerror = (error) => {
          console.error('Video element error:', error)
          handleCameraError('Video playback failed')
        }
      }
    } catch (error: any) {
      console.error('Camera initialization error:', error)
      handleCameraError(error)
    }
  }

  const handleCameraError = (error: any) => {
    setHasCamera(false)
    setIsLoading(false)
    setIsManualEntryMode(true)
    
    let errorMessage = 'Camera unavailable. Using manual entry mode.'
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera permission denied. Please allow camera access and refresh, or use manual entry.'
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found on this device. Using manual entry mode.'
    } else if (error.name === 'NotSupportedError') {
      errorMessage = 'Camera not supported in this environment. Using manual entry mode.'
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Camera is already in use by another application. Using manual entry mode.'
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'Camera constraints not supported. Using manual entry mode.'
    }
    
    toast.info(errorMessage, { duration: 5000 })
    onScanError?.(errorMessage)
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
    setCurrentScan(null)
  }

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    setIsScanning(true)
    scanFrame()
  }

  const scanFrame = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scanFrame)
      return
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      // Get image data for barcode detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      
      // Simple barcode detection simulation (in real app, use a library like QuaggaJS or ZXing)
      const detectedCode = simulateBarcodeDetection(imageData)
      
      if (detectedCode && detectedCode !== currentScan) {
        handleScanSuccess(detectedCode)
        return
      }
    } catch (error) {
      console.error('Scan error:', error)
    }

    // Continue scanning
    requestAnimationFrame(scanFrame)
  }

  // Simulate barcode detection (replace with actual barcode library)
  const simulateBarcodeDetection = (imageData: ImageData): string | null => {
    // This is a mock function. In a real implementation, you would use:
    // - QuaggaJS for barcode scanning: https://github.com/serratus/quaggaJS
    // - ZXing for QR codes: https://github.com/zxing-js/library
    // - Or the experimental BarcodeDetector API
    
    // For demo purposes, we'll randomly simulate detection
    const shouldDetect = Math.random() > 0.93 // 7% chance per frame
    if (shouldDetect) {
      // Generate realistic barcode numbers
      const barcodeTypes = [
        '1234567890123', // EAN-13
        '9876543210987', // Mock product
        '0123456789012', // UPC-A
        '5901234123457', // European product
        '8901030521224', // Indian product
        '0072140000005', // Real Coca-Cola UPC
        '0021130126027', // Real Pepsi UPC
        '0049000028300', // Diet Coke
        '0049000042566', // Sprite
        '0012000031052', // Oreos
      ]
      return barcodeTypes[Math.floor(Math.random() * barcodeTypes.length)]
    }
    
    return null
  }

  const handleScanSuccess = (code: string) => {
    setCurrentScan(code)
    setIsScanning(false)
    
    // Add to scan history
    const newScan: ScanResult = {
      code,
      format: code.length === 13 ? 'EAN-13' : code.length === 12 ? 'UPC-A' : 'Unknown',
      timestamp: Date.now()
    }
    setScanHistory(prev => {
      const filtered = prev.filter(scan => scan.code !== code) // Remove duplicates
      return [newScan, ...filtered].slice(0, 10) // Keep last 10 scans
    })
    
    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(200)
    }
    
    toast.success(`Product scanned: ${code}`)
    onScanSuccess(code)
  }

  const handleManualSubmit = () => {
    const code = manualCode.trim()
    if (!code) {
      toast.error('Please enter a valid barcode')
      return
    }

    // Validate barcode format (basic validation)
    if (!/^\d{8,14}$/.test(code)) {
      toast.error('Please enter a valid barcode (8-14 digits)')
      return
    }

    handleScanSuccess(code)
    setManualCode('')
  }

  const toggleFlash = async () => {
    if (!streamRef.current) return
    
    try {
      const track = streamRef.current.getVideoTracks()[0]
      const capabilities = track.getCapabilities()
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled } as any]
        })
        setFlashEnabled(!flashEnabled)
      } else {
        toast.error('Flash not supported on this device')
      }
    } catch (error) {
      console.error('Flash toggle error:', error)
      toast.error('Unable to toggle flash')
    }
  }

  const switchToManualMode = () => {
    setIsManualEntryMode(true)
    stopCamera()
  }

  const switchToCameraMode = () => {
    setIsManualEntryMode(false)
    setCurrentScan(null)
    initializeCamera()
  }

  const restartScanning = () => {
    setCurrentScan(null)
    startScanning()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-black border-gray-800 max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Scan className="text-green-500" size={20} />
              {isManualEntryMode ? 'Enter Barcode' : 'Scan Product Barcode'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-gray-800"
            >
              <X size={16} />
            </Button>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex gap-2 mt-3">
            <Button
              onClick={switchToCameraMode}
              variant={!isManualEntryMode ? "default" : "outline"}
              size="sm"
              className={!isManualEntryMode ? "bg-green-600 hover:bg-green-700" : "border-gray-600 text-white hover:bg-gray-800"}
              disabled={!hasCamera}
            >
              <Camera size={16} className="mr-1" />
              Camera
            </Button>
            <Button
              onClick={switchToManualMode}
              variant={isManualEntryMode ? "default" : "outline"}
              size="sm"
              className={isManualEntryMode ? "bg-blue-600 hover:bg-blue-700" : "border-gray-600 text-white hover:bg-gray-800"}
            >
              <Edit3 size={16} className="mr-1" />
              Manual
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Manual Entry Mode */}
          {isManualEntryMode ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white">Enter Barcode Number</Label>
                <div className="space-y-2">
                  <Input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 8-14 digit barcode"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    maxLength={14}
                  />
                  <div className="text-xs text-gray-400">
                    Examples: UPC (12 digits), EAN-13 (13 digits), EAN-8 (8 digits)
                  </div>
                </div>
                <Button 
                  onClick={handleManualSubmit}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!manualCode.trim()}
                >
                  <Search size={16} className="mr-2" />
                  Look Up Product
                </Button>
              </div>

              {/* Quick Entry Examples */}
              <div className="bg-gray-800 rounded-lg p-3">
                <h4 className="text-white font-medium text-sm mb-2">Quick Examples</h4>
                <div className="grid grid-cols-1 gap-1">
                  {['0072140000005', '0021130126027', '0049000028300'].map((code) => (
                    <button
                      key={code}
                      onClick={() => setManualCode(code)}
                      className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                    >
                      {code} <span className="text-gray-500">(Sample)</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Camera View */
            <div className="relative">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <Loader2 className="animate-spin text-white mx-auto mb-2" size={32} />
                      <p className="text-white text-sm">Initializing camera...</p>
                    </div>
                  </div>
                )}
                
                {!hasCamera && !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <AlertCircle className="text-red-500 mx-auto mb-2" size={32} />
                      <p className="text-white text-sm mb-3">Camera not available</p>
                      <Button onClick={switchToManualMode} variant="outline" size="sm">
                        Switch to Manual Entry
                      </Button>
                    </div>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Scan Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Scanning animation */}
                      <div className="w-48 h-32 border-2 border-green-500 rounded-lg relative">
                        <div className="absolute top-1 left-1 w-6 h-6 border-l-2 border-t-2 border-green-500"></div>
                        <div className="absolute top-1 right-1 w-6 h-6 border-r-2 border-t-2 border-green-500"></div>
                        <div className="absolute bottom-1 left-1 w-6 h-6 border-l-2 border-b-2 border-green-500"></div>
                        <div className="absolute bottom-1 right-1 w-6 h-6 border-r-2 border-b-2 border-green-500"></div>
                        
                        {/* Scanning line */}
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-green-500 animate-pulse"></div>
                      </div>
                      <p className="text-white text-sm text-center mt-2">Position barcode in the frame</p>
                    </div>
                  </div>
                )}
                
                {/* Success State */}
                {currentScan && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="text-green-500 mx-auto mb-2" size={48} />
                      <p className="text-white font-medium">Scanned Successfully!</p>
                      <p className="text-green-400 text-sm">{currentScan}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Camera Controls */}
              {hasCamera && !isLoading && (
                <div className="flex justify-center gap-2 mt-3">
                  <Button
                    onClick={toggleFlash}
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    {flashEnabled ? <FlashlightOff size={16} /> : <Flashlight size={16} />}
                  </Button>
                  
                  {currentScan ? (
                    <Button
                      onClick={restartScanning}
                      variant="outline"
                      size="sm"
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <RotateCcw size={16} className="mr-1" />
                      Scan Again
                    </Button>
                  ) : (
                    <Button
                      onClick={switchToManualMode}
                      variant="outline"
                      size="sm"
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Edit3 size={16} className="mr-1" />
                      Manual Entry
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Scan History */}
          {scanHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white text-sm font-medium flex items-center gap-2">
                <History size={16} />
                Recent Scans
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {scanHistory.map((scan, index) => (
                  <div 
                    key={scan.timestamp}
                    className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => handleScanSuccess(scan.code)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{scan.format}</Badge>
                      <span className="text-white">{scan.code}</span>
                    </div>
                    <Zap size={12} className="text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-white font-medium text-sm mb-2">
              {currentScan ? '✅ Product Found!' : isManualEntryMode ? 'Manual Entry Tips:' : 'Scanning Tips:'}
            </h4>
            {currentScan ? (
              <div className="space-y-2">
                <p className="text-green-400 text-sm">
                  Barcode: {currentScan}
                </p>
                <p className="text-gray-300 text-xs">
                  Looking up nutrition information...
                </p>
              </div>
            ) : isManualEntryMode ? (
              <ul className="text-gray-300 text-xs space-y-1">
                <li>• Look for barcode on product packaging</li>
                <li>• Usually found on the back or bottom</li>
                <li>• Enter 8-14 digits without spaces</li>
                <li>• Most common: UPC (12) and EAN-13 (13)</li>
              </ul>
            ) : (
              <ul className="text-gray-300 text-xs space-y-1">
                <li>• Hold device 6-8 inches from barcode</li>
                <li>• Ensure good lighting or use flash</li>
                <li>• Keep barcode flat and steady</li>
                <li>• Works with UPC, EAN, and most product barcodes</li>
                <li>• Switch to manual entry if scanning fails</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}