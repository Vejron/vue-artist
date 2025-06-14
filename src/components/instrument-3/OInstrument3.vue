<script setup lang="ts">
import * as Tone from "tone";
import { onBeforeMount, ref } from 'vue'
import { templateRef, useEventListener, useRafFn } from '@vueuse/core'
import IChart from "@/components/IChart.vue";
import { useSlideTone } from "./slide-tone";

const props = withDefaults(defineProps<{  // Define the properties for the component
  src: string // the source URL of the audio sample
  fadeInDuration?: number // duration for fade-in effect in seconds, default is 1.0
  fadeOutDuration?: number // duration for fade-out effect in seconds, default is 2.5
}>(), {
  fadeInDuration: 1.0,
  fadeOutDuration: 2.5
});


const playTouchAreaEl = templateRef<HTMLDivElement>('playTouchAreaEl');
const slideTonePlayer = useSlideTone(playTouchAreaEl, {
  src: 'https://mobilephoneorchestra.com/api/sounds/s7ed37047-dd5d-4663-9aac-756d58b9558b.m4a',
  fadeInDuration: props.fadeInDuration,
  fadeOutDuration: props.fadeOutDuration
});
/*
let sample: Tone.Player | null = null;
let positionGainNode: Tone.Gain | null = null; // Gain node for distance from center effect
let fadeGainNode: Tone.Gain | null = null; // Gain node for fade in/out effect ( attack and release )

const playTouchAreaEl = templateRef<HTMLDivElement>('playTouchAreaEl');

const positionGainRef = ref(1); // Initial position fade gain
const fadeGainRef = ref(0); // Initial gain value
let fadeGain = fadeGainRef.value; // Current gain value, starts at 0
let state: 'muted' | 'fadeIn' | 'sustain' | 'fadeOut' = 'muted';

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
  useEventListener(playTouchAreaEl, 'pointerdown', (event) => {
    event.preventDefault(); // Prevent default behavior
    // Ensure Tone.js is started and the sample is playing
    console.log('Pointer down event triggered', Tone.getContext().state, sample?.state);
    ensureSampleRunning();

    state = 'fadeIn'; // Change state to fadeIn

    if (positionGainNode) {
      positionGainNode.gain.value = normalizedDistanceFromCenter(
        event.clientX - playTouchAreaEl.value.getBoundingClientRect().left,
        event.clientY - playTouchAreaEl.value.getBoundingClientRect().top,
        playTouchAreaEl.value.clientWidth,
        playTouchAreaEl.value.clientHeight
      );
      positionGainRef.value = positionGainNode.gain.value; // Update the position gain reference
    }
  });

  // Register pointermove event listener on the play touch area
  useEventListener(playTouchAreaEl, 'pointermove', (event) => {
    event.preventDefault(); // Prevent default behavior

    if (positionGainNode && state !== 'muted' && state !== 'fadeOut') {
      // Update the position gain based on the pointer position
      // Only update if the state is not muted or fadeOut
      positionGainNode.gain.value = normalizedDistanceFromCenter(
        event.clientX - playTouchAreaEl.value.getBoundingClientRect().left,
        event.clientY - playTouchAreaEl.value.getBoundingClientRect().top,
        playTouchAreaEl.value.clientWidth,
        playTouchAreaEl.value.clientHeight
      );
      positionGainRef.value = positionGainNode.gain.value; // Update the position gain reference
    }
  });

  // Register pointerup event listener on the play touch area
  useEventListener(playTouchAreaEl, 'pointerup', (event) => {
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

onBeforeMount(() => {
  // Initialize Tone.js
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
  registerEventListeners();
}); */

