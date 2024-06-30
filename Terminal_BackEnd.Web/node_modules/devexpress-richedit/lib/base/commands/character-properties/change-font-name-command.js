import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { isNumber } from '@devexpress/utils/lib/utils/common';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ChangeFontNameCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.fontInfo;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        if (isNumber(parameter))
            return this.control.modelManager.model.cache.fontInfoCache.getItemByJsonKey(parameter);
        else if (typeof parameter == "string") {
            let fontInfo = this.control.modelManager.model.cache.fontInfoCache.getItemByName(parameter);
            if (!fontInfo) {
                const mergedCharacterProperties = this.inputPosition.getMergedCharacterPropertiesFull();
                if (mergedCharacterProperties.fontInfo) {
                    fontInfo = mergedCharacterProperties.fontInfo.clone();
                    fontInfo.name = parameter;
                    fontInfo.cssString = parameter.match(/^\w+\s/gi) ? "'" + parameter + "'" : parameter;
                    this.modelManipulator.font.loadFontInfo(fontInfo, this.selection.activeSubDocument, this.selection.intervals, this.control.measurer);
                    return fontInfo;
                }
            }
            if (fontInfo)
                return fontInfo;
        }
        return this.getCurrentValue();
    }
}
