import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();

let width = window.innerWidth;
let height = window.innerHeight;

const aspect = width / height;
const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1);
const material = new THREE.ShaderMaterial({
  vertexShader: /* glsl */`
    varying vec2 v_texcoord;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        v_texcoord = uv;
    }`,
  fragmentShader: /* glsl */`
    varying vec2 v_texcoord;
    void main() {
        vec2 st = v_texcoord;
        vec3 color = vec3(st.x, st.y, 1.0);
        gl_FragColor = vec4(color.rgb, 1.0);
    }`
});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

renderer.setSize(width, height);

camera.position.z = 1;

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();