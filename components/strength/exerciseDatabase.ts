export interface Exercise {
  id: string
  name: string
  category: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio' | 'functional'
  subcategory?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  equipment: string[]
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
  tips: string[]
  videoUrl?: string
  variations?: string[]
  commonMistakes?: string[]
  benefits?: string[]
  repsRange?: string
  setsRange?: string
  restTime?: string
  caloriesPerMinute?: number
}

export const EXERCISE_DATABASE: Exercise[] = [
  // CHEST EXERCISES
  {
    id: 'bench_press',
    name: 'Bench Press',
    category: 'chest',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell', 'bench'],
    primaryMuscles: ['pectorals', 'triceps'],
    secondaryMuscles: ['front_deltoids'],
    instructions: [
      'Lie on bench with feet flat on floor',
      'Grip bar slightly wider than shoulder width',
      'Lower bar to chest with control',
      'Press bar up until arms are fully extended',
      'Keep shoulder blades retracted throughout'
    ],
    tips: [
      'Keep your back arched and core tight',
      'Maintain contact between shoulder blades and bench',
      'Control the descent, explode on the way up',
      'Touch chest lightly, don\'t bounce the bar'
    ],
    variations: ['Incline Bench Press', 'Decline Bench Press', 'Dumbbell Bench Press'],
    commonMistakes: ['Bouncing bar off chest', 'Lifting hips off bench', 'Flaring elbows too wide'],
    benefits: ['Builds upper body strength', 'Improves pushing power', 'Develops chest mass'],
    repsRange: '6-12',
    setsRange: '3-5',
    restTime: '2-3 minutes',
    caloriesPerMinute: 8
  },
  {
    id: 'incline_bench_press',
    name: 'Incline Bench Press',
    category: 'chest',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell', 'incline_bench'],
    primaryMuscles: ['upper_pectorals', 'triceps'],
    secondaryMuscles: ['front_deltoids'],
    instructions: [
      'Set bench to 30-45 degree incline',
      'Lie back with feet flat on floor',
      'Grip bar slightly wider than shoulders',
      'Lower bar to upper chest',
      'Press up with control'
    ],
    tips: [
      'Don\'t set incline too steep (30-45 degrees optimal)',
      'Lower bar to upper chest, not neck',
      'Keep core engaged throughout movement',
      'Squeeze chest at the top'
    ],
    variations: ['Dumbbell Incline Press', 'Incline Dumbbell Flyes'],
    commonMistakes: ['Setting bench too steep', 'Lowering bar to neck', 'Using too much weight'],
    benefits: ['Targets upper chest', 'Improves shoulder stability', 'Better chest definition'],
    repsRange: '8-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'decline_bench_press',
    name: 'Decline Bench Press',
    category: 'chest',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell', 'decline_bench'],
    primaryMuscles: ['lower_pectorals', 'triceps'],
    secondaryMuscles: ['front_deltoids'],
    instructions: [
      'Set bench to 15-30 degree decline',
      'Secure feet under foot pads',
      'Grip bar slightly wider than shoulders',
      'Lower bar to lower chest',
      'Press up explosively'
    ],
    tips: [
      'Don\'t decline too steep',
      'Focus on lower chest contraction',
      'Keep shoulders back and down',
      'Control the negative'
    ],
    variations: ['Decline Dumbbell Press', 'Decline Push-ups'],
    commonMistakes: ['Too steep decline', 'Not securing feet properly', 'Poor bar path'],
    benefits: ['Targets lower chest', 'Improves pressing power', 'Better chest development'],
    repsRange: '8-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'push_ups',
    name: 'Push-ups',
    category: 'chest',
    subcategory: 'bodyweight',
    difficulty: 'beginner',
    equipment: ['none'],
    primaryMuscles: ['pectorals', 'triceps'],
    secondaryMuscles: ['front_deltoids', 'core'],
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower body until chest nearly touches floor',
      'Push up to starting position',
      'Keep body in straight line throughout'
    ],
    tips: [
      'Keep core tight to maintain straight line',
      'Look down, not forward',
      'Full range of motion for best results',
      'Start on knees if needed'
    ],
    variations: ['Incline Push-ups', 'Diamond Push-ups', 'Wide-grip Push-ups', 'One-arm Push-ups'],
    commonMistakes: ['Sagging hips', 'Partial range of motion', 'Flaring elbows too wide'],
    benefits: ['No equipment needed', 'Functional movement', 'Core stability'],
    repsRange: '10-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 'diamond_push_ups',
    name: 'Diamond Push-ups',
    category: 'chest',
    subcategory: 'bodyweight',
    difficulty: 'advanced',
    equipment: ['none'],
    primaryMuscles: ['triceps', 'inner_pectorals'],
    secondaryMuscles: ['front_deltoids', 'core'],
    instructions: [
      'Start in plank position',
      'Form diamond shape with hands under chest',
      'Lower body keeping elbows close to sides',
      'Push up maintaining diamond hand position',
      'Keep core tight throughout'
    ],
    tips: [
      'Keep elbows close to body',
      'Don\'t let hips sag',
      'Start from knees if too difficult',
      'Focus on tricep engagement'
    ],
    variations: ['Close-grip Push-ups', 'Triangle Push-ups'],
    commonMistakes: ['Elbows flaring out', 'Poor body alignment', 'Partial range of motion'],
    benefits: ['Intense tricep workout', 'Inner chest development', 'Advanced bodyweight exercise'],
    repsRange: '5-15',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 8
  },
  {
    id: 'dumbbell_flyes',
    name: 'Dumbbell Flyes',
    category: 'chest',
    subcategory: 'isolation',
    difficulty: 'intermediate',
    equipment: ['dumbbells', 'bench'],
    primaryMuscles: ['pectorals'],
    secondaryMuscles: ['front_deltoids'],
    instructions: [
      'Lie on bench holding dumbbells above chest',
      'Lower weights in wide arc with slight elbow bend',
      'Feel stretch in chest at bottom',
      'Bring weights together above chest',
      'Squeeze chest muscles at top'
    ],
    tips: [
      'Keep slight bend in elbows throughout',
      'Focus on feeling stretch in chest',
      'Use controlled movement, no bouncing',
      'Don\'t lower weights too far'
    ],
    variations: ['Incline Dumbbell Flyes', 'Cable Flyes', 'Pec Deck'],
    commonMistakes: ['Using too much weight', 'Lowering too far', 'Bouncing at bottom'],
    benefits: ['Isolation of chest muscles', 'Improved chest definition', 'Better muscle fiber recruitment'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 5
  },
  {
    id: 'cable_crossover',
    name: 'Cable Crossover',
    category: 'chest',
    subcategory: 'isolation',
    difficulty: 'intermediate',
    equipment: ['cable_machine'],
    primaryMuscles: ['pectorals'],
    secondaryMuscles: ['front_deltoids'],
    instructions: [
      'Set cables at upper position',
      'Stand in center with one foot forward',
      'Pull handles down and across body',
      'Squeeze chest at bottom of movement',
      'Return with control to start position'
    ],
    tips: [
      'Lean slightly forward',
      'Keep chest up throughout movement',
      'Focus on squeezing chest muscles',
      'Don\'t use momentum'
    ],
    variations: ['Low to High Cable Flyes', 'Mid Cable Flyes'],
    commonMistakes: ['Using too much weight', 'Poor body position', 'Not controlling the negative'],
    benefits: ['Constant tension on chest', 'Great finishing exercise', 'Improved muscle definition'],
    repsRange: '12-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 5
  },
  {
    id: 'chest_dips',
    name: 'Chest Dips',
    category: 'chest',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['parallel_bars'],
    primaryMuscles: ['lower_pectorals', 'triceps'],
    secondaryMuscles: ['front_deltoids'],
    instructions: [
      'Support body on parallel bars',
      'Lean forward slightly',
      'Lower body by bending elbows',
      'Feel stretch in chest',
      'Push up to starting position'
    ],
    tips: [
      'Lean forward to target chest more',
      'Don\'t go too low to avoid shoulder injury',
      'Keep feet slightly forward',
      'Control the descent'
    ],
    variations: ['Weighted Dips', 'Ring Dips', 'Assisted Dips'],
    commonMistakes: ['Going too low', 'Not leaning forward enough', 'Using momentum'],
    benefits: ['Targets lower chest effectively', 'Builds functional strength', 'Bodyweight exercise'],
    repsRange: '8-15',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },

  // BACK EXERCISES
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'back',
    subcategory: 'compound',
    difficulty: 'advanced',
    equipment: ['barbell'],
    primaryMuscles: ['erector_spinae', 'glutes', 'hamstrings'],
    secondaryMuscles: ['traps', 'lats', 'forearms', 'core'],
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Grip bar with hands just outside legs',
      'Keep back straight, chest up, shoulders back',
      'Drive through heels to stand up straight',
      'Keep bar close to body throughout movement'
    ],
    tips: [
      'Keep the bar close to your body',
      'Engage lats to protect your back',
      'Squeeze glutes at the top',
      'Start with lighter weight to master form'
    ],
    variations: ['Sumo Deadlift', 'Romanian Deadlift', 'Stiff-leg Deadlift'],
    commonMistakes: ['Rounding back', 'Bar drifting away from body', 'Hyperextending at top'],
    benefits: ['Full body strength', 'Functional movement', 'Improved posture'],
    repsRange: '5-8',
    setsRange: '3-5',
    restTime: '3-5 minutes',
    caloriesPerMinute: 10
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    category: 'back',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell'],
    primaryMuscles: ['hamstrings', 'glutes', 'erector_spinae'],
    secondaryMuscles: ['traps', 'lats'],
    instructions: [
      'Start standing with bar in hands',
      'Keep knees slightly bent',
      'Hinge at hips, pushing them back',
      'Lower bar while keeping back straight',
      'Return to standing by driving hips forward'
    ],
    tips: [
      'Focus on hip hinge movement',
      'Keep bar close to legs',
      'Feel stretch in hamstrings',
      'Don\'t round your back'
    ],
    variations: ['Single-leg Romanian Deadlift', 'Dumbbell Romanian Deadlift'],
    commonMistakes: ['Squatting instead of hinging', 'Rounding back', 'Bar too far from body'],
    benefits: ['Hamstring and glute development', 'Improved hip mobility', 'Better deadlift technique'],
    repsRange: '8-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 8
  },
  {
    id: 'pull_up',
    name: 'Pull-up',
    category: 'back',
    subcategory: 'bodyweight',
    difficulty: 'intermediate',
    equipment: ['pull_up_bar'],
    primaryMuscles: ['lats', 'rhomboids'],
    secondaryMuscles: ['biceps', 'rear_deltoids'],
    instructions: [
      'Hang from bar with overhand grip, hands wider than shoulders',
      'Pull yourself up until chin clears bar',
      'Lower yourself with control to full hang',
      'Repeat for desired reps'
    ],
    tips: [
      'Engage lats by pulling shoulder blades down',
      'Avoid swinging or kipping',
      'Full range of motion for best results',
      'Use assistance band if needed'
    ],
    variations: ['Chin-ups', 'Wide-grip Pull-ups', 'Neutral-grip Pull-ups'],
    commonMistakes: ['Partial range of motion', 'Swinging body', 'Using momentum'],
    benefits: ['Upper body strength', 'Improved grip strength', 'Functional movement'],
    repsRange: '5-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 8
  },
  {
    id: 'chin_ups',
    name: 'Chin-ups',
    category: 'back',
    subcategory: 'bodyweight',
    difficulty: 'intermediate',
    equipment: ['pull_up_bar'],
    primaryMuscles: ['biceps', 'lats'],
    secondaryMuscles: ['rhomboids', 'rear_deltoids'],
    instructions: [
      'Hang from bar with underhand grip',
      'Hands about shoulder-width apart',
      'Pull up until chin clears bar',
      'Lower with control to full hang',
      'Keep core engaged throughout'
    ],
    tips: [
      'Underhand grip targets biceps more',
      'Pull with your back, not just arms',
      'Squeeze shoulder blades together',
      'Don\'t swing or use momentum'
    ],
    variations: ['Weighted Chin-ups', 'Commando Pull-ups'],
    commonMistakes: ['Not going to full hang', 'Using momentum', 'Partial range of motion'],
    benefits: ['Bicep and back development', 'Improved pulling strength', 'Functional exercise'],
    repsRange: '6-15',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 8
  },
  {
    id: 'bent_over_row',
    name: 'Bent-over Barbell Row',
    category: 'back',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell'],
    primaryMuscles: ['lats', 'rhomboids', 'middle_traps'],
    secondaryMuscles: ['rear_deltoids', 'biceps'],
    instructions: [
      'Hold barbell with overhand grip',
      'Bend at hips to lean forward 45 degrees',
      'Keep back straight and core engaged',
      'Pull bar to lower chest/upper abdomen',
      'Lower with control'
    ],
    tips: [
      'Keep core tight to protect lower back',
      'Pull elbows back, not out to sides',
      'Squeeze shoulder blades at top',
      'Don\'t use momentum'
    ],
    variations: ['T-bar Row', 'Dumbbell Row', 'Cable Row'],
    commonMistakes: ['Standing too upright', 'Using momentum', 'Rounding back'],
    benefits: ['Back width and thickness', 'Improved posture', 'Better pulling strength'],
    repsRange: '8-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'dumbbell_row',
    name: 'Single-arm Dumbbell Row',
    category: 'back',
    subcategory: 'compound',
    difficulty: 'beginner',
    equipment: ['dumbbells', 'bench'],
    primaryMuscles: ['lats', 'rhomboids'],
    secondaryMuscles: ['rear_deltoids', 'biceps'],
    instructions: [
      'Place one knee and hand on bench',
      'Hold dumbbell in opposite hand',
      'Keep back straight and parallel to floor',
      'Pull dumbbell to hip',
      'Lower with control'
    ],
    tips: [
      'Keep torso parallel to floor',
      'Pull elbow back, not out',
      'Squeeze shoulder blade at top',
      'Don\'t rotate torso'
    ],
    variations: ['Two-arm Dumbbell Row', 'Chest-supported Row'],
    commonMistakes: ['Rotating torso', 'Using momentum', 'Not squeezing shoulder blade'],
    benefits: ['Unilateral back development', 'Core stability', 'Corrects imbalances'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    category: 'back',
    subcategory: 'machine',
    difficulty: 'beginner',
    equipment: ['lat_pulldown_machine'],
    primaryMuscles: ['lats'],
    secondaryMuscles: ['rhomboids', 'biceps', 'rear_deltoids'],
    instructions: [
      'Sit at lat pulldown machine with thighs secured',
      'Grip bar wider than shoulder width',
      'Lean back slightly and pull bar to upper chest',
      'Squeeze shoulder blades together',
      'Control the weight back up'
    ],
    tips: [
      'Pull with your back, not your arms',
      'Don\'t lean back too far',
      'Squeeze shoulder blades together',
      'Control the negative portion'
    ],
    variations: ['Close-grip Pulldown', 'V-bar Pulldown', 'Single-arm Pulldown'],
    commonMistakes: ['Pulling behind neck', 'Using too much momentum', 'Not engaging lats'],
    benefits: ['Lat development', 'Preparation for pull-ups', 'Controlled resistance'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 'cable_row',
    name: 'Seated Cable Row',
    category: 'back',
    subcategory: 'machine',
    difficulty: 'beginner',
    equipment: ['cable_machine'],
    primaryMuscles: ['lats', 'rhomboids', 'middle_traps'],
    secondaryMuscles: ['rear_deltoids', 'biceps'],
    instructions: [
      'Sit at cable row machine',
      'Grip handle with both hands',
      'Keep back straight, core engaged',
      'Pull handle to lower chest',
      'Squeeze shoulder blades together'
    ],
    tips: [
      'Keep back straight throughout',
      'Pull elbows back, not out',
      'Squeeze shoulder blades at the end',
      'Control the return'
    ],
    variations: ['Single-arm Cable Row', 'Wide-grip Cable Row'],
    commonMistakes: ['Rounding back', 'Using momentum', 'Not squeezing shoulder blades'],
    benefits: ['Back thickness', 'Improved posture', 'Safe for beginners'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 't_bar_row',
    name: 'T-Bar Row',
    category: 'back',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['t_bar', 'plates'],
    primaryMuscles: ['lats', 'rhomboids', 'middle_traps'],
    secondaryMuscles: ['rear_deltoids', 'biceps'],
    instructions: [
      'Straddle T-bar with feet shoulder-width apart',
      'Bend at hips and knees, grip handles',
      'Keep back straight, chest up',
      'Pull bar to lower chest',
      'Lower with control'
    ],
    tips: [
      'Keep core tight throughout',
      'Drive elbows back',
      'Squeeze shoulder blades together',
      'Don\'t round your back'
    ],
    variations: ['Chest-supported T-bar Row', 'Landmine Row'],
    commonMistakes: ['Rounding back', 'Using legs too much', 'Not controlling the weight'],
    benefits: ['Great back mass builder', 'Heavy loading potential', 'Unique angle of pull'],
    repsRange: '8-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },

  // SHOULDER EXERCISES
  {
    id: 'overhead_press',
    name: 'Overhead Press',
    category: 'shoulders',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell'],
    primaryMuscles: ['front_deltoids', 'triceps'],
    secondaryMuscles: ['core', 'upper_chest'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold bar at shoulder level with overhand grip',
      'Press bar straight up overhead',
      'Lower with control to starting position',
      'Keep core tight throughout'
    ],
    tips: [
      'Keep core tight throughout movement',
      'Press in a straight line, not forward',
      'Fully extend arms at the top',
      'Don\'t arch back excessively'
    ],
    variations: ['Dumbbell Shoulder Press', 'Seated Press', 'Push Press'],
    commonMistakes: ['Pressing forward instead of up', 'Arching back too much', 'Partial range of motion'],
    benefits: ['Shoulder strength', 'Core stability', 'Functional pressing power'],
    repsRange: '6-10',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    category: 'shoulders',
    subcategory: 'compound',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['front_deltoids', 'triceps'],
    secondaryMuscles: ['core', 'upper_chest'],
    instructions: [
      'Hold dumbbells at shoulder height',
      'Stand with feet shoulder-width apart',
      'Press weights straight up overhead',
      'Lower with control to starting position',
      'Keep core engaged throughout'
    ],
    tips: [
      'Don\'t arch back excessively',
      'Press weights up and slightly in',
      'Keep wrists straight',
      'Control the descent'
    ],
    variations: ['Seated Dumbbell Press', 'Single-arm Press', 'Arnold Press'],
    commonMistakes: ['Arching back too much', 'Pressing weights forward', 'Using momentum'],
    benefits: ['Unilateral shoulder development', 'Better range of motion', 'Core stability'],
    repsRange: '8-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 'lateral_raises',
    name: 'Lateral Raises',
    category: 'shoulders',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['lateral_deltoids'],
    secondaryMuscles: ['front_deltoids', 'rear_deltoids'],
    instructions: [
      'Stand holding dumbbells at sides',
      'Raise weights out to sides until parallel to floor',
      'Keep slight bend in elbows',
      'Lower with control',
      'Maintain neutral spine'
    ],
    tips: [
      'Don\'t use momentum to swing weights',
      'Lead with pinkies, not thumbs',
      'Stop at shoulder height',
      'Use lighter weight than you think'
    ],
    variations: ['Cable Lateral Raises', 'Leaning Lateral Raises', 'Single-arm Lateral Raises'],
    commonMistakes: ['Using too much weight', 'Swinging weights', 'Raising too high'],
    benefits: ['Shoulder width', 'Deltoid isolation', 'Improved shoulder stability'],
    repsRange: '12-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'front_raises',
    name: 'Front Raises',
    category: 'shoulders',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['front_deltoids'],
    secondaryMuscles: ['upper_chest', 'core'],
    instructions: [
      'Stand holding dumbbells in front of thighs',
      'Keep slight bend in elbows',
      'Raise one weight forward to shoulder height',
      'Lower with control',
      'Alternate arms or do both together'
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Keep core engaged',
      'Stop at shoulder height',
      'Control the negative'
    ],
    variations: ['Plate Front Raise', 'Cable Front Raise', 'Barbell Front Raise'],
    commonMistakes: ['Using momentum', 'Raising too high', 'Arching back'],
    benefits: ['Front deltoid isolation', 'Improved shoulder definition', 'Core stability'],
    repsRange: '12-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'rear_delt_flyes',
    name: 'Rear Deltoid Flyes',
    category: 'shoulders',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['rear_deltoids'],
    secondaryMuscles: ['rhomboids', 'middle_traps'],
    instructions: [
      'Bend forward at hips holding dumbbells',
      'Keep slight bend in elbows',
      'Raise weights out to sides',
      'Squeeze shoulder blades together',
      'Lower with control'
    ],
    tips: [
      'Keep chest up, don\'t round back',
      'Focus on squeezing shoulder blades',
      'Don\'t use momentum',
      'Keep elbows slightly bent'
    ],
    variations: ['Cable Rear Delt Flyes', 'Bent-over Cable Flyes'],
    commonMistakes: ['Using too much weight', 'Rounding back', 'Not squeezing shoulder blades'],
    benefits: ['Rear deltoid development', 'Improved posture', 'Shoulder balance'],
    repsRange: '15-25',
    setsRange: '3-4',
    restTime: '1 minute',
    caloriesPerMinute: 3
  },
  {
    id: 'face_pulls',
    name: 'Face Pulls',
    category: 'shoulders',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['cable_machine', 'rope'],
    primaryMuscles: ['rear_deltoids'],
    secondaryMuscles: ['rhomboids', 'middle_traps'],
    instructions: [
      'Set cable at face height with rope attachment',
      'Pull rope to face with high elbows',
      'Separate rope ends at face level',
      'Squeeze shoulder blades together',
      'Return with control'
    ],
    tips: [
      'Keep elbows high throughout movement',
      'Focus on squeezing shoulder blades',
      'Don\'t use too much weight',
      'Pull rope apart at the end'
    ],
    variations: ['Band Face Pulls', 'Reverse Flyes', 'Prone Y-raises'],
    commonMistakes: ['Lowering elbows', 'Using too much weight', 'Not squeezing shoulder blades'],
    benefits: ['Rear delt development', 'Improved posture', 'Shoulder health'],
    repsRange: '15-25',
    setsRange: '3-4',
    restTime: '1 minute',
    caloriesPerMinute: 3
  },
  {
    id: 'arnold_press',
    name: 'Arnold Press',
    category: 'shoulders',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['dumbbells'],
    primaryMuscles: ['front_deltoids', 'lateral_deltoids'],
    secondaryMuscles: ['triceps', 'upper_chest'],
    instructions: [
      'Start with dumbbells at shoulder height, palms facing you',
      'As you press up, rotate wrists so palms face forward',
      'At top, palms should face away from you',
      'Reverse the motion on the way down',
      'End with palms facing you again'
    ],
    tips: [
      'Smooth rotation throughout the movement',
      'Don\'t rush the rotation',
      'Keep core engaged',
      'Control the weight throughout'
    ],
    variations: ['Seated Arnold Press', 'Single-arm Arnold Press'],
    commonMistakes: ['Rotating too quickly', 'Using too much weight', 'Poor core stability'],
    benefits: ['Full deltoid development', 'Improved shoulder mobility', 'Unique stimulation'],
    repsRange: '8-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 'upright_rows',
    name: 'Upright Rows',
    category: 'shoulders',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell'],
    primaryMuscles: ['lateral_deltoids', 'traps'],
    secondaryMuscles: ['front_deltoids', 'rhomboids'],
    instructions: [
      'Hold barbell with hands closer than shoulder-width',
      'Stand with feet shoulder-width apart',
      'Pull bar straight up along body',
      'Lead with elbows, keep them high',
      'Stop when elbows reach shoulder height'
    ],
    tips: [
      'Don\'t pull elbows higher than shoulders',
      'Keep bar close to body',
      'Lead with elbows, not hands',
      'Use moderate weight'
    ],
    variations: ['Dumbbell Upright Rows', 'Cable Upright Rows'],
    commonMistakes: ['Pulling too high', 'Using too wide a grip', 'Bar too far from body'],
    benefits: ['Trap and deltoid development', 'Improved shoulder stability', 'Upper body power'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '2 minutes',
    caloriesPerMinute: 5
  },

  // ARM EXERCISES
  {
    id: 'barbell_curls',
    name: 'Barbell Curls',
    category: 'arms',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['barbell'],
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Stand holding barbell with underhand grip',
      'Keep elbows at sides',
      'Curl weight up by flexing biceps',
      'Squeeze at top, lower with control',
      'Don\'t swing or use momentum'
    ],
    tips: [
      'Keep elbows stationary at sides',
      'Don\'t swing the weight',
      'Squeeze biceps at the top',
      'Control the negative portion'
    ],
    variations: ['Dumbbell Curls', 'Hammer Curls', 'Preacher Curls'],
    commonMistakes: ['Swinging body', 'Moving elbows', 'Partial range of motion'],
    benefits: ['Bicep strength and size', 'Improved arm definition', 'Better grip strength'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'dumbbell_curls',
    name: 'Dumbbell Curls',
    category: 'arms',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Stand holding dumbbells at sides',
      'Keep elbows at sides',
      'Curl one weight up while keeping elbow stationary',
      'Squeeze bicep at top',
      'Lower with control and repeat with other arm'
    ],
    tips: [
      'Alternate arms or do both together',
      'Keep elbows at sides',
      'Full range of motion',
      'Don\'t swing weights'
    ],
    variations: ['Hammer Curls', 'Concentration Curls', 'Incline Curls'],
    commonMistakes: ['Swinging weights', 'Moving elbows', 'Using momentum'],
    benefits: ['Unilateral arm development', 'Better muscle isolation', 'Corrects imbalances'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'hammer_curls',
    name: 'Hammer Curls',
    category: 'arms',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['biceps', 'brachialis'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Hold dumbbells with neutral grip (palms facing each other)',
      'Keep elbows at sides',
      'Curl weights up maintaining neutral grip',
      'Squeeze at top',
      'Lower with control'
    ],
    tips: [
      'Keep palms facing each other throughout',
      'Don\'t rotate wrists',
      'Keep elbows stationary',
      'Focus on the brachialis muscle'
    ],
    variations: ['Cross-body Hammer Curls', 'Cable Hammer Curls'],
    commonMistakes: ['Rotating wrists', 'Swinging weights', 'Moving elbows'],
    benefits: ['Targets brachialis muscle', 'Improved arm thickness', 'Better grip strength'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'concentration_curls',
    name: 'Concentration Curls',
    category: 'arms',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['dumbbells', 'bench'],
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Sit on bench with feet wide',
      'Hold dumbbell in one hand',
      'Brace elbow against inner thigh',
      'Curl weight up with focus on bicep contraction',
      'Lower slowly and repeat'
    ],
    tips: [
      'Really focus on the muscle contraction',
      'Use lighter weight for better form',
      'Keep elbow pressed against thigh',
      'Slow and controlled movement'
    ],
    variations: ['Standing Concentration Curls', 'Cable Concentration Curls'],
    commonMistakes: ['Using too much weight', 'Moving elbow', 'Rushing the movement'],
    benefits: ['Maximum bicep isolation', 'Mind-muscle connection', 'Peak bicep development'],
    repsRange: '12-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 3
  },
  {
    id: 'tricep_dips',
    name: 'Tricep Dips',
    category: 'arms',
    subcategory: 'bodyweight',
    difficulty: 'intermediate',
    equipment: ['parallel_bars'],
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['front_deltoids', 'chest'],
    instructions: [
      'Support body weight on parallel bars',
      'Lower body by bending elbows',
      'Descend until upper arms parallel to floor',
      'Push up to starting position',
      'Keep body upright'
    ],
    tips: [
      'Keep elbows close to body',
      'Don\'t go too low to avoid shoulder strain',
      'Focus on tricep contraction',
      'Use assistance if needed'
    ],
    variations: ['Bench Dips', 'Ring Dips', 'Weighted Dips'],
    commonMistakes: ['Going too low', 'Flaring elbows out', 'Leaning forward too much'],
    benefits: ['Tricep strength', 'Functional movement', 'Upper body power'],
    repsRange: '8-15',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 'bench_dips',
    name: 'Bench Dips',
    category: 'arms',
    subcategory: 'bodyweight',
    difficulty: 'beginner',
    equipment: ['bench'],
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['front_deltoids'],
    instructions: [
      'Sit on edge of bench, hands gripping edge',
      'Slide forward off bench',
      'Lower body by bending elbows',
      'Push back up to starting position',
      'Keep feet on floor or elevated'
    ],
    tips: [
      'Keep elbows close to body',
      'Don\'t go too low',
      'Elevate feet to increase difficulty',
      'Keep shoulders back'
    ],
    variations: ['Feet-elevated Bench Dips', 'Weighted Bench Dips'],
    commonMistakes: ['Going too low', 'Flaring elbows', 'Using legs too much'],
    benefits: ['Accessible tricep exercise', 'No equipment needed', 'Scalable difficulty'],
    repsRange: '10-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 5
  },
  {
    id: 'close_grip_bench',
    name: 'Close-grip Bench Press',
    category: 'arms',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell', 'bench'],
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'front_deltoids'],
    instructions: [
      'Lie on bench with narrow grip on barbell',
      'Keep elbows close to body',
      'Lower bar to chest with control',
      'Press up focusing on tricep extension',
      'Maintain tight core'
    ],
    tips: [
      'Keep elbows close to sides',
      'Don\'t grip too narrow',
      'Focus on tricep engagement',
      'Control the descent'
    ],
    variations: ['Close-grip Dumbbell Press', 'Diamond Push-ups'],
    commonMistakes: ['Gripping too narrow', 'Flaring elbows out', 'Bouncing bar'],
    benefits: ['Tricep mass and strength', 'Improved bench press', 'Upper body power'],
    repsRange: '8-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'tricep_pushdowns',
    name: 'Tricep Pushdowns',
    category: 'arms',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['cable_machine'],
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['none'],
    instructions: [
      'Stand at cable machine with rope or bar attachment',
      'Keep elbows at sides',
      'Push weight down by extending forearms',
      'Squeeze triceps at bottom',
      'Return to start with control'
    ],
    tips: [
      'Keep elbows stationary at sides',
      'Full range of motion',
      'Squeeze triceps at bottom',
      'Don\'t use body weight'
    ],
    variations: ['Rope Pushdowns', 'V-bar Pushdowns', 'Single-arm Pushdowns'],
    commonMistakes: ['Moving elbows', 'Using momentum', 'Partial range of motion'],
    benefits: ['Tricep isolation', 'Good for beginners', 'Constant tension'],
    repsRange: '12-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'overhead_tricep_extension',
    name: 'Overhead Tricep Extension',
    category: 'arms',
    subcategory: 'isolation',
    difficulty: 'intermediate',
    equipment: ['dumbbells'],
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['core'],
    instructions: [
      'Hold dumbbell overhead with both hands',
      'Keep elbows pointing forward',
      'Lower weight behind head by bending elbows',
      'Extend arms back to starting position',
      'Keep core tight throughout'
    ],
    tips: [
      'Keep elbows pointing forward',
      'Don\'t let elbows flare out',
      'Control the weight behind head',
      'Keep core engaged for stability'
    ],
    variations: ['Seated Overhead Extension', 'Cable Overhead Extension'],
    commonMistakes: ['Elbows flaring out', 'Going too low', 'Poor core stability'],
    benefits: ['Tricep long head development', 'Overhead strength', 'Core stability'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '2 minutes',
    caloriesPerMinute: 5
  },

  // LEG EXERCISES
  {
    id: 'squat',
    name: 'Back Squat',
    category: 'legs',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell', 'squat_rack'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    instructions: [
      'Position bar on upper back in squat rack',
      'Stand with feet shoulder-width apart',
      'Descend by pushing hips back and bending knees',
      'Go down until thighs parallel to floor',
      'Rise up by driving through heels'
    ],
    tips: [
      'Keep chest up and core engaged',
      'Go down until thighs are parallel to floor',
      'Drive through your heels, not your toes',
      'Keep knees in line with toes'
    ],
    variations: ['Front Squat', 'Goblet Squat', 'Bulgarian Split Squat'],
    commonMistakes: ['Knees caving in', 'Not going deep enough', 'Leaning forward'],
    benefits: ['Full leg development', 'Functional strength', 'Core stability'],
    repsRange: '6-12',
    setsRange: '3-5',
    restTime: '3-5 minutes',
    caloriesPerMinute: 9
  },
  {
    id: 'front_squat',
    name: 'Front Squat',
    category: 'legs',
    subcategory: 'compound',
    difficulty: 'advanced',
    equipment: ['barbell', 'squat_rack'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['core', 'upper_back'],
    instructions: [
      'Position bar on front of shoulders',
      'Keep elbows up, chest up',
      'Descend by bending knees and hips',
      'Keep torso upright throughout',
      'Drive up through heels'
    ],
    tips: [
      'Keep elbows high throughout movement',
      'Chest up, core tight',
      'Don\'t let knees cave in',
      'Maintain upright torso'
    ],
    variations: ['Goblet Squat', 'Cross-arm Front Squat'],
    commonMistakes: ['Dropping elbows', 'Leaning forward', 'Poor flexibility'],
    benefits: ['Quad emphasis', 'Core strength', 'Better squat mobility'],
    repsRange: '6-12',
    setsRange: '3-4',
    restTime: '3-5 minutes',
    caloriesPerMinute: 9
  },
  {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    category: 'legs',
    subcategory: 'compound',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['core', 'shoulders'],
    instructions: [
      'Hold dumbbell at chest level',
      'Stand with feet slightly wider than shoulders',
      'Squat down keeping chest up',
      'Go down until thighs parallel to floor',
      'Drive up through heels'
    ],
    tips: [
      'Keep dumbbell close to chest',
      'Elbows point down',
      'Chest up throughout movement',
      'Full range of motion'
    ],
    variations: ['Kettlebell Goblet Squat', 'Sumo Goblet Squat'],
    commonMistakes: ['Letting chest drop', 'Not going deep enough', 'Knees caving in'],
    benefits: ['Great for beginners', 'Teaches proper squat form', 'Core engagement'],
    repsRange: '12-20',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'lunges',
    name: 'Walking Lunges',
    category: 'legs',
    subcategory: 'compound',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    instructions: [
      'Stand holding dumbbells at sides',
      'Step forward into lunge position',
      'Lower back knee toward ground',
      'Push off front foot to step forward',
      'Alternate legs with each step'
    ],
    tips: [
      'Keep front knee over ankle',
      'Don\'t let front knee go past toes',
      'Step far enough forward',
      'Keep torso upright'
    ],
    variations: ['Reverse Lunges', 'Lateral Lunges', 'Jump Lunges'],
    commonMistakes: ['Front knee too far forward', 'Short steps', 'Leaning forward'],
    benefits: ['Unilateral leg strength', 'Balance and coordination', 'Functional movement'],
    repsRange: '10-20 per leg',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    category: 'legs',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['dumbbells', 'bench'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    instructions: [
      'Stand 2-3 feet in front of bench',
      'Place rear foot on bench',
      'Hold dumbbells at sides',
      'Lower into lunge position',
      'Push up through front heel'
    ],
    tips: [
      'Most weight on front leg',
      'Keep front knee over ankle',
      'Don\'t lean forward',
      'Focus on the working leg'
    ],
    variations: ['Rear-foot-elevated Split Squat', 'Jump Bulgarian Split Squats'],
    commonMistakes: ['Too much weight on back foot', 'Leaning forward', 'Poor balance'],
    benefits: ['Unilateral leg development', 'Improved balance', 'Glute activation'],
    repsRange: '10-15 per leg',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    category: 'legs',
    subcategory: 'machine',
    difficulty: 'beginner',
    equipment: ['leg_press_machine'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    instructions: [
      'Sit in leg press machine with back flat',
      'Place feet on platform shoulder-width apart',
      'Lower weight by bending knees to 90 degrees',
      'Press up through heels',
      'Don\'t lock knees at top'
    ],
    tips: [
      'Keep back flat against pad',
      'Don\'t lower too far',
      'Press through heels',
      'Control the weight'
    ],
    variations: ['Single-leg Press', 'High-foot Press', 'Narrow-stance Press'],
    commonMistakes: ['Lowering too far', 'Locking knees', 'Placing feet too high or low'],
    benefits: ['Quad development', 'Safe loading', 'Isolation of leg muscles'],
    repsRange: '12-20',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 'leg_extensions',
    name: 'Leg Extensions',
    category: 'legs',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['leg_extension_machine'],
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['none'],
    instructions: [
      'Sit in leg extension machine',
      'Position legs under pad',
      'Extend legs up squeezing quadriceps',
      'Hold briefly at top',
      'Lower with control'
    ],
    tips: [
      'Full range of motion',
      'Squeeze quads at the top',
      'Control the negative',
      'Keep back against pad'
    ],
    variations: ['Single-leg Extensions', 'Partial Range Extensions'],
    commonMistakes: ['Using momentum', 'Not controlling the weight', 'Partial range of motion'],
    benefits: ['Quadriceps isolation', 'Good for rehabilitation', 'Pre-exhaustion exercise'],
    repsRange: '15-25',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'leg_curls',
    name: 'Leg Curls',
    category: 'legs',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['leg_curl_machine'],
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['calves'],
    instructions: [
      'Lie face down on leg curl machine',
      'Position legs under pad',
      'Curl heels toward glutes',
      'Squeeze hamstrings at top',
      'Lower with control'
    ],
    tips: [
      'Full range of motion',
      'Squeeze hamstrings at the top',
      'Don\'t let hips lift',
      'Control the negative'
    ],
    variations: ['Seated Leg Curls', 'Single-leg Curls'],
    commonMistakes: ['Lifting hips', 'Using momentum', 'Partial range of motion'],
    benefits: ['Hamstring isolation', 'Injury prevention', 'Balanced leg development'],
    repsRange: '15-25',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'calf_raises',
    name: 'Standing Calf Raises',
    category: 'legs',
    subcategory: 'isolation',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['calves'],
    secondaryMuscles: ['none'],
    instructions: [
      'Stand holding dumbbells with balls of feet on raised surface',
      'Let heels drop below platform level',
      'Rise up on toes as high as possible',
      'Squeeze calves at the top',
      'Lower with control'
    ],
    tips: [
      'Get full range of motion',
      'Pause at the top',
      'Control the descent',
      'Keep body straight'
    ],
    variations: ['Seated Calf Raises', 'Single-leg Calf Raises', 'Donkey Calf Raises'],
    commonMistakes: ['Partial range of motion', 'Bouncing at bottom', 'Not pausing at top'],
    benefits: ['Calf muscle development', 'Improved jumping ability', 'Better ankle stability'],
    repsRange: '15-25',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 3
  },
  {
    id: 'hip_thrusts',
    name: 'Hip Thrusts',
    category: 'legs',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['barbell', 'bench'],
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    instructions: [
      'Sit against bench with barbell over hips',
      'Plant feet firmly on ground',
      'Drive hips up squeezing glutes',
      'Create straight line from knees to shoulders',
      'Lower with control'
    ],
    tips: [
      'Squeeze glutes hard at the top',
      'Keep chin tucked',
      'Drive through heels',
      'Don\'t overextend back'
    ],
    variations: ['Single-leg Hip Thrusts', 'Glute Bridges'],
    commonMistakes: ['Not squeezing glutes', 'Overextending back', 'Poor foot position'],
    benefits: ['Glute development', 'Hip power', 'Improved athletic performance'],
    repsRange: '10-15',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 6
  },

  // CORE EXERCISES
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    subcategory: 'bodyweight',
    difficulty: 'beginner',
    equipment: ['none'],
    primaryMuscles: ['core', 'transverse_abdominis'],
    secondaryMuscles: ['shoulders', 'glutes'],
    instructions: [
      'Start in push-up position',
      'Lower to forearms keeping body straight',
      'Maintain straight line from head to heels',
      'Hold position while breathing normally',
      'Keep core tight throughout'
    ],
    tips: [
      'Don\'t let hips sag or pike up',
      'Breathe normally while holding',
      'Squeeze glutes to maintain position',
      'Focus on quality over duration'
    ],
    variations: ['Side Plank', 'Plank Up-downs', 'Plank with Leg Lifts'],
    commonMistakes: ['Sagging hips', 'Holding breath', 'Looking up'],
    benefits: ['Core stability', 'Improved posture', 'Functional strength'],
    repsRange: '30-60 seconds',
    setsRange: '3-4',
    restTime: '1 minute',
    caloriesPerMinute: 4
  },
  {
    id: 'side_plank',
    name: 'Side Plank',
    category: 'core',
    subcategory: 'bodyweight',
    difficulty: 'intermediate',
    equipment: ['none'],
    primaryMuscles: ['obliques', 'core'],
    secondaryMuscles: ['shoulders', 'glutes'],
    instructions: [
      'Lie on side supporting body on forearm',
      'Stack feet and keep body straight',
      'Lift hips off ground',
      'Hold position while breathing normally',
      'Keep body in straight line'
    ],
    tips: [
      'Don\'t let hips sag',
      'Keep shoulder over elbow',
      'Engage core throughout',
      'Start with shorter holds'
    ],
    variations: ['Side Plank with Leg Lifts', 'Side Plank Rotations'],
    commonMistakes: ['Hips sagging', 'Rolling forward or back', 'Holding breath'],
    benefits: ['Oblique strength', 'Core stability', 'Lateral strength'],
    repsRange: '20-45 seconds per side',
    setsRange: '3-4',
    restTime: '1 minute',
    caloriesPerMinute: 4
  },
  {
    id: 'russian_twists',
    name: 'Russian Twists',
    category: 'core',
    subcategory: 'bodyweight',
    difficulty: 'intermediate',
    equipment: ['medicine_ball'],
    primaryMuscles: ['obliques', 'core'],
    secondaryMuscles: ['hip_flexors'],
    instructions: [
      'Sit with knees bent, holding medicine ball',
      'Lean back slightly to engage core',
      'Rotate torso side to side',
      'Touch ball to ground beside hips',
      'Keep feet slightly off ground'
    ],
    tips: [
      'Focus on rotating from core, not arms',
      'Keep chest up',
      'Control the movement',
      'Don\'t rush the reps'
    ],
    variations: ['Weighted Russian Twists', 'Bicycle Crunches', 'Wood Chops'],
    commonMistakes: ['Moving too fast', 'Using arms instead of core', 'Rounding back too much'],
    benefits: ['Oblique strength', 'Rotational power', 'Core stability'],
    repsRange: '20-40 total',
    setsRange: '3-4',
    restTime: '1 minute',
    caloriesPerMinute: 5
  },
  {
    id: 'bicycle_crunches',
    name: 'Bicycle Crunches',
    category: 'core',
    subcategory: 'bodyweight',
    difficulty: 'intermediate',
    equipment: ['none'],
    primaryMuscles: ['obliques', 'rectus_abdominis'],
    secondaryMuscles: ['hip_flexors'],
    instructions: [
      'Lie on back with hands behind head',
      'Lift shoulders off ground',
      'Bring one knee to chest while rotating toward it',
      'Extend leg while switching to other side',
      'Continue alternating in cycling motion'
    ],
    tips: [
      'Don\'t pull on neck',
      'Focus on bringing elbow to knee',
      'Keep shoulders off ground',
      'Controlled movement, not fast'
    ],
    variations: ['Reverse Bicycle Crunches', 'Dead Bug'],
    commonMistakes: ['Pulling on neck', 'Moving too fast', 'Not rotating enough'],
    benefits: ['Targets obliques and abs', 'Dynamic core exercise', 'No equipment needed'],
    repsRange: '20-40 total',
    setsRange: '3-4',
    restTime: '1 minute',
    caloriesPerMinute: 5
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'core',
    subcategory: 'cardio',
    difficulty: 'intermediate',
    equipment: ['none'],
    primaryMuscles: ['core', 'hip_flexors'],
    secondaryMuscles: ['shoulders', 'legs'],
    instructions: [
      'Start in plank position',
      'Drive one knee toward chest',
      'Quickly switch legs',
      'Alternate legs in running motion',
      'Keep hips level and core tight'
    ],
    tips: [
      'Keep hips level, don\'t pike up',
      'Maintain plank position',
      'Land softly on balls of feet',
      'Keep core engaged throughout'
    ],
    variations: ['Cross-body Mountain Climbers', 'Slow Mountain Climbers'],
    commonMistakes: ['Piking hips up', 'Landing hard', 'Not keeping core tight'],
    benefits: ['Cardio conditioning', 'Core strength', 'Full body workout'],
    repsRange: '30-60 seconds',
    setsRange: '3-4',
    restTime: '1 minute',
    caloriesPerMinute: 8
  },
  {
    id: 'dead_bug',
    name: 'Dead Bug',
    category: 'core',
    subcategory: 'bodyweight',
    difficulty: 'beginner',
    equipment: ['none'],
    primaryMuscles: ['core', 'transverse_abdominis'],
    secondaryMuscles: ['hip_flexors'],
    instructions: [
      'Lie on back with arms extended toward ceiling',
      'Lift knees to 90 degrees',
      'Slowly lower opposite arm and leg',
      'Return to start and repeat other side',
      'Keep core engaged throughout'
    ],
    tips: [
      'Keep lower back pressed to floor',
      'Move slowly and controlled',
      'Don\'t let back arch',
      'Focus on core stability'
    ],
    variations: ['Single-arm Dead Bug', 'Single-leg Dead Bug'],
    commonMistakes: ['Back arching', 'Moving too fast', 'Not engaging core'],
    benefits: ['Core stability', 'Spinal stability', 'Coordination'],
    repsRange: '10-20 per side',
    setsRange: '3-4',
    restTime: '1 minute',
    caloriesPerMinute: 3
  },
  {
    id: 'leg_raises',
    name: 'Leg Raises',
    category: 'core',
    subcategory: 'bodyweight',
    difficulty: 'intermediate',
    equipment: ['none'],
    primaryMuscles: ['lower_abs', 'hip_flexors'],
    secondaryMuscles: ['core'],
    instructions: [
      'Lie on back with legs straight',
      'Keep hands at sides or under lower back',
      'Lift legs up to 90 degrees',
      'Lower legs slowly without touching ground',
      'Keep core engaged throughout'
    ],
    tips: [
      'Don\'t let legs touch ground',
      'Keep lower back pressed down',
      'Control the descent',
      'Start with bent knees if too difficult'
    ],
    variations: ['Hanging Leg Raises', 'Bent-knee Leg Raises'],
    commonMistakes: ['Back arching', 'Using momentum', 'Legs touching ground'],
    benefits: ['Lower ab development', 'Hip flexor strength', 'Core endurance'],
    repsRange: '10-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 4
  },
  {
    id: 'hanging_leg_raises',
    name: 'Hanging Leg Raises',
    category: 'core',
    subcategory: 'bodyweight',
    difficulty: 'advanced',
    equipment: ['pull_up_bar'],
    primaryMuscles: ['lower_abs', 'hip_flexors'],
    secondaryMuscles: ['lats', 'forearms'],
    instructions: [
      'Hang from pull-up bar',
      'Keep legs straight or bent',
      'Lift knees/legs toward chest',
      'Lower with control',
      'Don\'t swing body'
    ],
    tips: [
      'Control the movement, don\'t swing',
      'Engage core throughout',
      'Start with bent knees',
      'Full range of motion'
    ],
    variations: ['Bent-knee Hanging Raises', 'Hanging Knee Raises'],
    commonMistakes: ['Swinging body', 'Using momentum', 'Partial range of motion'],
    benefits: ['Advanced core exercise', 'Grip strength', 'Functional strength'],
    repsRange: '5-15',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 6
  },

  // CARDIO EXERCISES
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'cardio',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['none'],
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['cardiovascular_system'],
    instructions: [
      'Start standing, drop into squat position',
      'Place hands on floor, jump feet back to plank',
      'Perform push-up (optional)',
      'Jump feet back to squat position',
      'Explode up with arms overhead'
    ],
    tips: [
      'Land softly on each transition',
      'Keep core tight in plank position',
      'Move at your own pace',
      'Focus on form over speed'
    ],
    variations: ['Half Burpees', 'Burpee Box Jumps', 'Single-arm Burpees'],
    commonMistakes: ['Sloppy form when tired', 'Not fully extending at top', 'Landing hard'],
    benefits: ['Full body conditioning', 'Cardiovascular fitness', 'Fat burning'],
    repsRange: '5-15',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 12
  },
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    subcategory: 'bodyweight',
    difficulty: 'beginner',
    equipment: ['none'],
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['cardiovascular_system'],
    instructions: [
      'Start standing with feet together, arms at sides',
      'Jump feet apart while raising arms overhead',
      'Jump back to starting position',
      'Maintain smooth, rhythmic movement',
      'Land softly on balls of feet'
    ],
    tips: [
      'Land softly to protect joints',
      'Keep core engaged',
      'Maintain steady rhythm',
      'Breathe regularly'
    ],
    variations: ['Star Jumps', 'Half Jacks', 'Squat Jacks'],
    commonMistakes: ['Landing hard', 'Moving arms without control', 'Going too fast'],
    benefits: ['Cardiovascular warm-up', 'Full body activation', 'Coordination'],
    repsRange: '20-50',
    setsRange: '3-4',
    restTime: '30 seconds',
    caloriesPerMinute: 8
  },
  {
    id: 'high_knees',
    name: 'High Knees',
    category: 'cardio',
    subcategory: 'bodyweight',
    difficulty: 'beginner',
    equipment: ['none'],
    primaryMuscles: ['hip_flexors', 'quadriceps'],
    secondaryMuscles: ['calves', 'core'],
    instructions: [
      'Stand with feet hip-width apart',
      'Lift one knee up toward chest',
      'Quickly switch to other leg',
      'Pump arms as if running',
      'Stay on balls of feet'
    ],
    tips: [
      'Lift knees to hip height or higher',
      'Stay on balls of feet',
      'Pump arms for momentum',
      'Keep core engaged'
    ],
    variations: ['High Knees with Twist', 'Stationary High Knees'],
    commonMistakes: ['Not lifting knees high enough', 'Landing on heels', 'Poor arm movement'],
    benefits: ['Cardiovascular fitness', 'Leg strength', 'Coordination'],
    repsRange: '30-60 seconds',
    setsRange: '3-4',
    restTime: '30 seconds',
    caloriesPerMinute: 8
  },
  {
    id: 'butt_kickers',
    name: 'Butt Kickers',
    category: 'cardio',
    subcategory: 'bodyweight',
    difficulty: 'beginner',
    equipment: ['none'],
    primaryMuscles: ['hamstrings', 'calves'],
    secondaryMuscles: ['glutes', 'core'],
    instructions: [
      'Stand with feet hip-width apart',
      'Kick one heel up toward glutes',
      'Quickly switch to other leg',
      'Pump arms as if running',
      'Stay light on your feet'
    ],
    tips: [
      'Try to kick heels to glutes',
      'Stay on balls of feet',
      'Quick, light movements',
      'Keep torso upright'
    ],
    variations: ['Stationary Butt Kickers', 'Butt Kickers with Arms'],
    commonMistakes: ['Not kicking high enough', 'Leaning forward', 'Heavy foot strikes'],
    benefits: ['Hamstring activation', 'Cardiovascular fitness', 'Dynamic warm-up'],
    repsRange: '30-60 seconds',
    setsRange: '3-4',
    restTime: '30 seconds',
    caloriesPerMinute: 7
  },
  {
    id: 'box_jumps',
    name: 'Box Jumps',
    category: 'cardio',
    subcategory: 'plyometric',
    difficulty: 'intermediate',
    equipment: ['box', 'platform'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['calves', 'core'],
    instructions: [
      'Stand in front of box with feet shoulder-width apart',
      'Bend knees and swing arms back',
      'Jump explosively onto box',
      'Land softly with both feet',
      'Step down carefully'
    ],
    tips: [
      'Start with lower box height',
      'Land softly on box',
      'Step down, don\'t jump down',
      'Full hip extension at top'
    ],
    variations: ['Single-leg Box Jumps', 'Lateral Box Jumps'],
    commonMistakes: ['Box too high', 'Landing hard', 'Jumping down instead of stepping'],
    benefits: ['Explosive power', 'Leg strength', 'Athletic performance'],
    repsRange: '5-12',
    setsRange: '3-4',
    restTime: '2-3 minutes',
    caloriesPerMinute: 10
  },
  {
    id: 'jump_squats',
    name: 'Jump Squats',
    category: 'cardio',
    subcategory: 'plyometric',
    difficulty: 'intermediate',
    equipment: ['none'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['calves', 'core'],
    instructions: [
      'Start in squat position',
      'Lower into squat',
      'Explode up jumping as high as possible',
      'Land softly back in squat position',
      'Immediately go into next rep'
    ],
    tips: [
      'Land softly to protect knees',
      'Full squat depth',
      'Explode up with maximum effort',
      'Keep core engaged'
    ],
    variations: ['Single-leg Jump Squats', 'Jump Squats with 180° Turn'],
    commonMistakes: ['Landing hard', 'Not squatting deep enough', 'Poor landing mechanics'],
    benefits: ['Explosive power', 'Cardiovascular fitness', 'Leg strength'],
    repsRange: '10-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 10
  },

  // FUNCTIONAL EXERCISES
  {
    id: 'farmers_walk',
    name: 'Farmer\'s Walk',
    category: 'functional',
    subcategory: 'compound',
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    primaryMuscles: ['traps', 'forearms', 'core'],
    secondaryMuscles: ['legs', 'shoulders'],
    instructions: [
      'Hold heavy dumbbells at sides',
      'Walk forward with good posture',
      'Keep shoulders back and core tight',
      'Take controlled steps',
      'Maintain grip on weights'
    ],
    tips: [
      'Keep shoulders back and down',
      'Don\'t lean forward or back',
      'Take controlled steps',
      'Squeeze weights tightly'
    ],
    variations: ['Single-arm Farmer\'s Walk', 'Suitcase Carry', 'Overhead Carry'],
    commonMistakes: ['Leaning forward', 'Taking rushed steps', 'Dropping shoulders'],
    benefits: ['Grip strength', 'Core stability', 'Functional strength'],
    repsRange: '20-50 steps',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 6
  },
  {
    id: 'turkish_getup',
    name: 'Turkish Get-up',
    category: 'functional',
    subcategory: 'compound',
    difficulty: 'advanced',
    equipment: ['kettlebell'],
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['core', 'shoulders', 'legs'],
    instructions: [
      'Lie on back holding kettlebell in right hand',
      'Roll to sitting position keeping weight overhead',
      'Get to kneeling position',
      'Stand up while maintaining overhead position',
      'Reverse the movement to return to lying'
    ],
    tips: [
      'Start with light weight to learn movement',
      'Keep eyes on weight throughout',
      'Move slowly and controlled',
      'Practice each step separately first'
    ],
    variations: ['Half Get-up', 'Bodyweight Get-up'],
    commonMistakes: ['Moving too fast', 'Not watching weight', 'Skipping steps'],
    benefits: ['Full body coordination', 'Shoulder stability', 'Core strength'],
    repsRange: '3-8 per side',
    setsRange: '2-3',
    restTime: '2-3 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'bear_crawl',
    name: 'Bear Crawl',
    category: 'functional',
    subcategory: 'bodyweight',
    difficulty: 'intermediate',
    equipment: ['none'],
    primaryMuscles: ['core', 'shoulders'],
    secondaryMuscles: ['quadriceps', 'hip_flexors'],
    instructions: [
      'Start on hands and knees',
      'Lift knees slightly off ground',
      'Crawl forward by moving opposite hand and foot',
      'Keep hips low and core engaged',
      'Maintain steady rhythm'
    ],
    tips: [
      'Keep knees just off ground',
      'Move opposite hand and foot together',
      'Keep core tight',
      'Don\'t let hips pike up'
    ],
    variations: ['Reverse Bear Crawl', 'Bear Crawl with Push-up'],
    commonMistakes: ['Knees too high', 'Moving too fast', 'Poor coordination'],
    benefits: ['Full body coordination', 'Core stability', 'Shoulder strength'],
    repsRange: '20-40 steps',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 7
  },
  {
    id: 'kettlebell_swings',
    name: 'Kettlebell Swings',
    category: 'functional',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['kettlebell'],
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['core', 'shoulders', 'back'],
    instructions: [
      'Stand with feet wider than shoulders',
      'Hold kettlebell with both hands',
      'Hinge at hips and swing kettlebell between legs',
      'Drive hips forward to swing kettlebell to shoulder height',
      'Let kettlebell fall back between legs'
    ],
    tips: [
      'Power comes from hips, not arms',
      'Keep back straight throughout',
      'Squeeze glutes at top of swing',
      'Let gravity bring kettlebell down'
    ],
    variations: ['Single-arm Swings', 'American Swings'],
    commonMistakes: ['Using arms instead of hips', 'Squatting instead of hinging', 'Poor posture'],
    benefits: ['Hip power', 'Cardiovascular fitness', 'Posterior chain strength'],
    repsRange: '15-30',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 10
  },
  {
    id: 'battle_ropes',
    name: 'Battle Ropes',
    category: 'functional',
    subcategory: 'cardio',
    difficulty: 'intermediate',
    equipment: ['battle_ropes'],
    primaryMuscles: ['shoulders', 'core'],
    secondaryMuscles: ['arms', 'back', 'legs'],
    instructions: [
      'Hold one end of rope in each hand',
      'Stand with feet shoulder-width apart',
      'Create waves by moving arms up and down alternately',
      'Keep core engaged throughout',
      'Maintain steady rhythm'
    ],
    tips: [
      'Keep core tight',
      'Use your whole body',
      'Maintain steady rhythm',
      'Don\'t hold your breath'
    ],
    variations: ['Spirals', 'Slams', 'Side-to-side Waves'],
    commonMistakes: ['Using only arms', 'Poor core engagement', 'Irregular rhythm'],
    benefits: ['Full body conditioning', 'Cardiovascular fitness', 'Core strength'],
    repsRange: '30-60 seconds',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 12
  },
  {
    id: 'medicine_ball_slams',
    name: 'Medicine Ball Slams',
    category: 'functional',
    subcategory: 'compound',
    difficulty: 'intermediate',
    equipment: ['medicine_ball'],
    primaryMuscles: ['core', 'shoulders'],
    secondaryMuscles: ['back', 'legs'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold medicine ball overhead',
      'Slam ball down with maximum force',
      'Pick up ball and repeat',
      'Use your whole body in the movement'
    ],
    tips: [
      'Use your whole body',
      'Slam with maximum force',
      'Keep core engaged',
      'Follow through with the slam'
    ],
    variations: ['Overhead Slams', 'Side Slams', 'Rotational Slams'],
    commonMistakes: ['Using only arms', 'Not following through', 'Poor core engagement'],
    benefits: ['Explosive power', 'Core strength', 'Stress relief'],
    repsRange: '10-20',
    setsRange: '3-4',
    restTime: '1-2 minutes',
    caloriesPerMinute: 10
  }
]

export const EQUIPMENT_CATEGORIES = {
  'none': 'Bodyweight',
  'dumbbells': 'Dumbbells',
  'barbell': 'Barbell',
  'kettlebell': 'Kettlebell',
  'medicine_ball': 'Medicine Ball',
  'battle_ropes': 'Battle Ropes',
  'resistance_bands': 'Resistance Bands',
  'pull_up_bar': 'Pull-up Bar',
  'bench': 'Bench',
  'incline_bench': 'Incline Bench',
  'decline_bench': 'Decline Bench',
  'squat_rack': 'Squat Rack',
  'cable_machine': 'Cable Machine',
  'leg_press_machine': 'Leg Press',
  'leg_extension_machine': 'Leg Extension',
  'leg_curl_machine': 'Leg Curl',
  'lat_pulldown_machine': 'Lat Pulldown',
  'parallel_bars': 'Parallel Bars',
  't_bar': 'T-Bar',
  'plates': 'Weight Plates',
  'rope': 'Rope Attachment',
  'box': 'Jump Box',
  'platform': 'Platform',
  'stability_ball': 'Stability Ball',
  'foam_roller': 'Foam Roller',
  'yoga_mat': 'Yoga Mat'
}

export const MUSCLE_GROUPS = {
  'chest': 'Chest',
  'back': 'Back', 
  'shoulders': 'Shoulders',
  'arms': 'Arms',
  'legs': 'Legs',
  'core': 'Core',
  'cardio': 'Cardio',
  'functional': 'Functional'
}

export const DIFFICULTY_LEVELS = {
  'beginner': 'Beginner',
  'intermediate': 'Intermediate', 
  'advanced': 'Advanced'
}