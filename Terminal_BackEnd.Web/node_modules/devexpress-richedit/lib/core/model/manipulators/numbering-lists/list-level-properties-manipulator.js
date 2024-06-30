import { ListLevelPropertyChangedModelChange } from '../../changes/model/list/list-level-property-changed';
import { HistoryItemState } from '../../history/states/history-item-state';
import { HistoryItemListLevelStateObject } from '../../history/states/history-item-state-object';
import { JSONListLevelProperty } from '../../json/enums/json-list-enums';
import { NumberingListReferenceLevel } from '../../numbering-lists/list-level';
import { BaseManipulator } from '../base-manipulator';
export class ListLevelPropertiesManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.start = new StartListLevelPropertiesManipulator(manipulator);
        this.format = new FormatListLevelPropertiesManipulator(manipulator);
        this.alignment = new AlignmentListLevelPropertiesManipulator(manipulator);
        this.convertPreviousLevelNumberingToDecimal = new ConvertPreviousLevelNumberingToDecimalListLevelPropertiesManipulator(manipulator);
        this.separator = new SeparatorListLevelPropertiesManipulator(manipulator);
        this.suppressRestart = new SuppressRestartListLevelPropertiesManipulator(manipulator);
        this.suppressBulletResize = new SuppressBulletResizeListLevelPropertiesManipulator(manipulator);
        this.displayFormatString = new DisplayFormatStringListLevelPropertiesManipulator(manipulator);
        this.relativeRestartLevel = new RelativeRestartLevelListLevelPropertiesManipulator(manipulator);
        this.templateCode = new TemplateCodeListLevelPropertiesManipulator(manipulator);
        this.originalLeftIndent = new OriginalLeftIndentListLevelPropertiesManipulator(manipulator);
        this.legacy = new LegacyListLevelPropertiesManipulator(manipulator);
        this.legacySpace = new LegacySpaceListLevelPropertiesManipulator(manipulator);
        this.legacyIndent = new LegacyIndentListLevelPropertiesManipulator(manipulator);
    }
}
class ListLevelPropertiesManipulatorBase {
    constructor(dispatcher) {
        this.manipulator = dispatcher;
    }
    setValue(model, isAbstractList, listIndex, listLevelIndex, newValue) {
        var oldState = new HistoryItemState();
        var newState = new HistoryItemState();
        var numberingList = isAbstractList ? model.abstractNumberingLists[listIndex] : model.numberingLists[listIndex];
        var listLevel = numberingList.levels[listLevelIndex];
        if (listLevel instanceof NumberingListReferenceLevel) {
            var abstractNumberingListIndex = numberingList.abstractNumberingListIndex;
            oldState.register(new HistoryItemListLevelStateObject(true, abstractNumberingListIndex, listLevelIndex, this.getPropertyValue(listLevel.getListLevelProperties())));
            this.setValueCore(listLevel, newValue);
            newState.register(new HistoryItemListLevelStateObject(true, abstractNumberingListIndex, listLevelIndex, newValue));
        }
        else {
            oldState.register(new HistoryItemListLevelStateObject(isAbstractList, listIndex, listLevelIndex, this.getPropertyValue(listLevel.getListLevelProperties())));
            this.setValueCore(listLevel, newValue);
            newState.register(new HistoryItemListLevelStateObject(isAbstractList, listIndex, listLevelIndex, newValue));
        }
        this.manipulator.notifyModelChanged(new ListLevelPropertyChangedModelChange(this.getJSONListLevelProperty(), newState));
        return oldState;
    }
    restoreValue(model, state) {
        var stateObject = state.objects[0];
        var numberingList = stateObject.isAbstractNumberingList ? model.abstractNumberingLists[stateObject.numberingListIndex] : model.numberingLists[stateObject.numberingListIndex];
        var listLevel = numberingList.levels[stateObject.listLevelIndex];
        this.setValueCore(listLevel, stateObject.value);
        this.manipulator.notifyModelChanged(new ListLevelPropertyChangedModelChange(this.getJSONListLevelProperty(), state));
    }
    setValueCore(level, newValue) {
        var properties = level.getListLevelProperties().clone();
        this.setPropertyValue(properties, newValue);
        level.setListLevelProperties(properties);
    }
}
class StartListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.start = newValue;
    }
    getPropertyValue(properties) {
        return properties.start;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.Start;
    }
}
class FormatListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.format = newValue;
    }
    getPropertyValue(properties) {
        return properties.format;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.Format;
    }
}
class AlignmentListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.alignment = newValue;
    }
    getPropertyValue(properties) {
        return properties.alignment;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.Alignment;
    }
}
class ConvertPreviousLevelNumberingToDecimalListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.convertPreviousLevelNumberingToDecimal = newValue;
    }
    getPropertyValue(properties) {
        return properties.convertPreviousLevelNumberingToDecimal;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.ConvertPreviousLevelNumberingToDecimal;
    }
}
class SeparatorListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.separator = newValue;
    }
    getPropertyValue(properties) {
        return properties.separator;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.Separator;
    }
}
class SuppressRestartListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.suppressRestart = newValue;
    }
    getPropertyValue(properties) {
        return properties.suppressRestart;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.SuppressRestart;
    }
}
class SuppressBulletResizeListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.suppressBulletResize = newValue;
    }
    getPropertyValue(properties) {
        return properties.suppressBulletResize;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.SuppressBulletResize;
    }
}
class DisplayFormatStringListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.displayFormatString = newValue;
    }
    getPropertyValue(properties) {
        return properties.displayFormatString;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.DisplayFormatString;
    }
}
class RelativeRestartLevelListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.relativeRestartLevel = newValue;
    }
    getPropertyValue(properties) {
        return properties.relativeRestartLevel;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.RelativeRestartLevel;
    }
}
class TemplateCodeListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.templateCode = newValue;
    }
    getPropertyValue(properties) {
        return properties.templateCode;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.TemplateCode;
    }
}
class OriginalLeftIndentListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.originalLeftIndent = newValue;
    }
    getPropertyValue(properties) {
        return properties.originalLeftIndent;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.OriginalLeftIndent;
    }
}
class LegacyListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.legacy = newValue;
    }
    getPropertyValue(properties) {
        return properties.legacy;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.Legacy;
    }
}
class LegacySpaceListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.legacySpace = newValue;
    }
    getPropertyValue(properties) {
        return properties.legacySpace;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.LegacySpace;
    }
}
class LegacyIndentListLevelPropertiesManipulator extends ListLevelPropertiesManipulatorBase {
    setPropertyValue(properties, newValue) {
        properties.legacyIndent = newValue;
    }
    getPropertyValue(properties) {
        return properties.legacyIndent;
    }
    getJSONListLevelProperty() {
        return JSONListLevelProperty.LegacyIndent;
    }
}
