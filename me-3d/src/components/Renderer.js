import * as THREE from 'three';

export default function Renderer() {
  const canvas = document.querySelector('canvas.game');
  if (!canvas) {
    throw new Error('Canvas element with class "game" not found.');
  }
  // alpha = transparent background
  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // enable shadows
  return renderer;
}