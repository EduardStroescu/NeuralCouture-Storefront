import {PlaneGeometry, Vector2} from 'three';

export class BentPlaneGeometry extends PlaneGeometry {
  constructor(...args) {
    super(...args);
    const z = 0.1;
    let p = this.parameters;
    let hw = p.width * 0.5;
    let a = new Vector2(-hw, 0);
    let b = new Vector2(0, z);
    let c = new Vector2(hw, 0);
    let ab = new Vector2().subVectors(a, b);
    let bc = new Vector2().subVectors(b, c);
    let ac = new Vector2().subVectors(a, c);
    let r =
      (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));
    let center = new Vector2(0, z - r);
    let baseV = new Vector2().subVectors(a, center);
    let baseAngle = baseV.angle() - Math.PI * 0.5;
    let arc = baseAngle * 2;
    let uv = this.attributes.uv;
    let pos = this.attributes.position;
    let mainV = new Vector2();
    for (let i = 0; i < uv.count; i++) {
      let uvRatio = 1 - uv.getX(i);
      let y = pos.getY(i);
      mainV.copy(c).rotateAround(center, arc * uvRatio);
      pos.setXYZ(i, mainV.x, y, -mainV.y);
    }
    pos.needsUpdate = true;
  }
}
