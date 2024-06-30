import { MathUtils } from '@devexpress/utils/lib/utils/math';
export class Scene3DRotationInfo {
    constructor(latitude = 0, longitude = 0, revolution = 0) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.revolution = revolution;
    }
    calculateHash() {
        return MathUtils.somePrimes[0] * this.latitude ^
            MathUtils.somePrimes[1] * this.longitude ^
            MathUtils.somePrimes[2] * this.revolution;
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    equals(obj) {
        return obj &&
            this.latitude == obj.latitude &&
            this.longitude == obj.longitude &&
            this.revolution == obj.revolution;
    }
    clone() {
        const obj = new Scene3DRotationInfo();
        obj.latitude = this.latitude;
        obj.longitude = this.longitude;
        obj.revolution = this.revolution;
        return obj;
    }
}
Scene3DRotationInfo.defaultInfo = new Scene3DRotationInfo();
