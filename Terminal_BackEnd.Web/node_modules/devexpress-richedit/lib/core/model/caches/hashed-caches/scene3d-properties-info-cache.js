import { Scene3DPropertiesInfo } from '../../drawing/scene3d-properties-info';
import { HashBasedCache } from '../hash-based-cache';
export class Scene3DPropertiesInfoCache extends HashBasedCache {
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new Scene3DPropertiesInfoCache();
        result.copyFrom(this);
        return result;
    }
}
Scene3DPropertiesInfoCache.defaultItem = new Scene3DPropertiesInfo();
