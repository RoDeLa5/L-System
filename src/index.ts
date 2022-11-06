import "./styles.css";
import { Turtle } from "./turtle";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export { scene };

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(0, 100, 100);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

const size = 100;
const divisions = 10;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

const turtle = new Turtle();

renderer.render(scene, camera);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
