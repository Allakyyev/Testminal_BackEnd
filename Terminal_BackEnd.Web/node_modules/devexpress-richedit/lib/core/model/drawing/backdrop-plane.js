import { Scene3DVector } from './scene3d-vector';
export class BackdropPlane {
    constructor(normalVector = new Scene3DVector(), upVector = new Scene3DVector(), anchorPoint = new Scene3DVector()) {
        this.normalVector = normalVector;
        this.upVector = upVector;
        this.anchorPoint = anchorPoint;
    }
    get isDefault() {
        return this.anchorPoint.isDefault && this.normalVector.isDefault && this.upVector.isDefault;
    }
    clone() {
        return new BackdropPlane(this.normalVector.clone(), this.upVector.clone(), this.anchorPoint.clone());
    }
    equals(obj) {
        return obj &&
            this.normalVector.equals(obj.normalVector) &&
            this.upVector.equals(obj.upVector) &&
            this.anchorPoint.equals(obj.anchorPoint);
    }
    resetToStyle() {
        this.normalVector = new Scene3DVector(0, 0, 0);
        this.upVector = new Scene3DVector(0, 0, 0);
        this.anchorPoint = new Scene3DVector(0, 0, 0);
    }
}
