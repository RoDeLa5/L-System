import * as THREE from "three";
import { scene } from "./index";

export { Turtle };

class Turtle extends THREE.Object3D {
  private states: [THREE.Vector3, THREE.Euler][];

  constructor() {
    super();
  }

  private _drawLine(points: THREE.Vector3[]) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    scene.add(new THREE.Line(geometry, material));
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
  public moveTO(position: THREE.Vector3) {
    const points: THREE.Vector3[] = [];
    points.push(new THREE.Vector3().copy(this.position));
    this.position.set(...position.toArray());
    points.push(new THREE.Vector3().copy(this.position));

    this._drawLine(points);
  }

  /**
   * Jump to the position without drawing a line.
   */
  public jumpTo(position: THREE.Vector3) {
    this.position.set(...position.toArray());
  }

  /**
   * Turn turtle right.
   */
  public turnRight(angle: number) {
    this.rotateY(-angle);
  }

  /**
   * Turn turtle left.
   */
  public turnLeft(angle: number) {
    this.rotateY(angle);
  }

  /**
   * Turn turtle up.
   */
  public turnUp(angle: number) {
    this.rotateZ(angle);
  }

  /**
   * Turn turtle down.
   */
  public turnDown(angle: number) {
    this.rotateZ(-angle);
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