useRafFn(({ delta }) => {
  // convert delta from ms to seconds for proper timing
  const deltaSeconds = delta / 1000;
  slideTonePlayer.update(delta);
  /*
    if (state === 'fadeIn') {
      fadeGain += deltaSeconds / props.fadeInDuration;
      if (fadeGain >= 1) {
        fadeGain = 1;
        state = 'sustain';
      }
      if (fadeGainNode) {
        fadeGainNode.gain.value = fadeGain;
      }
    } else if (state === 'fadeOut') {
      fadeGain -= deltaSeconds / props.fadeOutDuration;
      if (fadeGain <= 0) {
        fadeGain = 0;
        state = 'muted';
      }
      if (fadeGainNode) {
        fadeGainNode.gain.value = fadeGain;
      }
    }
    fadeGainRef.value = fadeGain; */
});

const begin = () => {
  // Ensure Tone.js is started
  if (Tone.getContext().state !== 'running') {
    Tone.start();
    if (sample?.state !== 'started') {
      sample?.start();
    }
  }
  sample?.start()
  // Play a note
  //const synth = new Tone.Synth().toDestination();
  //synth.triggerAttackRelease("C4", "8n");
};
</script>

<template>
  <article class="bg">
    <svg xmlns="http://www.w3.org/2000/svg" width="297.637" height="297.64" viewBox="0 0 297.63699 297.64001">
      <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="501.641" y1="414.842" x2="492.183" y2="279.576"
        gradientTransform="translate(-444.46 -273.223)">
        <stop offset="0" />
        <stop offset=".063" stop-color="#002500" />
        <stop offset=".16" stop-color="#005800" />
        <stop offset=".262" stop-color="#008400" />
        <stop offset=".367" stop-color="#0A0" />
        <stop offset=".475" stop-color="#00C900" />
        <stop offset=".588" stop-color="#00E100" />
        <stop offset=".707" stop-color="#00F200" />
        <stop offset=".838" stop-color="#00FC00" />
        <stop offset="1" stop-color="#0F0" />
      </linearGradient>
      <path
        d="M114.032 137.643L78.294 4.216C56.38 6.88 35.407 10.754 15.69 15.693 6.157 53.746.59 96.45.052 141.65c8.167-.778 19.36-1.48 33.327-2.088 22.47-.978 50.328-1.635 80.652-1.92z"
        fill="url(#a)" />
      <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="684.913" y1="414.841" x2="694.372" y2="279.575"
        gradientTransform="translate(-444.46 -273.223)">
        <stop offset="0" />
        <stop offset=".063" stop-color="#250C00" />
        <stop offset=".16" stop-color="#581B00" />
        <stop offset=".262" stop-color="#842A00" />
        <stop offset=".367" stop-color="#AA3500" />
        <stop offset=".475" stop-color="#C93F00" />
        <stop offset=".588" stop-color="#E14700" />
        <stop offset=".707" stop-color="#F24C00" />
        <stop offset=".838" stop-color="#FC4F00" />
        <stop offset="1" stop-color="#FF5000" />
      </linearGradient>
      <path
        d="M264.255 139.56c13.967.608 25.16 1.31 33.328 2.09-.536-45.2-6.107-87.903-15.64-125.958-19.72-4.94-40.69-8.812-62.606-11.477L183.6 137.643c30.325.284 58.184.94 80.655 1.918z"
        fill="url(#b)" />
      <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="593.277" y1="410.793" x2="593.277" y2="273.224"
        gradientTransform="translate(-444.46 -273.223)">
        <stop offset="0" />
        <stop offset=".063" stop-color="#252500" />
        <stop offset=".16" stop-color="#585800" />
        <stop offset=".262" stop-color="#848400" />
        <stop offset=".367" stop-color="#AA0" />
        <stop offset=".475" stop-color="#C9C900" />
        <stop offset=".588" stop-color="#E1E100" />
        <stop offset=".707" stop-color="#F2F200" />
        <stop offset=".838" stop-color="#FCFC00" />
        <stop offset="1" stop-color="#FF0" />
      </linearGradient>
      <path
        d="M148.818 137.482c8.793 0 17.477.03 25.996.088l35.98-134.328C190.802 1.122 170.07 0 148.814 0 127.56 0 106.83 1.122 86.837 3.242l35.98 134.328c8.52-.058 17.207-.088 26.002-.088z"
        fill="url(#c)" />
      <linearGradient id="d" gradientUnits="userSpaceOnUse" x1="694.371" y1="564.51" x2="684.913" y2="429.245"
        gradientTransform="translate(-444.46 -273.223)">
        <stop offset="0" stop-color="#F00" />
        <stop offset=".162" stop-color="#FC0000" />
        <stop offset=".293" stop-color="#F20000" />
        <stop offset=".412" stop-color="#E10000" />
        <stop offset=".525" stop-color="#C90000" />
        <stop offset=".633" stop-color="#A00" />
        <stop offset=".738" stop-color="#840000" />
        <stop offset=".84" stop-color="#580000" />
        <stop offset=".937" stop-color="#250000" />
        <stop offset="1" />
      </linearGradient>
      <path
        d="M183.6 159.997l35.738 133.428c21.915-2.666 42.886-6.537 62.604-11.478 9.532-38.053 15.102-80.757 15.637-125.956-8.167.78-19.36 1.48-33.327 2.09-22.47.976-50.328 1.633-80.652 1.917z"
        fill="url(#d)" />
      <linearGradient id="e" gradientUnits="userSpaceOnUse" x1="492.18" y1="564.509" x2="501.639" y2="429.243"
        gradientTransform="translate(-444.46 -273.223)">
        <stop offset="0" stop-color="#0FF" />
        <stop offset=".162" stop-color="#00FCFC" />
        <stop offset=".293" stop-color="#00F2F2" />
        <stop offset=".412" stop-color="#00E1E1" />
        <stop offset=".525" stop-color="#00C9C9" />
        <stop offset=".633" stop-color="#0AA" />
        <stop offset=".738" stop-color="#008484" />
        <stop offset=".84" stop-color="#005858" />
        <stop offset=".937" stop-color="#002525" />
        <stop offset="1" />
      </linearGradient>
      <path
        d="M33.377 158.08c-13.968-.608-25.16-1.31-33.327-2.09.535 45.2 6.105 87.903 15.64 125.957 19.718 4.94 40.69 8.812 62.604 11.478l35.738-133.428c-30.324-.284-58.185-.94-80.655-1.918z"
        fill="url(#e)" />
      <linearGradient id="f" gradientUnits="userSpaceOnUse" x1="593.278" y1="570.863" x2="593.278" y2="433.291"
        gradientTransform="translate(-444.46 -273.223)">
        <stop offset="0" stop-color="#00F" />
        <stop offset=".162" stop-color="#0000FC" />
        <stop offset=".293" stop-color="#0000F2" />
        <stop offset=".412" stop-color="#0000E1" />
        <stop offset=".525" stop-color="#0000C9" />
        <stop offset=".633" stop-color="#00A" />
        <stop offset=".738" stop-color="#000084" />
        <stop offset=".84" stop-color="#000058" />
        <stop offset=".937" stop-color="#000025" />
        <stop offset="1" />
      </linearGradient>
      <path
        d="M148.815 160.16c-8.793 0-17.478-.032-25.997-.092l-35.98 134.33c19.993 2.12 40.722 3.242 61.978 3.242 21.257 0 41.986-1.122 61.98-3.242l-35.98-134.33c-8.522.06-17.207.09-26 .09z"
        fill="url(#f)" />
    </svg>

    <button type="button" @pointerdown="begin">
      Play Note
      <span class="icon">🎵</span>
    </button>
    <div ref="playTouchAreaEl" class="play-touch-area"></div>
    <IChart :value="positionGainRef" :min="0" :max="1" :width="200" :height="50" color="#4CAF50"
      backgroundColor="#f0f0f0" />
    <IChart :value="fadeGainRef" :min="0" :max="1" :width="200" :height="50" color="#4CAF50"
      backgroundColor="#f0f0f0" />
  </article>
</template>

<style scoped>
.bg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000000;
}

.play-touch-area {
  height: 200px;
  width: 200px;
  background-color: #f0f0f0;
}
</style>
