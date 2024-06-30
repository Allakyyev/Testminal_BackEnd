import { ApiParametersChecker } from '../api-utils/api-utils/parameter-checker';
import { ColorModelInfo } from '../core/model/color/color-model-info';
import { AddParagraphToListHistoryItem } from '../core/model/history/items/numbering-list-history-items';
import { ParagraphFirstLineIndentHistoryItem, ParagraphLeftIndentHistoryItem } from '../core/model/history/items/paragraph-properties-history-items';
import { ParagraphProperties } from '../core/model/paragraph/paragraph-properties';
import { ParagraphPropertiesApplier } from '../core/model/paragraph/paragraph-properties-helper';
import { ShadingInfo } from '../core/model/shadings/shading-info';
import { SubDocumentInterval } from '../core/model/sub-document';
import { InputPositionBase } from '../core/selection/input-position-base';
import { SelectionIntervalsInfo } from '../core/selection/selection-intervals-info';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ApiUtils } from './api-utils/api-utils';
import { ModelParametersChecker } from './api-utils/model-parameter-checker';
import { convertToIntervalApi } from './interval';
import { ListApi } from './lists/lists';
export class ParagraphApi {
    constructor(processor, paragraph) {
        this._processor = processor;
        this._paragraph = paragraph;
    }
    get index() {
        return this._paragraph.subDocument.getParagraphIndexByPosition(this._paragraph.interval.start);
    }
    get interval() {
        return convertToIntervalApi(this._paragraph.interval);
    }
    get properties() {
        const parProps = this._paragraph.getParagraphMergedProperties().clone();
        return convertToParagraphPropertiesApi(parProps, this._processor.modelManager.model.colorProvider);
    }
    set properties(properties) {
        const propertiesCore = convertFromParagraphPropertiesApi(properties);
        const subDocument = this._paragraph.subDocument;
        const intervals = [this._paragraph.interval];
        const inputPos = new InputPositionBase()
            .setIntervals(new SelectionIntervalsInfo(subDocument, intervals));
        new ParagraphPropertiesApplier(this._processor.modelManager, inputPos, propertiesCore, subDocument, intervals).apply();
    }
    get list() {
        const list = this._processor.modelManager.model.numberingLists[this._paragraph.getNumberingListIndex()];
        return list ? new ListApi(this._processor.modelManager, list) : null;
    }
    get listLevel() {
        return this._paragraph.listLevelIndex;
    }
    addToList(list, targetListLevel = 0) {
        list = ApiParametersChecker.check(list, 1, false, [
            ApiParametersChecker.objectDescriptor('list', 'List', (val) => val)
        ]);
        targetListLevel = ApiParametersChecker.check(targetListLevel, 2, false, [
            ApiParametersChecker.numberDescriptor('targetListLevel', (val) => val, 0, 8)
        ]);
        const subDocumentCore = this._paragraph.subDocument;
        const subDocInterval = new SubDocumentInterval(subDocumentCore, new FixedInterval(this._paragraph.interval.start, 1));
        const parIndex = this.index;
        const parProps = this._paragraph.getParagraphMergedProperties();
        this._processor.beginUpdate();
        this._processor.modelManager.history.addTransaction(() => {
            this._processor.modelManager.history.addAndRedo(new AddParagraphToListHistoryItem(this._processor.modelManager.modelManipulator, subDocumentCore, parIndex, list.index, targetListLevel));
            this._processor.modelManager.history.addAndRedo(new ParagraphLeftIndentHistoryItem(this._processor.modelManager.modelManipulator, subDocInterval, parProps.leftIndent, false));
            this._processor.modelManager.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(this._processor.modelManager.modelManipulator, subDocInterval, parProps.firstLineIndent, false));
        });
        this._processor.endUpdate();
    }
}
export var ParagraphAlignmentApi;
(function (ParagraphAlignmentApi) {
    ParagraphAlignmentApi[ParagraphAlignmentApi["Left"] = 0] = "Left";
    ParagraphAlignmentApi[ParagraphAlignmentApi["Right"] = 1] = "Right";
    ParagraphAlignmentApi[ParagraphAlignmentApi["Center"] = 2] = "Center";
    ParagraphAlignmentApi[ParagraphAlignmentApi["Justify"] = 3] = "Justify";
})(ParagraphAlignmentApi || (ParagraphAlignmentApi = {}));
export var ParagraphLineSpacingTypeApi;
(function (ParagraphLineSpacingTypeApi) {
    ParagraphLineSpacingTypeApi[ParagraphLineSpacingTypeApi["Single"] = 0] = "Single";
    ParagraphLineSpacingTypeApi[ParagraphLineSpacingTypeApi["Sesquialteral"] = 1] = "Sesquialteral";
    ParagraphLineSpacingTypeApi[ParagraphLineSpacingTypeApi["Double"] = 2] = "Double";
    ParagraphLineSpacingTypeApi[ParagraphLineSpacingTypeApi["Multiple"] = 3] = "Multiple";
    ParagraphLineSpacingTypeApi[ParagraphLineSpacingTypeApi["Exactly"] = 4] = "Exactly";
    ParagraphLineSpacingTypeApi[ParagraphLineSpacingTypeApi["AtLeast"] = 5] = "AtLeast";
})(ParagraphLineSpacingTypeApi || (ParagraphLineSpacingTypeApi = {}));
export var ParagraphFirstLineIndentApi;
(function (ParagraphFirstLineIndentApi) {
    ParagraphFirstLineIndentApi[ParagraphFirstLineIndentApi["None"] = 0] = "None";
    ParagraphFirstLineIndentApi[ParagraphFirstLineIndentApi["Indented"] = 1] = "Indented";
    ParagraphFirstLineIndentApi[ParagraphFirstLineIndentApi["Hanging"] = 2] = "Hanging";
})(ParagraphFirstLineIndentApi || (ParagraphFirstLineIndentApi = {}));
export class ParagraphPropertiesApi {
}
export function convertToParagraphPropertiesApi(properties, colorProvider) {
    const value = new ParagraphPropertiesApi();
    value.alignment = properties.alignment === undefined ?
        undefined :
        properties.alignment;
    value.contextualSpacing = properties.contextualSpacing;
    value.firstLineIndent = properties.firstLineIndent;
    value.firstLineIndentType = properties.firstLineIndentType === undefined ?
        undefined :
        properties.firstLineIndentType;
    value.keepLinesTogether = properties.keepLinesTogether;
    value.leftIndent = properties.leftIndent;
    value.lineSpacingType = properties.lineSpacingType === undefined ?
        undefined :
        properties.lineSpacingType;
    value.lineSpacing = properties.lineSpacing;
    value.outlineLevel = properties.outlineLevel;
    value.pageBreakBefore = properties.pageBreakBefore;
    value.rightIndent = properties.rightIndent;
    value.spacingAfter = properties.spacingAfter;
    value.spacingBefore = properties.spacingBefore;
    value.backColor = ApiUtils.internalColorToApiColor(properties.shadingInfo.getActualColor(colorProvider));
    return value;
}
export function convertFromParagraphPropertiesApi(properties, parameterIndex = 1) {
    properties = ApiParametersChecker.check(properties, parameterIndex, false, [
        ApiParametersChecker.objectDescriptor('properties', 'ParagraphProperties', (val) => val)
    ]);
    const props = new ParagraphProperties();
    props.alignment = ApiParametersChecker.check(properties.alignment, parameterIndex, true, [
        ApiParametersChecker.enumDescriptor('properties.alignment', (val) => val, ParagraphAlignmentApi, 'ParagraphAlignment')
    ]);
    props.contextualSpacing = ApiParametersChecker.check(properties.contextualSpacing, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.contextualSpacing', (val) => val)
    ]);
    props.firstLineIndent = ApiParametersChecker.check(properties.firstLineIndent, parameterIndex, true, [
        ApiParametersChecker.numberDescriptor('properties.firstLineIndent', (val) => val)
    ]);
    props.firstLineIndentType = ApiParametersChecker.check(properties.firstLineIndentType, parameterIndex, true, [
        ApiParametersChecker.enumDescriptor('properties.firstLineIndentType', (val) => val, ParagraphFirstLineIndentApi, 'ParagraphFirstLineIndent')
    ]);
    props.keepLinesTogether = ApiParametersChecker.check(properties.keepLinesTogether, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.keepLinesTogether', (val) => val)
    ]);
    props.leftIndent = ApiParametersChecker.check(properties.leftIndent, parameterIndex, true, [
        ApiParametersChecker.numberDescriptor('properties.leftIndent', (val) => val)
    ]);
    props.outlineLevel = ApiParametersChecker.check(properties.outlineLevel, parameterIndex, true, [
        ApiParametersChecker.numberDescriptor('properties.outlineLevel', (val) => val)
    ]);
    props.pageBreakBefore = ApiParametersChecker.check(properties.pageBreakBefore, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.pageBreakBefore', (val) => val)
    ]);
    props.rightIndent = ApiParametersChecker.check(properties.rightIndent, parameterIndex, true, [
        ApiParametersChecker.numberDescriptor('properties.rightIndent', (val) => val)
    ]);
    props.spacingAfter = ApiParametersChecker.check(properties.spacingAfter, parameterIndex, true, [
        ApiParametersChecker.numberDescriptor('properties.spacingAfter', (val) => val)
    ]);
    props.spacingBefore = ApiParametersChecker.check(properties.spacingBefore, parameterIndex, true, [
        ApiParametersChecker.numberDescriptor('properties.spacingBefore', (val) => val)
    ]);
    const backColor = ApiParametersChecker.check(properties.backColor, parameterIndex, true, ModelParametersChecker.colorDescriptors('properties.backColor'));
    props.shadingInfo = backColor === undefined ? undefined : ShadingInfo.createByColor(ColorModelInfo.makeByColor(backColor));
    props.lineSpacingType = ApiParametersChecker.check(properties.lineSpacingType, parameterIndex, true, [
        ApiParametersChecker.enumDescriptor('properties.lineSpacingType', (val) => val, ParagraphLineSpacingTypeApi, 'ParagraphLineSpacingType')
    ]);
    props.lineSpacing = ApiParametersChecker.check(properties.lineSpacing, parameterIndex, true, [
        ApiParametersChecker.numberDescriptor('properties.lineSpacing', (val) => val)
    ]);
    return props;
}
