import { Scene3DRotationInfo } from '../../drawing/scene3d-rotation-info';
import { HashBasedCache } from '../hash-based-cache';
export class Scene3DRotationInfoCache extends HashBasedCache {
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new Scene3DRotationInfoCache();
        result.copyFrom(this);
        return result;
    }
}
Scene3DRotationInfoCache.defaultItem = new Scene3DRotationInfo();
