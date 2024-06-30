import { Errors } from '@devexpress/utils/lib/errors';
import { ListNumberAlignment } from '../../../model/numbering-lists/list-level-properties';
import { RichUtils } from '../../../model/rich-utils';
import { LayoutBox, LayoutBoxType } from './layout-box';
import { LayoutSpaceBox } from './layout-space-box';
import { LayoutTabSpaceBoxJustForBoxIterator, TabLeaderType } from './layout-tab-space-box';
import { LayoutTextBox } from './layout-text-box';
export class LayoutNumberingListBox extends LayoutBox {
    constructor(characterProperties, colorInfo, text, separatorChar, mergedCharacterPropertiesCache, alignment = ListNumberAlignment.Left, fontInfoCache) {
        super(characterProperties, colorInfo);
        this.textBox = new LayoutTextBox(characterProperties, colorInfo, text);
        this.alignment = alignment;
        if (separatorChar != '\u0000') {
            let separatorCharacterProperties = characterProperties.clone();
            let fontInfo = null;
            if (fontInfoCache)
                fontInfo = this.getFont(fontInfoCache);
            if (!fontInfo) {
                fontInfo = characterProperties.fontInfo.clone();
                fontInfo.measurer = characterProperties.fontInfo.measurer;
                fontInfo.name = "Arial";
                fontInfo.cssString = "Arial";
            }
            separatorCharacterProperties.fontInfo = fontInfo;
            if (mergedCharacterPropertiesCache)
                separatorCharacterProperties = mergedCharacterPropertiesCache.getItem(separatorCharacterProperties);
            switch (separatorChar) {
                case RichUtils.specialCharacters.TabMark:
                    this.separatorBox = new LayoutTabSpaceBoxJustForBoxIterator(separatorCharacterProperties, colorInfo);
                    break;
                case RichUtils.specialCharacters.Space:
                case RichUtils.specialCharacters.EmSpace:
                case RichUtils.specialCharacters.EnSpace:
                    this.separatorBox = new LayoutSpaceBox(separatorCharacterProperties, colorInfo);
                    break;
                default:
                    break;
            }
        }
    }
    getFont(fontInfoCache) {
        let fontInfo = fontInfoCache.getItemByName('Arial');
        if (!fontInfo) {
            fontInfo = fontInfoCache.getItemByName('Times New Roman');
            if (!fontInfo) {
                fontInfo = fontInfoCache.getItemByName('Calibri');
            }
        }
        return fontInfo;
    }
    equals(obj) {
        return obj &&
            super.equals(obj) &&
            this.textBox.equals(obj.textBox) &&
            (!this.separatorBox && !obj.separatorBox || this.separatorBox && obj.separatorBox && this.separatorBox.equals(obj.separatorBox));
    }
    clone() {
        const newObj = new LayoutNumberingListBox(this.characterProperties, this.colorInfo, "0", '\u0000');
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.textBox = (obj.textBox.clone());
        this.separatorBox = obj.separatorBox.clone();
    }
    getType() {
        return LayoutBoxType.NumberingList;
    }
    pushInfoForMeasure(info, showHiddenSymbols) {
        this.textBox.pushInfoForMeasure(info, showHiddenSymbols);
        if (this.separatorBox)
            this.separatorBox.pushInfoForMeasure(info, showHiddenSymbols);
    }
    popInfoForMeasure(info, showHiddenSymbols) {
        if (this.separatorBox) {
            this.separatorBox.popInfoForMeasure(info, showHiddenSymbols);
            if (this.separatorBox instanceof LayoutTabSpaceBoxJustForBoxIterator)
                this.separatorBox = this.separatorBox.getLayoutTabBox(TabLeaderType.None);
        }
        this.textBox.popInfoForMeasure(info, showHiddenSymbols);
    }
    isWhitespace() {
        throw new Error(Errors.InternalException);
    }
    renderGetContent(_renderer) {
        throw new Error(Errors.InternalException);
    }
    ;
    isLineBreak() {
        throw new Error(Errors.InternalException);
    }
}
