# Swipe Gestures for Study Cards

## Overview
The study section now supports intuitive swipe gestures for mobile devices, making it easier to navigate through flashcards.

## How to Use

### Swipe Up - "I Know"
- **Gesture**: Swipe up on the flashcard
- **Action**: Marks the card as known and moves to the next card
- **Visual Feedback**: 
  - Card slides up and rotates slightly
  - Green indicator highlights
  - Card background turns light green
  - Haptic feedback (vibration) on mobile devices

### Swipe Down - "I Don't Know"
- **Gesture**: Swipe down on the flashcard
- **Action**: Marks the card as unknown and adds it to the review pile
- **Visual Feedback**:
  - Card slides down and rotates slightly
  - Red indicator highlights
  - Card background turns light red
  - Haptic feedback (vibration) on mobile devices

### Tap to Flip
- **Gesture**: Tap anywhere on the card
- **Action**: Flips the card to show the translation/back side
- **Note**: Works alongside swipe gestures

## Mobile Optimization

### Touch Responsiveness
- Optimized for mobile touch screens
- Prevents text selection during swipes
- Smooth animations with hardware acceleration
- Responsive design for all screen sizes

### Visual Indicators
- Clear "I Know" (green) and "I Don't Know" (red) indicators
- Dynamic highlighting based on swipe direction
- Smooth transitions and animations

### Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast indicators

## Technical Implementation

### Dependencies
- `@use-gesture/react` for gesture detection
- `react-spring` for smooth animations
- CSS custom properties for mobile optimization

### Gesture Configuration
- **Axis**: Vertical only (prevents accidental horizontal swipes)
- **Threshold**: 0.2 velocity for trigger
- **Bounds**: Limited movement range for better UX
- **Rubberband**: Elastic effect when dragging beyond bounds

### Performance
- Hardware-accelerated animations
- Optimized re-renders
- Efficient gesture handling
- Mobile-specific CSS optimizations

## Browser Support
- Modern browsers with touch support
- iOS Safari
- Android Chrome
- Desktop browsers (mouse drag support)

## Future Enhancements
- Customizable swipe sensitivity
- Different gesture patterns
- Sound effects
- Advanced haptic feedback patterns 