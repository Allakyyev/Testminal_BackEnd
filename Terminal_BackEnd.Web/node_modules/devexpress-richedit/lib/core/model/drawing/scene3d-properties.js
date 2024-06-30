import { Scene3DPropertiesInfoCache } from '../caches/hashed-caches/scene3d-properties-info-cache';
import { Scene3DRotationInfoCache } from '../caches/hashed-caches/scene3d-rotation-info-cache';
import { BackdropPlane } from './backdrop-plane';
export class Scene3DProperties {
    constructor() {
        this.backdropPlane = new BackdropPlane();
    }
    get isDefault() {
        return this.info == Scene3DPropertiesInfoCache.defaultItem &&
            this.cameraRotationInfo == Scene3DRotationInfoCache.defaultItem &&
            this.lightRigRotationInfo == Scene3DRotationInfoCache.defaultItem &&
            this.backdropPlane.isDefault;
    }
    clone() {
        const obj = new Scene3DProperties();
        obj.backdropPlane = this.backdropPlane.clone();
        obj.info = this.info.clone();
        obj.cameraRotationInfo = this.cameraRotationInfo.clone();
        obj.lightRigRotationInfo = this.lightRigRotationInfo.clone();
        return obj;
    }
}
