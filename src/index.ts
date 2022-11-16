import "./styles.css";
import { LSystem } from "./lsystem";
import { init, lsystem } from "./control";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export { scene };

init();

const controlContainerElm = document.getElementById("control-container");
let controlIsOn = false;

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

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", onResize);

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

/* const binaryTree = new LSystem(
  {
    "0": "move 1",
    "1": "move 1",
    "[": "saveState; turnLeft 45",
    "]": "restoreState; turnRight 45",
  },
  {
    "0": ["1[0]0".split(""), [1]],
    "1": ["11".split(""), [1]],
  },
  "0"
);

const fractalPlant = new LSystem(
  {
    X: "",
    F: "move 1",
    S: "color 0x6B8E23;\n sphere",
    "[": "saveState",
    "]": "restoreState",
    "+": "turnRight 25; turnUp 5",
    "-": "turnLeft 25; turnDown 5",
  },
  {
    X: ["F+[[X]-X]-F[-F[S]X]+X".split(""), [1]],
    F: ["FF".split(""), [1]],
    S: [[], [1]],
  },
  "X",
  6
); */

function update(_lsystem: LSystem) {
  if (_lsystem.grow()) {
    _lsystem.render();
  }
  lsystem.log();
}

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "l":
      console.log(lsystem);
      break;
    case "g":
      gridHelper.visible = !gridHelper.visible;
      break;
    case " ":
      if (!controlIsOn && lsystem != undefined) {
        update(lsystem);
      }
      break;
    case "Escape":
      toggleControl();
      break;
  }
});

function toggleControl() {
  if (controlIsOn) {
    controlContainerElm.style.display = "none";
    controlIsOn = false;
  } else {
    controlContainerElm.style.display = "block";
    controlIsOn = true;
  }
}
