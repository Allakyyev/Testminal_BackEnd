import { Errors } from '@devexpress/utils/lib/errors';
import { IntervalBasedHistoryItem } from '../base/interval-based-history-item';
export class FontUseValueHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, newValue) {
        super(modelManipulator, subDocInterval);
        this.newValue = newValue;
    }
    redo() {
        this.oldState = this.modelManipulator.characterProperties.useValue.setValue(this.boundSubDocument, this.interval, this.newValue);
    }
    undo() {
        this.modelManipulator.characterProperties.useValue.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class CharacterPropertiesHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, newValue) {
        super(modelManipulator, subDocInterval);
        this.newValue = newValue;
    }
    redo() {
        this.oldState = this.modelManipulator.characterProperties.setValue(this.boundSubDocument, this.interval, this.newValue);
    }
    undo() {
        this.modelManipulator.characterProperties.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class CharacterPropertiesHistoryItemBase extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, newValue, newUse) {
        super(modelManipulator, subDocInterval);
        this.newValue = newValue;
        this.newUse = newUse;
    }
    redo() {
        this.oldState = this.getPropertiesManipulator().setValue(this.boundSubDocument, this.interval, this.newValue, this.newUse);
    }
    undo() {
        this.getPropertiesManipulator().restoreValue(this.boundSubDocument, this.oldState);
    }
    getPropertiesManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class FontBoldHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontBold;
    }
}
export class FontCapsHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontCaps;
    }
}
export class FontSmallCapsHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontSmallCaps;
    }
}
export class FontUnderlineTypeHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontUnderlineType;
    }
}
export class FontTextColorHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.textColor;
    }
}
export class FontShadingInfoHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.shadingInfo;
    }
}
export class FontHiddenHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontHidden;
    }
}
export class FontItalicHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontItalic;
    }
}
export class FontNameHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontName;
    }
}
export class FontScriptHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.script;
    }
}
export class FontSizeHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontSize;
    }
}
export class FontStrikeoutTypeHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontStrikeoutType;
    }
}
export class FontStrikeoutWordsOnlyHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontStrikeoutWordsOnly;
    }
}
export class FontStrikeoutColorHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontStrikeoutColor;
    }
}
export class FontUnderlineColorHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontUnderlineColor;
    }
}
export class FontHighlightColorHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontHighlightColor;
    }
}
export class FontUnderlineWordsOnlyHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontUnderlineWordsOnly;
    }
}
export class FontNoProofHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.fontNoProof;
    }
}
export class FontLangInfoHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.langInfo;
    }
}
export class FontCompositeFontInfoHistoryItem extends CharacterPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.characterProperties.compositeFontInfo;
    }
}
export class ResetCharacterPropertiesUseValuesHistoryItem extends IntervalBasedHistoryItem {
    redo() {
        this.state = this.modelManipulator.characterProperties.useValue.setValue(this.boundSubDocument, this.interval, 0);
    }
    undo() {
        this.modelManipulator.characterProperties.useValue.restoreValue(this.boundSubDocument, this.state);
    }
}
