import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { DrawingValueConstants } from './drawing-value-constants';
export class Scene3DPropertiesInfo {
    constructor() {
        this.packedValues = 0x00000000;
        this.zoom = DrawingValueConstants.ThousandthOfPercentage;
    }
    get cameraType() { return this.getUIntValue(Scene3DPropertiesInfo.maskPresetCameraType, 0); }
    set cameraType(value) { this.setUIntValue(Scene3DPropertiesInfo.maskPresetCameraType, 0, value); }
    get lightRigDirection() { return this.getUIntValue(Scene3DPropertiesInfo.maskLightRigDirection, 6); }
    set lightRigDirection(value) { this.setUIntValue(Scene3DPropertiesInfo.maskLightRigDirection, 6, value); }
    get lightRigPreset() { return this.getUIntValue(Scene3DPropertiesInfo.maskLightRigPreset, 10); }
    set lightRigPreset(value) { this.setUIntValue(Scene3DPropertiesInfo.maskLightRigPreset, 10, value); }
    get hasCameraRotation() { return this.getBooleanValue(Scene3DPropertiesInfo.maskHasCameraRotation); }
    set hasCameraRotation(value) { this.setBooleanValue(Scene3DPropertiesInfo.maskHasCameraRotation, value); }
    get hasLightRigRotation() { return this.getBooleanValue(Scene3DPropertiesInfo.maskHasLightRigRotation); }
    set hasLightRigRotation(value) { this.setBooleanValue(Scene3DPropertiesInfo.maskHasLightRigRotation, value); }
    get isDefault() { return this.equals(Scene3DPropertiesInfo.defaultInfo); }
    calculateHash() {
        return MathUtils.somePrimes[0] * this.packedValues ^
            MathUtils.somePrimes[1] * this.fov ^
            MathUtils.somePrimes[2] * this.zoom;
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    getUIntValue(mask, offsetBits) {
        return (this.packedValues & mask) >> offsetBits;
    }
    setUIntValue(mask, offsetBits, value) {
        this.packedValues = ~mask;
        this.packedValues |= (value << offsetBits) & mask;
    }
    setBooleanValue(mask, bitVal) {
        this.packedValues = bitVal ? (this.packedValues || mask) : (this.packedValues && ~mask);
    }
    getBooleanValue(mask) {
        return (this.packedValues & mask) != 0;
    }
    equals(obj) {
        return obj &&
            this.packedValues == obj.packedValues &&
            this.fov == obj.fov &&
            this.zoom == obj.zoom;
    }
    clone() {
        const obj = new Scene3DPropertiesInfo();
        obj.packedValues = this.packedValues;
        obj.fov = this.fov;
        obj.zoom = this.zoom;
        return obj;
    }
}
Scene3DPropertiesInfo.defaultInfo = new Scene3DPropertiesInfo();
Scene3DPropertiesInfo.maskPresetCameraType = 0x0000003F;
Scene3DPropertiesInfo.maskLightRigDirection = 0x000003C0;
Scene3DPropertiesInfo.maskLightRigPreset = 0x00007C00;
Scene3DPropertiesInfo.maskHasCameraRotation = 0x00008000;
Scene3DPropertiesInfo.maskHasLightRigRotation = 0x00010000;
