import { CharacterFormattingChangedSubDocumentChange } from '../changes/sub-document/properties/character-formatting-changed';
import { CharacterPropertiesChangedSubDocumentChange } from '../changes/sub-document/properties/character-properties-changed';
import { MaskedCharacterProperties } from '../character/character-properties';
import { CharacterPropertyDescriptor } from '../character/character-property-descriptor';
import { ApplyCharacterStyleHistoryItem } from '../history/items/apply-style-history-items';
import { CharacterPropertiesHistoryItem } from '../history/items/character-properties-history-items';
import { HistoryItemIntervalState } from '../history/states/history-item-state';
import { HistoryItemIntervalCharacterPropertiesStateObject, HistoryItemIntervalStateObject, HistoryItemIntervalUseStateObject } from '../history/states/history-item-state-object';
import { JSONCharacterFormattingProperty } from '../json/enums/json-character-enums';
import { ControlOptions } from '../options/control';
import { SubDocumentInterval } from '../sub-document';
import { BaseManipulator } from './base-manipulator';
export class CharacterPropertiesManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.fontBold = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.bold);
        this.fontItalic = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.italic);
        this.fontName = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.fontInfo);
        this.fontSize = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.size);
        this.fontCaps = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.allCaps);
        this.fontStrikeoutType = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.strikeoutType);
        this.fontStrikeoutWordsOnly = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.strikeoutWordsOnly);
        this.fontUnderlineType = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.underlineType);
        this.fontHidden = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.hidden);
        this.script = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.script);
        this.fontUnderlineWordsOnly = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.underlineWordsOnly);
        this.fontNoProof = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.noProof);
        this.langInfo = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.langInfo);
        this.compositeFontInfo = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.compositeFontInfo);
        this.textColor = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.textColor);
        this.shadingInfo = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.shadingInfo);
        this.fontHighlightColor = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.highlightColor);
        this.fontStrikeoutColor = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.strikeoutColor);
        this.fontUnderlineColor = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.underlineColor);
        this.fontSmallCaps = new MaskedCharacterPropertiesManipulator(manipulator, CharacterPropertyDescriptor.smallCaps);
        this.useValue = new CharacterPropertiesUseValueManipulator(manipulator);
        this.modelManipulator = manipulator;
    }
    resetCharacterFormatting(subDocument, interval) {
        this.history.addAndRedo(new CharacterPropertiesHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, interval), MaskedCharacterProperties.createDefault(this.model)));
        this.history.addAndRedo(new ApplyCharacterStyleHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, interval), this.model.getDefaultCharacterStyle(), true));
    }
    setValue(subDocument, interval, newValue) {
        var oldState = new HistoryItemIntervalState();
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.characterFormatting))
            return oldState;
        var newState = new HistoryItemIntervalState();
        var iterator = subDocument.getRunIterator(interval);
        while (iterator.moveNext()) {
            var run = iterator.currentRun;
            oldState.register(new HistoryItemIntervalCharacterPropertiesStateObject(iterator.currentInterval(), run.maskedCharacterProperties.clone()));
            run.setCharacterProperties(newValue);
            run.onCharacterPropertiesChanged();
        }
        newState.register(new HistoryItemIntervalCharacterPropertiesStateObject(interval, newValue));
        this.modelManipulator.notifyModelChanged(new CharacterPropertiesChangedSubDocumentChange(subDocument.id, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.characterFormatting))
            return;
        for (var stateValue, i = 0; stateValue = state.objects[i]; i++) {
            var iterator = subDocument.getRunIterator(stateValue.interval);
            while (iterator.moveNext()) {
                var run = iterator.currentRun;
                run.setCharacterProperties(stateValue.value);
                run.onCharacterPropertiesChanged();
            }
        }
        this.modelManipulator.notifyModelChanged(new CharacterPropertiesChangedSubDocumentChange(subDocument.id, state));
    }
}
class CharacterPropertiesUseValueManipulator {
    constructor(manipulator) {
        this.manipulator = manipulator;
    }
    setValue(subDocument, interval, newValue) {
        var oldState = new HistoryItemIntervalState();
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.characterFormatting))
            return oldState;
        var newState = new HistoryItemIntervalState();
        var iterator = subDocument.getRunIterator(interval);
        while (iterator.moveNext()) {
            var run = iterator.currentRun;
            oldState.register(new HistoryItemIntervalStateObject(iterator.currentInterval(), run.maskedCharacterProperties.getUseValueFull()));
            var properties = run.maskedCharacterProperties.clone();
            properties.setUseValueFull(newValue);
            run.setCharacterProperties(properties);
            run.onCharacterPropertiesChanged();
        }
        newState.register(new HistoryItemIntervalStateObject(interval, newValue));
        this.manipulator.notifyModelChanged(new CharacterFormattingChangedSubDocumentChange(subDocument.id, JSONCharacterFormattingProperty.UseValue, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.characterFormatting))
            return;
        for (var stateValue, i = 0; stateValue = state.objects[i]; i++) {
            var iterator = subDocument.getRunIterator(stateValue.interval);
            while (iterator.moveNext()) {
                var run = iterator.currentRun;
                var properties = run.maskedCharacterProperties.clone();
                properties.setUseValueFull(stateValue.value);
                run.setCharacterProperties(properties);
                run.onCharacterPropertiesChanged();
            }
        }
        this.manipulator.notifyModelChanged(new CharacterFormattingChangedSubDocumentChange(subDocument.id, JSONCharacterFormattingProperty.UseValue, state));
    }
}
class MaskedCharacterPropertiesManipulator {
    constructor(manipulator, descriptor) {
        this.manipulator = manipulator;
        this.descriptor = descriptor;
    }
    setValue(subDocument, interval, newValue, newUse) {
        var oldState = new HistoryItemIntervalState();
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.characterFormatting))
            return oldState;
        var newState = new HistoryItemIntervalState();
        var mask = this.descriptor.maskValue();
        var iterator = subDocument.getRunIterator(interval);
        while (iterator.moveNext()) {
            var currentInterval = iterator.currentInterval();
            var properties = iterator.currentRun.maskedCharacterProperties.clone();
            newState.register(new HistoryItemIntervalUseStateObject(currentInterval, newValue, newUse));
            oldState.register(new HistoryItemIntervalUseStateObject(currentInterval, this.descriptor.getProp(properties), properties.getUseValue(mask)));
            this.descriptor.setProp(properties, newValue);
            properties.setUseValue(mask, newUse);
            iterator.currentRun.setCharacterProperties(properties);
            if (iterator.currentRun.hasCharacterMergedProperies() && newUse) {
                var mergedProperties = iterator.currentRun.getCharacterMergedProperties().clone();
                this.descriptor.setProp(mergedProperties, newValue);
                iterator.currentRun.setCharacterMergedProperies(mergedProperties);
            }
            else
                iterator.currentRun.onCharacterPropertiesChanged();
        }
        this.manipulator.notifyModelChanged(new CharacterFormattingChangedSubDocumentChange(subDocument.id, this.descriptor.getJSONProperty(), newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.characterFormatting))
            return;
        if (state.isEmpty())
            return;
        for (var i = 0, stateItem; stateItem = state.objects[i]; i++) {
            var iterator = subDocument.getRunIterator(stateItem.interval);
            while (iterator.moveNext()) {
                var properties = iterator.currentRun.maskedCharacterProperties.clone();
                this.descriptor.setProp(properties, stateItem.value);
                properties.setUseValue(this.descriptor.maskValue(), stateItem.use);
                iterator.currentRun.setCharacterProperties(properties);
                iterator.currentRun.onCharacterPropertiesChanged();
            }
        }
        this.manipulator.notifyModelChanged(new CharacterFormattingChangedSubDocumentChange(subDocument.id, this.descriptor.getJSONProperty(), state));
    }
}
