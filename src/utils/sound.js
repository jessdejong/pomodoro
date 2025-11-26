/**
 * Play a notification sound using Web Audio API
 * @param {number} frequency - Frequency in Hz (default: 800)
 * @param {number} duration - Duration in milliseconds (default: 200)
 * @param {string} type - Oscillator type: 'sine', 'square', 'sawtooth', 'triangle' (default: 'sine')
 */
export function playNotificationSound(frequency = 800, duration = 200, type = 'sine') {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure oscillator
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    // Configure gain (volume) - fade in and out for smoother sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000);
    
    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.error('Error playing notification sound:', error);
    // Fallback: try to play a system beep if available
    try {
      // Some browsers support this
      if (window.speechSynthesis) {
        // Very quiet way to trigger audio context
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (fallbackError) {
      console.warn('Could not play notification sound');
    }
  }
}

/**
 * Play a pleasant completion sound (two-tone chime)
 */
export function playCompletionSound() {
  // Play two tones in sequence for a pleasant chime
  playNotificationSound(523.25, 150, 'sine'); // C5 note
  setTimeout(() => {
    playNotificationSound(659.25, 200, 'sine'); // E5 note
  }, 100);
}

