import { useEventListener } from "@vueuse/core";
import * as Tone from "tone";
import { onBeforeMount, ref, type Ref } from 'vue'

export function useSlideTone(el: Ref<HTMLElement>,{
  src,
  fadeInDuration,
  fadeOutDuration,
}) {
  const isPlaying = ref(false);

  let sample: Tone.Player | null = null;
  let positionGainNode: Tone.Gain | null = null; // Gain node for distance from center effect
  let fadeGainNode: Tone.Gain | null = null; // Gain node for fade in/out effect ( attack and release )

  const positionGainRef = ref(1); // Initial position fade gain
  const fadeGainRef = ref(0); // Initial gain value
  let fadeGain = fadeGainRef.value; // Current gain value, starts at 0
  let state: 'muted' | 'fadeIn' | 'sustain' | 'fadeOut' = 'muted';

  onBeforeMount(() => {
    setupTone(); // Setup Tone.js components
    registerEventListeners();
  });

  function normalizedDistanceFromCenter(x: number, y: number, width: number, height: number): number {
  // Calculate the distance from the center of the touch area
  const centerX = width / 2;
  const centerY = height / 2;
  const distanceX = Math.abs(x - centerX);
  const distanceY = Math.abs(y - centerY);
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  // Normalize the distance to a value between 0 and 1
  return Math.min(distance / maxDistance, 1);
}

  function setupTone() {
    positionGainNode = new Tone.Gain(1).toDestination();
    fadeGainNode = new Tone.Gain(0)
    sample = new Tone.Player(
      "https://mobilephoneorchestra.com/api/sounds/s7ed37047-dd5d-4663-9aac-756d58b9558b.m4a"
    )
    sample.loopStart = 1.5; // Set the loop start time
    sample.loopEnd = 8.211; // Set the loop end time
    sample.loop = true; // Set the sample to loop
    // sample.autostart = true; // Start playing the sample automatically

    sample.connect(fadeGainNode); // Connect the sample to the gain node
    fadeGainNode.connect(positionGainNode); // Connect the fade gain node to the position gain node
  }

  function ensureSampleRunning() {
  // Ensure the sample is loaded and ready to play
  if (Tone.getContext().state !== 'running') {
    Tone.start().then(() => {
      if (sample?.state !== 'started') {
        sample?.start();
      }
      console.log('Tone.js context started');
    }).catch((error) => {
      console.error('Error starting Tone.js context:', error);
    });
  } else if (Tone.getContext().state === 'running' && sample?.state !== 'started') {
    sample?.start();
  }
}


  function registerEventListeners() {
  // Register pointerdown event listener on the play touch area
  useEventListener(el, 'pointerdown', (event) => {
    event.preventDefault(); // Prevent default behavior
    state = 'fadeIn'; // Change state to fadeIn

    ensureSampleRunning();

    if (positionGainNode) {
      positionGainNode.gain.value = normalizedDistanceFromCenter(
        event.clientX - el.value.getBoundingClientRect().left,
        event.clientY - el.value.getBoundingClientRect().top,
        el.value.clientWidth,
        el.value.clientHeight
      );
      positionGainRef.value = positionGainNode.gain.value; // Update the position gain reference
    }
  });

  // Register pointermove event listener on the play touch area
  useEventListener(el, 'pointermove', (event) => {
    event.preventDefault(); // Prevent default behavior

    if (positionGainNode && state !== 'muted') {
      // Update the position gain based on the pointer position
      // Only update if the state is not muted
      positionGainNode.gain.value = normalizedDistanceFromCenter(
        event.clientX - el.value.getBoundingClientRect().left,
        event.clientY - el.value.getBoundingClientRect().top,
        el.value.clientWidth,
        el.value.clientHeight
      );
      positionGainRef.value = positionGainNode.gain.value; // Update the position gain reference
    }
  });

  // Register pointerup event listener on the play touch area
  useEventListener(el, 'pointerup', (event) => {
    event.preventDefault(); // Prevent default behavior
    state = 'fadeOut'; // Change state to fadeOut
  });

  // register pointer up event listener on body to ensure fade out happens when pointer is released
  useEventListener(document.body, 'pointerup', (event) => {
    event.preventDefault(); // Prevent default behavior
    if (state === 'fadeIn' || state === 'sustain') {
      state = 'fadeOut'; // Change state to fadeOut if it was fadeIn or sustain
    }
  });
}

  function update( delta: number ) {
    // convert delta from ms to seconds for proper timing
    const deltaSeconds = delta / 1000;

    if (state === 'fadeIn') {
      fadeGain += deltaSeconds / fadeInDuration;
      if (fadeGain >= 1) {
        fadeGain = 1;
        state = 'sustain';
      }
      if (fadeGainNode) {
        fadeGainNode.gain.value = fadeGain;
      }
    } else if (state === 'fadeOut') {
      fadeGain -= deltaSeconds / fadeOutDuration;
      if (fadeGain <= 0) {
        fadeGain = 0;
        state = 'muted';
      }
      if (fadeGainNode) {
        fadeGainNode.gain.value = fadeGain;
      }
    }
    fadeGainRef.value = fadeGain;
  }

  return { update, isPlaying };
}
