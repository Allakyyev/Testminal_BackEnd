import { ListLevelParagraphPropertyChangedModelChange } from '../../changes/model/list/list-level-paragraph-property-changed';
import { ResetFormattingCacheType } from '../../document-model';
import { HistoryItemState } from '../../history/states/history-item-state';
import { HistoryItemListLevelUseStateObject } from '../../history/states/history-item-state-object';
import { JSONParagraphFormattingProperty } from '../../json/enums/json-paragraph-enums';
import { NumberingListReferenceLevel } from '../../numbering-lists/list-level';
import { ParagraphPropertiesMask } from '../../paragraph/paragraph-properties';
import { BaseManipulator } from '../base-manipulator';
export class ListLevelParagraphPropertiesManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.align = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.Alignment, ParagraphPropertiesMask.UseAlignment, (properties, value) => properties.alignment = value, properties => properties.alignment);
        this.contextualSpacing = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.ContextualSpacing, ParagraphPropertiesMask.UseContextualSpacing, (properties, value) => properties.contextualSpacing = value, properties => properties.contextualSpacing);
        this.afterAutoSpacing = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.AfterAutoSpacing, ParagraphPropertiesMask.UseAfterAutoSpacing, (properties, value) => properties.afterAutoSpacing = value, properties => properties.afterAutoSpacing);
        this.shadingInfo = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.ShadingInfo, ParagraphPropertiesMask.UseShadingInfoIndex, (properties, value) => properties.shadingInfo = value, properties => properties.shadingInfo);
        this.beforeAutoSpacing = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.BeforeAutoSpacing, ParagraphPropertiesMask.UseBeforeAutoSpacing, (properties, value) => properties.beforeAutoSpacing = value, properties => properties.beforeAutoSpacing);
        this.firstLineIndent = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.FirstLineIndent, ParagraphPropertiesMask.UseFirstLineIndent, (properties, value) => properties.firstLineIndent = value, properties => properties.firstLineIndent);
        this.keepLinesTogether = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.KeepLinesTogether, ParagraphPropertiesMask.UseKeepLinesTogether, (properties, value) => properties.keepLinesTogether = value, properties => properties.keepLinesTogether);
        this.firstLineIndentType = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.FirstLineIndentType, ParagraphPropertiesMask.UseFirstLineIndent, (properties, value) => properties.firstLineIndentType = value, properties => properties.firstLineIndentType);
        this.leftIndent = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.LeftIndent, ParagraphPropertiesMask.UseLeftIndent, (properties, value) => properties.leftIndent = value, properties => properties.leftIndent);
        this.lineSpacing = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.LineSpacing, ParagraphPropertiesMask.UseLineSpacing, (properties, value) => properties.lineSpacing = value, properties => properties.lineSpacing);
        this.lineSpacingType = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.LineSpacingType, ParagraphPropertiesMask.UseLineSpacing, (properties, value) => properties.lineSpacingType = value, properties => properties.lineSpacingType);
        this.outlineLevel = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.OutlineLevel, ParagraphPropertiesMask.UseOutlineLevel, (properties, value) => properties.outlineLevel = value, properties => properties.outlineLevel);
        this.pageBreakBefore = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.PageBreakBefore, ParagraphPropertiesMask.UsePageBreakBefore, (properties, value) => properties.pageBreakBefore = value, properties => properties.pageBreakBefore);
        this.rightIndent = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.RightIndent, ParagraphPropertiesMask.UseRightIndent, (properties, value) => properties.rightIndent = value, properties => properties.rightIndent);
        this.spacingAfter = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.SpacingAfter, ParagraphPropertiesMask.UseSpacingAfter, (properties, value) => properties.spacingAfter = value, properties => properties.spacingAfter);
        this.spacingBefore = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.SpacingBefore, ParagraphPropertiesMask.UseSpacingBefore, (properties, value) => properties.spacingBefore = value, properties => properties.spacingBefore);
        this.suppressHyphenation = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.SuppressHyphenation, ParagraphPropertiesMask.UseSuppressHyphenation, (properties, value) => properties.suppressHyphenation = value, properties => properties.suppressHyphenation);
        this.suppressLineNumbers = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.SuppressLineNumbers, ParagraphPropertiesMask.UseSuppressLineNumbers, (properties, value) => properties.suppressLineNumbers = value, properties => properties.suppressLineNumbers);
        this.widowOrphanControl = new ParagraphPropertiesManipulator(manipulator, JSONParagraphFormattingProperty.WidowOrphanControl, ParagraphPropertiesMask.UseWidowOrphanControl, (properties, value) => properties.widowOrphanControl = value, properties => properties.widowOrphanControl);
    }
}
class ParagraphPropertiesManipulator extends BaseManipulator {
    constructor(manipulator, jsonParagraphFormattingProperty, paragraphPropertiesMask, setProperty, getProperty) {
        super(manipulator);
        this.paragraphPropertiesMask = paragraphPropertiesMask;
        this.jsonParagraphFormattingProperty = jsonParagraphFormattingProperty;
        this.setProperty = setProperty;
        this.getProperty = getProperty;
    }
    setValue(model, isAbstractList, listIndex, listLevelIndex, newValue, newUse) {
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        var numberingList = isAbstractList ? model.abstractNumberingLists[listIndex] : model.numberingLists[listIndex];
        var listLevel = numberingList.levels[listLevelIndex];
        var properties = listLevel.getParagraphProperties();
        if (listLevel instanceof NumberingListReferenceLevel) {
            var abstractNumberingListIndex = numberingList.abstractNumberingListIndex;
            oldState.register(new HistoryItemListLevelUseStateObject(true, abstractNumberingListIndex, listLevelIndex, this.getProperty(properties), properties.getUseValue(this.paragraphPropertiesMask)));
            this.setValueCore(listLevel, newValue, newUse);
            newState.register(new HistoryItemListLevelUseStateObject(true, abstractNumberingListIndex, listLevelIndex, newValue, newUse));
        }
        else {
            oldState.register(new HistoryItemListLevelUseStateObject(isAbstractList, listIndex, listLevelIndex, this.getProperty(properties), properties.getUseValue(this.paragraphPropertiesMask)));
            this.setValueCore(listLevel, newValue, newUse);
            newState.register(new HistoryItemListLevelUseStateObject(isAbstractList, listIndex, listLevelIndex, newValue, newUse));
        }
        this.model.resetMergedFormattingCache(ResetFormattingCacheType.Paragraph);
        this.modelManipulator.notifyModelChanged(new ListLevelParagraphPropertyChangedModelChange(this.jsonParagraphFormattingProperty, newState));
        return oldState;
    }
    restoreValue(model, state) {
        var stateObject = state.objects[0];
        var numberingList = stateObject.isAbstractNumberingList ? model.abstractNumberingLists[stateObject.numberingListIndex] : model.numberingLists[stateObject.numberingListIndex];
        var listLevel = numberingList.levels[stateObject.listLevelIndex];
        this.setValueCore(listLevel, stateObject.value, stateObject.use);
        this.model.resetMergedFormattingCache(ResetFormattingCacheType.Paragraph);
        this.modelManipulator.notifyModelChanged(new ListLevelParagraphPropertyChangedModelChange(this.jsonParagraphFormattingProperty, state));
    }
    setValueCore(level, newValue, newUse) {
        var properties = level.getParagraphProperties().clone();
        this.setProperty(properties, newValue);
        properties.setUseValue(this.paragraphPropertiesMask, newUse);
        level.setParagraphProperties(properties);
        level.onParagraphPropertiesChanged();
    }
}
