import * as THREE from "three";
import { scene } from "./index";

export { Turtle };

class Turtle extends THREE.Object3D {
  private states: [THREE.Vector3, THREE.Euler][];
  private _group: THREE.Group;

  constructor() {
    super();
    this.states = [];
    this._group = new THREE.Group();
    scene.add(this._group);
  }

  private _drawLine(points: THREE.Vector3[]) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    this._group.add(new THREE.Line(geometry, material));
  }

  public reset() {
    this._group.clear();
    this.position.set(0, 0, 0);
    this.rotation.set(0, 0, 0);
  }

  /**
   * move
   * Move by distance and draw a line.
   */
  public move(distance: number) {
    const points: THREE.Vector3[] = [];
    points.push(new THREE.Vector3().copy(this.position));
    this.translateX(distance);
    points.push(new THREE.Vector3().copy(this.position));
    this._drawLine(points);
  }

  /**
   * Jump by distance without drawing a line.
   */
  public jump(distance: number) {
    this.translateX(distance);
  }

  /**
   * Move to the position and draw a line.
   */
  public moveTO(position: THREE.Vector3Tuple) {
    const points: THREE.Vector3[] = [];
    points.push(new THREE.Vector3().copy(this.position));
    this.position.set(...position);
    points.push(new THREE.Vector3().copy(this.position));

    this._drawLine(points);
  }

  /**
   * Jump to the position without drawing a line.
   */
  public jumpTo(position: THREE.Vector3Tuple) {
    this.position.set(...position);
  }

  /**
   * Turn turtle right.
   * @param angle Angle to turn in degrees
   */
  public turnRight(angle: number) {
    this.rotateY(deg2rad(-angle));
  }

  /**
   * Turn turtle left.
   * @param angle Angle to turn in degrees
   */
  public turnLeft(angle: number) {
    this.rotateY(deg2rad(angle));
  }

  /**
   * Turn turtle up.
   * @param angle Angle to turn in degrees
   */
  public turnUp(angle: number) {
    this.rotateZ(deg2rad(angle));
  }

  /**
   * Turn turtle down.
   * @param angle Angle to turn in degrees
   */
  public turnDown(angle: number) {
    this.rotateZ(deg2rad(-angle));
  }

  /**
   * Save current position and rotation.
   */
  public saveState() {
    this.states.push([
      new THREE.Vector3().copy(this.position),
      new THREE.Euler().copy(this.rotation),
    ]);
  }

  /**
   * Restore saved state.
   */
  public restoreState() {
    const [position, rotation] = this.states.pop();
    this.position.set(...position.toArray());
    this.setRotationFromEuler(rotation);
  }
}

function deg2rad(degree: number) {
  return (degree * Math.PI) / 180;
}
