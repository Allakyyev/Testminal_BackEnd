import { CharacterProperties } from '../../character/character-properties';
import { FontInfo } from '../../fonts/font-info';
import { HashBasedCache } from '../hash-based-cache';
export class CharacterPropertiesCache extends HashBasedCache {
    static getRareCharProperty(fontMeasurer) {
        if (!CharacterPropertiesCache._rareCharProperty) {
            const prop = new CharacterProperties();
            prop.fontInfo = new FontInfo("Calibri");
            prop.fontInfo.measurer = fontMeasurer;
            prop.fontSize = 200;
            CharacterPropertiesCache._rareCharProperty = prop;
        }
        return CharacterPropertiesCache._rareCharProperty;
    }
    resetSizes() {
        this.forEach((prop) => {
            prop.clearSizes();
            if (prop.fontInfo)
                prop.fontInfo.reset();
        });
    }
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new CharacterPropertiesCache();
        result.copyFrom(this);
        return result;
    }
}
