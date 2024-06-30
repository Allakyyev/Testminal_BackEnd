import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ParagraphListInfo } from '../../rich-utils/properties-bundle';
import { ParagraphFormattingChangedSubDocumentChange } from '../changes/sub-document/properties/paragraph-formatting-changed';
import { ParagraphPropertiesChangedSubDocumentChange } from '../changes/sub-document/properties/paragraph-properties-changed';
import { HistoryItemIntervalState } from '../history/states/history-item-state';
import { HistoryItemIntervalStateObject, HistoryItemIntervalUseStateObject } from '../history/states/history-item-state-object';
import { JSONParagraphFormattingProperty } from '../json/enums/json-paragraph-enums';
import { ControlOptions } from '../options/control';
import { ParagraphPropertyDescriptor } from '../paragraph/paragraph-properties';
import { BaseManipulator } from './base-manipulator';
export class ParagraphPropertiesManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.align = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.alignment);
        this.contextualSpacing = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.contextualSpacing);
        this.rightToLeft = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.rightToLeft);
        this.afterAutoSpacing = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.afterAutoSpacing);
        this.shadingInfo = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.shadingInfo);
        this.beforeAutoSpacing = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.beforeAutoSpacing);
        this.firstLineIndent = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.firstLineIndent);
        this.keepLinesTogether = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.keepLinesTogether);
        this.firstLineIndentType = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.firstLineIndentType);
        this.leftIndent = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.leftIndent);
        this.lineSpacing = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.lineSpacing);
        this.lineSpacingType = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.lineSpacingType);
        this.outlineLevel = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.outlineLevel);
        this.pageBreakBefore = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.pageBreakBefore);
        this.rightIndent = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.rightIndent);
        this.spacingAfter = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.spacingAfter);
        this.spacingBefore = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.spacingBefore);
        this.suppressHyphenation = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.suppressHyphenation);
        this.suppressLineNumbers = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.suppressLineNumbers);
        this.widowOrphanControl = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.widowOrphanControl);
        this.divId = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.divId);
        this.keepWithNext = new MaskedParagraphPropertiesManipulator(manipulator, ParagraphPropertyDescriptor.keepWithNext);
        this.useValue = new ParagraphPropertiesUseValueManipulator(manipulator);
    }
    changeAllProperties(subDocument, paragraphIndex, properties, style, tabs, numberingListIndex, listLevelIndex) {
        var paragraph = subDocument.paragraphs[paragraphIndex];
        paragraph.setParagraphProperties(properties);
        paragraph.paragraphStyle = style;
        paragraph.tabs = tabs.clone();
        paragraph.numberingListIndex = numberingListIndex;
        paragraph.listLevelIndex = listLevelIndex;
        paragraph.onParagraphPropertiesChanged();
        this.modelManipulator.notifyModelChanged(new ParagraphPropertiesChangedSubDocumentChange(subDocument.id, paragraphIndex, subDocument.paragraphs[paragraphIndex].interval, properties, style, tabs, new ParagraphListInfo(numberingListIndex, listLevelIndex)));
    }
}
class ParagraphPropertiesUseValueManipulator {
    constructor(manipulator) {
        this.manipulator = manipulator;
    }
    setValue(subDocument, interval, newValue) {
        var oldState = new HistoryItemIntervalState();
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.paragraphFormatting))
            return oldState;
        var newState = new HistoryItemIntervalState();
        var paragraphs = subDocument.getParagraphsByInterval(interval);
        for (var i = 0, paragraph; paragraph = paragraphs[i]; i++) {
            var properties = paragraph.maskedParagraphProperties.clone();
            oldState.register(new HistoryItemIntervalStateObject(new FixedInterval(paragraph.startLogPosition.value, paragraph.length), properties.useValue));
            newState.register(new HistoryItemIntervalStateObject(new FixedInterval(paragraph.startLogPosition.value, paragraph.length), newValue));
            properties.useValue = newValue;
            paragraph.setParagraphProperties(properties);
            paragraph.onParagraphPropertiesChanged();
        }
        this.manipulator.notifyModelChanged(new ParagraphFormattingChangedSubDocumentChange(subDocument.id, JSONParagraphFormattingProperty.UseValue, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.paragraphFormatting))
            return;
        for (var stateValue, i = 0; stateValue = state.objects[i]; i++) {
            var paragraphs = subDocument.getParagraphsByInterval(stateValue.interval);
            for (var i = 0, paragraph; paragraph = paragraphs[i]; i++) {
                var properties = paragraph.maskedParagraphProperties.clone();
                properties.useValue = stateValue.value;
                paragraph.setParagraphProperties(properties);
                paragraph.onParagraphPropertiesChanged();
            }
        }
        this.manipulator.notifyModelChanged(new ParagraphFormattingChangedSubDocumentChange(subDocument.id, JSONParagraphFormattingProperty.UseValue, state));
    }
}
class MaskedParagraphPropertiesManipulator {
    constructor(manipulator, descriptor) {
        this.manipulator = manipulator;
        this.descriptor = descriptor;
    }
    setValue(subDocument, interval, newValue, newUse) {
        var oldState = new HistoryItemIntervalState();
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.paragraphFormatting))
            return oldState;
        var newState = new HistoryItemIntervalState();
        var paragraphs = subDocument.getParagraphsByInterval(interval);
        for (var i = 0, paragraph; paragraph = paragraphs[i]; i++) {
            var currentInterval = paragraph.interval;
            var properties = paragraph.maskedParagraphProperties.clone();
            oldState.register(new HistoryItemIntervalUseStateObject(currentInterval, this.descriptor.getProp(properties), properties.getUseValue(this.descriptor.maskValue())));
            newState.register(new HistoryItemIntervalUseStateObject(currentInterval, newValue, newUse));
            this.descriptor.setProp(properties, newValue);
            properties.setUseValue(this.descriptor.maskValue(), newUse);
            paragraph.setParagraphProperties(properties);
            if (paragraph.hasParagraphMergedProperies() && newUse) {
                var mergedProperties = paragraph.getParagraphMergedProperties().clone();
                this.descriptor.setProp(mergedProperties, newValue);
                paragraph.setParagraphMergedProperies(mergedProperties);
            }
            else
                paragraph.onParagraphPropertiesChanged();
        }
        this.manipulator.notifyModelChanged(new ParagraphFormattingChangedSubDocumentChange(subDocument.id, this.descriptor.getJSONProperty(), newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.paragraphFormatting))
            return;
        if (state.isEmpty())
            return;
        for (var i = 0, stateItem; stateItem = state.objects[i]; i++) {
            var paragraphs = subDocument.getParagraphsByInterval(stateItem.interval);
            for (var j = 0, paragraph; paragraph = paragraphs[j]; j++) {
                var properties = paragraph.maskedParagraphProperties.clone();
                this.descriptor.setProp(properties, stateItem.value);
                properties.setUseValue(this.descriptor.maskValue(), stateItem.use);
                paragraph.setParagraphProperties(properties);
                if (paragraph.hasParagraphMergedProperies()) {
                    var mergedProperties = paragraph.getParagraphMergedProperties().clone();
                    this.descriptor.setProp(mergedProperties, stateItem.value);
                    paragraph.setParagraphMergedProperies(mergedProperties);
                }
                else
                    paragraph.onParagraphPropertiesChanged();
            }
        }
        this.manipulator.notifyModelChanged(new ParagraphFormattingChangedSubDocumentChange(subDocument.id, this.descriptor.getJSONProperty(), state));
    }
}
