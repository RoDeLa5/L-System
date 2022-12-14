import * as THREE from "three";
import { scene } from "./index";

export { Turtle };

class Turtle extends THREE.Object3D {
  private states: [THREE.Vector3, THREE.Euler, THREE.Color][];
  private _group: THREE.Group;
  private _color: THREE.Color;

  public useInstancedMesh: boolean;
  public meshCount: { [type: string]: number };

  private geometries: { [type: string]: THREE.BufferGeometry };
  private materials: { [type: string]: THREE.Material };
  private meshes: { [type: string]: THREE.InstancedMesh };

  constructor() {
    super();
    this.states = [];
    this._group = new THREE.Group();
    scene.add(this._group);
    this._color = new THREE.Color(0xffffff);
    this.useInstancedMesh = false;
  }

  private _drawLine(points: THREE.Vector3[]) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: this._color });
    this._group.add(new THREE.Line(geometry, material));
  }

  public reset() {
    this._group.clear();
    this.position.set(0, 0, 0);
    this.rotation.set(0, Math.PI / 2, Math.PI / 2);
    if (this.useInstancedMesh) {
      if (this.geometries == undefined) {
        this.geometries = {};
        this.geometries.line = new THREE.BufferGeometry();
        this.geometries.sphere = new THREE.SphereGeometry();
      }
      if (this.materials == undefined) {
        this.materials = {};
        this.materials.line = new THREE.LineBasicMaterial();
        this.materials.sphere = new THREE.MeshBasicMaterial();
      }
      if (this.meshes != undefined) {
        Object.values(this.meshes).forEach((mesh) => {
          mesh.dispose();
        });
      }
      this.meshes.line = new THREE.InstancedMesh(
        this.geometries.line,
        this.materials.line,
        this.meshCount.line
      );
      this.meshes.sphere = new THREE.InstancedMesh(
        this.geometries.sphere,
        this.materials.sphere,
        this.meshCount.sphere
      );
      this._group.add(this.meshes.line, this.meshes.sphere);
    }
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
   * Rotate turtle around the looking direction
   * @param angle Angle to rotate in degrees
   */
  public rotate(angle: number) {
    this.rotateX(deg2rad(angle));
  }

  /**
   * Create a sphere.
   * @param radius sphere radius.
   * @param widthSegments number of horizontal segments. Minimum value is 3.
   * @param heightSegments number of vertical segments. Minimum value is 2.
   */
  public sphere(
    radius: number = 1,
    widthSegments: number = 6,
    heightSegments: number = 4
  ) {
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const material = new THREE.MeshBasicMaterial({ color: this._color });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(...this.position.toArray());
    this._group.add(sphere);
  }

  public color(color: THREE.ColorRepresentation) {
    this._color.set(color);
  }

  /**
   * Save current position and rotation.
   */
  public saveState() {
    this.states.push([
      new THREE.Vector3().copy(this.position),
      new THREE.Euler().copy(this.rotation),
      new THREE.Color().copy(this._color),
    ]);
  }

  /**
   * Restore saved state.
   */
  public restoreState() {
    const [position, rotation, color] = this.states.pop();
    this.position.set(...position.toArray());
    this.setRotationFromEuler(rotation);
    this._color = color;
  }
}

function deg2rad(degree: number) {
  return (degree * Math.PI) / 180;
}
