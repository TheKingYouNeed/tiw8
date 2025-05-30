import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentQuestion } from '../store/slices/eventsSlice';
import type { Question } from '../models';
import OneDollar from '../OneDollar';

interface Props {
  eventId: string;
  questions: Question[];
  currentQuestionId: string;
}

const QuestionCanvas = ({ eventId, questions, currentQuestionId }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paint, setPaint] = useState(false);
  const [gesture, setGesture] = useState(false);
  const [gesturePoints, setGesturePoints] = useState<[number, number][]>([]);
  const [recognizedGesture, setRecognizedGesture] = useState<string>('');
  const recognizerRef = useRef<any>(null);

  // Initialize the gesture recognizer with the $1 algorithm
  useEffect(() => {
    // Create a new $1 recognizer with lower threshold for better mobile experience
    recognizerRef.current = new OneDollar({
      score: 25, // Even lower threshold for better sensitivity on mobile
      parts: 32, // Fewer points for faster recognition
      step: 2,   // Rotation step
      angle: 45, // Rotation angle
      size: 200, // Size of bounding box
    });

    console.log('$1 Recognizer initialized with options:', {
      score: 25,
      parts: 32,
      step: 2,
      angle: 45,
      size: 200
    });

    // Clear existing templates
    recognizerRef.current.templates = [];
    
    // IMPORTANT: These names match what the navigation function expects
    // 'right' means "navigate to next question" (left-to-right swipe)
    // 'left' means "navigate to previous question" (right-to-left swipe)
    
    // Define right-to-left swipe as 'left' (for previous question)
    recognizerRef.current.add('left', [
      [200, 100], [150, 100], [100, 100], [50, 100]
    ]);
    
    // Define left-to-right swipe as 'right' (for next question)
    recognizerRef.current.add('right', [
      [50, 100], [100, 100], [150, 100], [200, 100]
    ]);
    
    // Add more variations for better recognition
    recognizerRef.current.add('left', [
      [200, 90], [150, 100], [100, 100], [50, 110]
    ]);
    
    recognizerRef.current.add('right', [
      [50, 90], [100, 100], [150, 100], [200, 110]
    ]);
    
    console.log('$1 Gesture recognizer initialized with horizontal swipe patterns');
  }, []);
  
  // Simplified canvas drawing for better mobile experience
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw instructions when no gesture is being drawn
    if (!gesture || gesturePoints.length <= 1) {
      ctx.font = '14px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('Swipe horizontally to navigate', canvas.width / 2, canvas.height / 2);
    }
    
    // Draw gesture path if we're in gesture mode
    if (gesture && gesturePoints.length > 1) {
      // Use a simple bright color for better visibility on dark backgrounds
      ctx.beginPath();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Convert normalized points to canvas coordinates
      const firstPoint = gesturePoints[0];
      ctx.moveTo(firstPoint[0] * canvas.width, firstPoint[1] * canvas.height);
      
      for (let i = 1; i < gesturePoints.length; i++) {
        const point = gesturePoints[i];
        ctx.lineTo(point[0] * canvas.width, point[1] * canvas.height);
      }
      
      ctx.stroke();
      
      // Draw arrows to indicate direction
      if (gesturePoints.length > 2) {
        const firstPoint = gesturePoints[0];
        const lastPoint = gesturePoints[gesturePoints.length - 1];
        
        // Determine direction
        const isRightToLeft = firstPoint[0] > lastPoint[0];
        
        // Draw direction indicator
        ctx.fillStyle = isRightToLeft ? '#ff6b6b' : '#2ecc71';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(isRightToLeft ? '← Previous' : 'Next →', canvas.width / 2, 30);
      }
    }
    
    // Show recognized gesture with improved feedback
    if (recognizedGesture) {
      // Draw a semi-transparent background for better text visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      
      // Draw the recognized gesture text
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = recognizedGesture === 'not recognized' ? '#ff6b6b' : '#2ecc71';
      ctx.textAlign = 'center';
      
      const displayText = recognizedGesture === 'left' ? '← Previous' :
                         recognizedGesture === 'right' ? 'Next →' :
                         'Try a simple horizontal swipe';
      
      ctx.fillText(displayText, canvas.width / 2, canvas.height - 15);
    }
  };
  
  // Handle recognized gestures - using the same logic as the blue buttons at the top
  const handleGestureRecognized = (gestureName: string) => {
    if (!questions || questions.length <= 1) {
      console.log('Not enough questions to navigate');
      return;
    }
    
    // Find the current question index
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    console.log(`Current question index: ${currentIndex}, total questions: ${questions.length}`);
    
    if (currentIndex === -1) {
      console.log('Current question not found in questions array');
      return;
    }
    
    // CRITICAL: This is the key to correct navigation
    // 'right' gesture name means left-to-right swipe = Next question (like right blue button)
    // 'left' gesture name means right-to-left swipe = Previous question (like left blue button)
    console.log(`Processing gesture: ${gestureName} for navigation`);
    
    let nextIndex = currentIndex;
    if (gestureName === 'right') { // Left-to-right swipe = NEXT
      // Go to next question
      nextIndex = (currentIndex + 1) % questions.length;
      console.log(`Going to NEXT question (index ${nextIndex})`);
    } else if (gestureName === 'left') { // Right-to-left swipe = PREVIOUS
      // Go to previous question
      nextIndex = (currentIndex - 1 + questions.length) % questions.length;
      console.log(`Going to PREVIOUS question (index ${nextIndex})`);
    } else {
      console.log(`Unknown gesture: ${gestureName}, not navigating`);
      return;
    }
    
    // If the index changed, navigate to the new question
    if (nextIndex !== currentIndex) {
      const nextQuestion = questions[nextIndex];
      console.log(`Navigating to question: ${nextQuestion.id}`);
      
      try {
        // First dispatch the action to update Redux state
        dispatch(setCurrentQuestion(nextQuestion.id));
        console.log('Dispatched setCurrentQuestion action');
        
        // Get the current URL path to determine if we're in admin mode
        const isAdmin = window.location.pathname.includes('/admin/');
        
        // Construct the path exactly as it appears in the URL bar
        // This ensures we maintain the same route structure
        const baseRoute = isAdmin ? `/admin/event/${eventId}` : `/event/${eventId}`;
        const newPath = `${baseRoute}/question/${nextQuestion.id}`;
        console.log(`Navigating to: ${newPath}`);
        
        // Use React Router's navigate instead of window.location.href
        // This prevents a full page reload and maintains the SPA experience
        navigate(newPath);
        console.log('Navigation initiated with React Router');
      } catch (error) {
        console.error('Error during navigation:', error);
      }
    } else {
      console.log('No navigation needed, staying on current question');
    }
  };
  
  // Set up canvas and event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redraw();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const handlePointerDown = (ev: PointerEvent) => {
      // Prevent default to avoid scrolling on touch devices
      ev.preventDefault();
      
      // Get pointer position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width;
      const y = (ev.clientY - rect.top) / rect.height;
      
      // Start tracking the gesture
      setPaint(true);
      setGesture(true);
      setGesturePoints([[x, y]]);
      setRecognizedGesture('');
      
      // Capturer le pointeur pour une meilleure expérience tactile
      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(ev.pointerId);
      }
      
      redraw();
    };

    const handlePointerMove = (ev: PointerEvent) => {
      // Only track if we're in painting mode
      if (paint) {
        ev.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width;
        const y = (ev.clientY - rect.top) / rect.height;
        
        // Add point to gesture
        setGesturePoints(prev => [...prev, [x, y]]);
        redraw();
      }
    };

    const handlePointerUp = (ev: PointerEvent) => {
      // End tracking
      setPaint(false);
      
      // Release pointer capture
      if (canvas.releasePointerCapture) {
        try {
          canvas.releasePointerCapture(ev.pointerId);
        } catch (e) {
          console.log('Error releasing pointer capture:', e);
        }
      }
      
      // Process the gesture if we have enough points
      if (gesture && gesturePoints.length > 2) { // Even lower minimum for better mobile experience
        console.log(`Processing gesture with ${gesturePoints.length} points`);
        
        // Simple direction detection for more reliable navigation
        if (gesturePoints.length >= 2) {
          const firstPoint = gesturePoints[0];
          const lastPoint = gesturePoints[gesturePoints.length - 1];
          const deltaX = lastPoint[0] - firstPoint[0];
          
          // If horizontal movement is significant enough
          if (Math.abs(deltaX) > 0.15) { // 15% of canvas width
            // CRITICAL FIX: Determine direction based on horizontal movement
            // Left-to-right swipe (deltaX > 0) = 'right' gesture = Next question
            // Right-to-left swipe (deltaX < 0) = 'left' gesture = Previous question
            const simpleDirection = deltaX > 0 ? 'right' : 'left';
            console.log(`Simple direction detection: ${simpleDirection} (deltaX: ${deltaX})`);
            console.log(`deltaX > 0 (${deltaX > 0}) means ${deltaX > 0 ? 'left-to-right swipe = NEXT' : 'right-to-left swipe = PREVIOUS'}`);
            
            // Try the $1 recognizer first
            // Convert normalized points to actual canvas coordinates for recognition
            const points = gesturePoints.map(([x, y]) => {
              return [x * canvas.width, y * canvas.height] as [number, number];
            });
            
            // Try to recognize the gesture
            const result = recognizerRef.current.check(points);
            
            if (result && typeof result === 'object' && result.score >= 0.2) {
              // We have a recognized gesture with acceptable score
              const gestureName = result.name;
              const gestureScore = result.score;
              
              console.log(`$1 Gesture recognized: ${gestureName} (score: ${gestureScore})`);
              console.log(`Using $1 recognizer result: ${gestureName} = ${gestureName === 'right' ? 'NEXT' : 'PREVIOUS'}`);
              setRecognizedGesture(gestureName);
              handleGestureRecognized(gestureName);
            } else {
              // Fall back to simple direction detection
              console.log(`Falling back to simple direction: ${simpleDirection}`);
              console.log(`Using simple direction: ${simpleDirection} = ${simpleDirection === 'right' ? 'NEXT' : 'PREVIOUS'}`);
              setRecognizedGesture(simpleDirection);
              handleGestureRecognized(simpleDirection);
            }
          } else {
            // Not enough horizontal movement
            console.log('Not enough horizontal movement for direction detection');
            setRecognizedGesture('not recognized');
          }
        } else {
          // No gesture recognized
          console.log('No gesture recognized - not enough points');
          setRecognizedGesture('not recognized');
        }
        
        // Clear the gesture after a delay to show feedback
        setTimeout(() => {
          setGesture(false);
          setGesturePoints([]);
          setRecognizedGesture('');
          redraw();
        }, 1200); // Slightly shorter delay for better mobile experience
      } else if (gesturePoints.length > 0) {
        // Too few points for reliable recognition
        console.log(`Too few points (${gesturePoints.length}) for reliable recognition, need at least 3`);
        setRecognizedGesture('not recognized');
        
        // Clear after a shorter delay
        setTimeout(() => {
          setGesture(false);
          setGesturePoints([]);
          setRecognizedGesture('');
          redraw();
        }, 800);
      }
    };

    // Add event listeners
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [gesture, gesturePoints, paint, recognizedGesture]);

  // Get the current and adjacent question titles for better feedback
  const getCurrentQuestionInfo = () => {
    if (!questions || questions.length <= 1 || !currentQuestionId) {
      return { current: 'Current Question', prev: 'Previous', next: 'Next' };
    }
    
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex === -1) return { current: 'Current Question', prev: 'Previous', next: 'Next' };
    
    const prevIndex = (currentIndex - 1 + questions.length) % questions.length;
    const nextIndex = (currentIndex + 1) % questions.length;
    
    return {
      current: questions[currentIndex].text.substring(0, 20) + (questions[currentIndex].text.length > 20 ? '...' : ''),
      prev: questions[prevIndex].text.substring(0, 15) + (questions[prevIndex].text.length > 15 ? '...' : ''),
      next: questions[nextIndex].text.substring(0, 15) + (questions[nextIndex].text.length > 15 ? '...' : '')
    };
  };
  
  const questionInfo = getCurrentQuestionInfo();
  
  return (
    <div 
      key={`question-canvas-${eventId}-${currentQuestionId}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: '10px',
        marginBottom: '10px'
      }}>
      <div style={{
        width: '95%',
        maxWidth: '450px',
        padding: '8px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.2)'
      }}>
        {/* Instruction header - no buttons, just text instructions */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '5px',
          padding: '8px',
          backgroundColor: 'rgba(37, 99, 235, 0.2)', // Blue to match the buttons
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Swipe left→right for next, right→left for previous
        </div>
        
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            touchAction: 'none', // Important to prevent default touch actions
            display: 'block'
          }}
          aria-label="Gesture drawing area for navigation"
        />
        
        {/* Only show one feedback element */}
        <div style={{
          textAlign: 'center',
          marginTop: '5px',
          padding: '8px',
          backgroundColor: recognizedGesture === 'not recognized' ? 'rgba(214,48,49,0.2)' : 
                          recognizedGesture ? 'rgba(39,174,96,0.2)' : 'rgba(37, 99, 235, 0.2)',
          color: recognizedGesture === 'not recognized' ? '#ff6b6b' : 
                 recognizedGesture ? '#2ecc71' : '#fff',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '14px',
          minHeight: '20px'
        }}>
          {recognizedGesture === 'left' ? `← Going to previous: ${questionInfo.prev}` :
           recognizedGesture === 'right' ? `Going to next: ${questionInfo.next} →` :
           recognizedGesture === 'not recognized' ? 'Try a simple left-to-right or right-to-left swipe' : 
           recognizedGesture ? `Recognized: ${recognizedGesture}` : 'Swipe left→right for next, right→left for previous'}
        </div>
      </div>
    </div>
  );
};

export default QuestionCanvas;
