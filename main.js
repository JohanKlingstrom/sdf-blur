import './style.css';
import * as THREE from 'three';
import fragmentShader from './shaders/fragment.glsl';

const scene = new THREE.Scene();
const vMouse = new THREE.Vector2();
const vMouseDamp = new THREE.Vector2();
const vResolution = new THREE.Vector2();

let w = window.innerWidth;
let h = window.innerHeight;

const aspect = w / h;
const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

const onPointerMove = (e) => { vMouse.set(e.pageX, e.pageY) }
document.addEventListener('mousemove', onPointerMove);
document.addEventListener('pointermove', onPointerMove);
document.body.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });

const geometry = new THREE.BoxGeometry(1, 1);
const material = new THREE.ShaderMaterial({
  vertexShader: /* glsl */`
    varying vec2 v_texcoord;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        v_texcoord = uv;
    }`,
  fragmentShader,
  uniforms: {
    u_mouse: { value: vMouseDamp },
    u_resolution: { value: vResolution },
    u_pixelRatio: { value: 2 }
  },
  defines: {
    VAR: 0
  }
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

renderer.setSize(w, h);

camera.position.z = 1;

let time, lastTime = 0;
const animate = () => {
  // calculate delta time
  time = performance.now() * 0.001;
  const dt = time - lastTime;
  lastTime = time;

  // ease mouse motion with damping
  for (const k in vMouse) {
    if (k == 'x' || k == 'y') vMouseDamp[k] = THREE.MathUtils.damp(vMouseDamp[k], vMouse[k], 8, dt);
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();


const resize = () => {
  w = window.innerWidth;
  h = window.innerHeight;

  const dpr = Math.min(window.devicePixelRatio, 2);

  renderer.setSize(w, h);
  renderer.setPixelRatio(dpr);

  camera.left = -w / 2;
  camera.right = w / 2;
  camera.top = h / 2;
  camera.bottom = -h / 2;
  camera.updateProjectionMatrix();

  mesh.scale.set(w, h, 1);
  vResolution.set(w, h).multiplyScalar(dpr);
  mat.uniforms.u_pixelRatio.value = dpr;
};
resize();

window.addEventListener('resize', resize)