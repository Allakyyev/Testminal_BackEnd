import { ListLevelCharacterPropertyChangedModelChange } from '../../changes/model/list/list-level-character-property-changed';
import { CharacterPropertyDescriptor } from '../../character/character-property-descriptor';
import { ResetFormattingCacheType } from '../../document-model';
import { HistoryItemState } from '../../history/states/history-item-state';
import { HistoryItemListLevelUseStateObject } from '../../history/states/history-item-state-object';
import { NumberingListReferenceLevel } from '../../numbering-lists/list-level';
import { BaseManipulator } from '../base-manipulator';
export class ListLevelCharacterPropertiesManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.fontBold = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.bold);
        this.fontItalic = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.italic);
        this.fontName = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.fontInfo);
        this.fontSize = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.size);
        this.fontCaps = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.allCaps);
        this.fontSmallCaps = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.smallCaps);
        this.fontStrikeoutType = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.strikeoutType);
        this.fontStrikeoutWordsOnly = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.strikeoutWordsOnly);
        this.fontUnderlineType = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.underlineType);
        this.fontHidden = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.hidden);
        this.script = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.script);
        this.fontUnderlineWordsOnly = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.underlineWordsOnly);
        this.fontNoProof = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.noProof);
        this.textColor = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.textColor);
        this.shadingInfo = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.shadingInfo);
        this.highlightColor = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.highlightColor);
        this.fontStrikeoutColor = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.strikeoutColor);
        this.fontUnderlineColor = new CharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.underlineColor);
    }
}
class CharacterPropertiesManipulator extends BaseManipulator {
    constructor(manipulator, descriptor) {
        super(manipulator);
        this.descriptor = descriptor;
    }
    setValue(model, isAbstractList, listIndex, listLevelIndex, newValue, newUse) {
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        var numberingList = isAbstractList ? model.abstractNumberingLists[listIndex] : model.numberingLists[listIndex];
        var listLevel = numberingList.levels[listLevelIndex];
        var properties = listLevel.getCharacterProperties();
        if (listLevel instanceof NumberingListReferenceLevel) {
            var abstractNumberingListIndex = numberingList.abstractNumberingListIndex;
            oldState.register(new HistoryItemListLevelUseStateObject(true, abstractNumberingListIndex, listLevelIndex, this.descriptor.getProp(properties), properties.getUseValue(this.descriptor.maskValue())));
            this.setValueCore(listLevel, newValue, newUse);
            newState.register(new HistoryItemListLevelUseStateObject(true, abstractNumberingListIndex, listLevelIndex, newValue, newUse));
        }
        else {
            oldState.register(new HistoryItemListLevelUseStateObject(isAbstractList, listIndex, listLevelIndex, this.descriptor.getProp(properties), properties.getUseValue(this.descriptor.maskValue())));
            this.setValueCore(listLevel, newValue, newUse);
            newState.register(new HistoryItemListLevelUseStateObject(isAbstractList, listIndex, listLevelIndex, newValue, newUse));
        }
        this.model.resetMergedFormattingCache(ResetFormattingCacheType.Character);
        this.modelManipulator.notifyModelChanged(new ListLevelCharacterPropertyChangedModelChange(this.descriptor.getJSONProperty(), newState));
        return oldState;
    }
    restoreValue(model, state) {
        var stateObject = state.objects[0];
        var numberingList = stateObject.isAbstractNumberingList ? model.abstractNumberingLists[stateObject.numberingListIndex] : model.numberingLists[stateObject.numberingListIndex];
        var listLevel = numberingList.levels[stateObject.listLevelIndex];
        this.setValueCore(listLevel, stateObject.value, stateObject.use);
        this.model.resetMergedFormattingCache(ResetFormattingCacheType.Character);
        this.modelManipulator.notifyModelChanged(new ListLevelCharacterPropertyChangedModelChange(this.descriptor.getJSONProperty(), state));
    }
    setValueCore(level, newValue, newUse) {
        var properties = level.getCharacterProperties().clone();
        this.descriptor.setProp(properties, newValue);
        properties.setUseValue(this.descriptor.maskValue(), newUse);
        level.setCharacterProperties(properties);
        level.onCharacterPropertiesChanged();
    }
}
