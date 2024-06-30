import { DrawingEffectsImportHelper } from './rtf-shape-helpers/drawing-effects-import-helper';
export class RtfShapePropertiesInfo {
    constructor() {
        this.shapeComplexProperties = {};
    }
    addProperty(keyword, value) {
        this.shapeComplexProperties[keyword] = value;
    }
    trySetProperty(keyword, action) {
        return this.setIfPropertyExist(keyword, keyword => this.getPropertyOrNull(keyword), action);
    }
    getProperty(keyword, defaultValue) {
        const prop = this.getPropertyOrNull(keyword);
        return prop ? prop : defaultValue;
    }
    getNullableColorProperty(name) {
        const rawValue = this.getPropertyOrNull(name);
        if (typeof rawValue == 'number')
            return rawValue === null ? null : DrawingEffectsImportHelper.getColorProperty(rawValue);
        return rawValue === null ? null : DrawingEffectsImportHelper.getColorProperty(rawValue.intColor);
    }
    getPropertyOrNull(keyword) {
        const rawValue = this.shapeComplexProperties[keyword];
        if (rawValue === undefined)
            return null;
        if (typeof (rawValue) == 'boolean')
            return (!!rawValue);
        else
            return rawValue;
    }
    setIfPropertyExist(keyword, getter, action) {
        const rawValue = getter(keyword);
        if (rawValue == null)
            return false;
        action(rawValue);
        return true;
    }
}
