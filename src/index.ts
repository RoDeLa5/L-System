import "./styles.css";
import { LSystem } from "./lsystem";
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

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

const binaryTree = new LSystem(
  {
    "0": "move 1",
    "1": "move 1",
    "[": "saveState; turnLeft 45",
    "]": "restoreState; turnRight 45",
  },
  {
    "0": "1[0]0".split(""),
    "1": "11".split(""),
  },
  ["0"]
);

const fractalPlant = new LSystem(
  {
    X: "",
    F: "move 1",
    "[": "saveState",
    "]": "restoreState",
    "+": "turnRight 25",
    "-": "turnLeft 25",
  },
  {
    X: "F+[[X]-X]-F[-FX]+X".split(""),
    F: "FF".split(""),
  },
  ["X"]
);

function update(lsystem: LSystem) {
  lsystem.grow();
  lsystem.render();
  lsystem.log();
}

window.addEventListener("keyup", (e) => {
  if (e.key == " ") {
    update(fractalPlant);
  }
});
