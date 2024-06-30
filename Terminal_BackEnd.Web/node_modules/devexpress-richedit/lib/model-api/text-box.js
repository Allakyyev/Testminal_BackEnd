import { ApiParametersChecker } from '../api-utils/api-utils/parameter-checker';
import { DrawingTextAnchoringType, RelativeHeightType, RelativeWidthType } from '../core/model/floating-objects/enums';
import { ChangeAnchoredTextBoxSizeHistoryItem } from '../core/model/history/items/floating-objects/change-anchored-text-box-size-history-item';
import { ChangeTextBoxPropertiesHistoryItem } from '../core/model/history/items/floating-objects/change-text-box-properties-history-item';
import { SubDocumentInterval } from '../core/model/sub-document';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { DrawingObjectBase } from './picture';
import { MarginsApi, SizeApi } from './size';
export class TextBoxApi extends DrawingObjectBase {
    get size() {
        const size = this._run.size;
        const absoluteSize = new SizeApi(size.absoluteSize.width, size.absoluteSize.height);
        const relativeSize = new SizeApi(size.relativeSize.width, size.relativeSize.height);
        return new TextBoxSizeApi(absoluteSize, relativeSize, size.relativeWidthType, size.relativeHeightType);
    }
    set size(size) {
        size = ApiParametersChecker.check(size, 1, false, [
            ApiParametersChecker.objectDescriptor('size', 'TextBoxSize', (val) => val)
        ]);
        const sizeCore = this._run.size.clone();
        const interval = new FixedInterval(this._position, 1);
        sizeCore.absoluteSize = ApiParametersChecker.check(size.absoluteSize, 1, true, [
            ApiParametersChecker.objectDescriptor('size.absoluteSize', 'Size', (val) => new Size(val.width, val.height))
        ]);
        sizeCore.relativeSize = ApiParametersChecker.check(size.relativeSize, 1, true, [
            ApiParametersChecker.objectDescriptor('size.relativeSize', 'Size', (val) => new Size(val.width, val.height))
        ]);
        sizeCore.relativeWidthType = ApiParametersChecker.check(size.relativeWidthType, 1, true, [
            ApiParametersChecker.enumDescriptor('size.relativeWidthType', (val) => val, RelativeWidthType, 'RelativeWidthType')
        ]);
        sizeCore.relativeHeightType = ApiParametersChecker.check(size.relativeHeightType, 1, true, [
            ApiParametersChecker.enumDescriptor('size.relativeHeightType', (val) => val, RelativeHeightType, 'RelativeHeightType')
        ]);
        this._native.history.addAndRedo(new ChangeAnchoredTextBoxSizeHistoryItem(this._native.modelManipulator, new SubDocumentInterval(this._subDocument, interval), sizeCore));
    }
    get properties() {
        const result = new TextBoxPropertiesApi();
        const prop = this._run.textBoxProperties;
        result.margins = new MarginsApi(prop.leftMargin, prop.rightMargin, prop.topMargin, prop.bottomMargin);
        result.verticalAlignment = prop.verticalAlignment;
        return result;
    }
    set properties(properties) {
        properties = ApiParametersChecker.check(properties, 1, false, [
            ApiParametersChecker.objectDescriptor('settings', 'TextBoxProperties', (val) => val)
        ]);
        const interval = new FixedInterval(this._position, 1);
        const textBoxProperties = this._run.textBoxProperties.clone();
        textBoxProperties.topMargin = ApiParametersChecker.check(properties.margins.top, 1, true, [
            ApiParametersChecker.numberDescriptor('properties.margins.top', (val) => val)
        ]);
        textBoxProperties.bottomMargin = ApiParametersChecker.check(properties.margins.bottom, 1, true, [
            ApiParametersChecker.numberDescriptor('properties.margins.bottom', (val) => val)
        ]);
        textBoxProperties.leftMargin = ApiParametersChecker.check(properties.margins.left, 1, true, [
            ApiParametersChecker.numberDescriptor('properties.margins.left', (val) => val)
        ]);
        textBoxProperties.rightMargin = ApiParametersChecker.check(properties.margins.right, 1, true, [
            ApiParametersChecker.numberDescriptor('properties.margins.right', (val) => val)
        ]);
        textBoxProperties.verticalAlignment = ApiParametersChecker.check(properties.verticalAlignment, 1, true, [
            ApiParametersChecker.enumDescriptor('properties.verticalAlignment', (val) => val, DrawingTextAnchoringType, 'DrawingTextAnchoringType')
        ]);
        this._native.history.addAndRedo(new ChangeTextBoxPropertiesHistoryItem(this._native.modelManipulator, new SubDocumentInterval(this._subDocument, interval), textBoxProperties));
    }
}
export class TextBoxSizeApi {
    constructor(absoluteSize, relativeSize, relativeWidthType, relativeHeightType) {
        this.absoluteSize = absoluteSize;
        this.relativeSize = relativeSize;
        this.relativeHeightType = relativeHeightType;
        this.relativeWidthType = relativeWidthType;
    }
}
export class TextBoxPropertiesApi {
}
export var DrawingTextAnchoringTypeApi;
(function (DrawingTextAnchoringTypeApi) {
    DrawingTextAnchoringTypeApi[DrawingTextAnchoringTypeApi["Bottom"] = 1] = "Bottom";
    DrawingTextAnchoringTypeApi[DrawingTextAnchoringTypeApi["Center"] = 2] = "Center";
    DrawingTextAnchoringTypeApi[DrawingTextAnchoringTypeApi["Distributed"] = 3] = "Distributed";
    DrawingTextAnchoringTypeApi[DrawingTextAnchoringTypeApi["Justified"] = 4] = "Justified";
    DrawingTextAnchoringTypeApi[DrawingTextAnchoringTypeApi["Top"] = 5] = "Top";
})(DrawingTextAnchoringTypeApi || (DrawingTextAnchoringTypeApi = {}));
export var RelativeWidthTypeApi;
(function (RelativeWidthTypeApi) {
    RelativeWidthTypeApi[RelativeWidthTypeApi["Margin"] = 0] = "Margin";
    RelativeWidthTypeApi[RelativeWidthTypeApi["Page"] = 1] = "Page";
    RelativeWidthTypeApi[RelativeWidthTypeApi["LeftMargin"] = 2] = "LeftMargin";
    RelativeWidthTypeApi[RelativeWidthTypeApi["RightMargin"] = 3] = "RightMargin";
    RelativeWidthTypeApi[RelativeWidthTypeApi["InsideMargin"] = 4] = "InsideMargin";
    RelativeWidthTypeApi[RelativeWidthTypeApi["OutsideMargin"] = 5] = "OutsideMargin";
})(RelativeWidthTypeApi || (RelativeWidthTypeApi = {}));
export var RelativeHeightTypeApi;
(function (RelativeHeightTypeApi) {
    RelativeHeightTypeApi[RelativeHeightTypeApi["Margin"] = 0] = "Margin";
    RelativeHeightTypeApi[RelativeHeightTypeApi["Page"] = 1] = "Page";
    RelativeHeightTypeApi[RelativeHeightTypeApi["TopMargin"] = 2] = "TopMargin";
    RelativeHeightTypeApi[RelativeHeightTypeApi["BottomMargin"] = 3] = "BottomMargin";
    RelativeHeightTypeApi[RelativeHeightTypeApi["InsideMargin"] = 4] = "InsideMargin";
    RelativeHeightTypeApi[RelativeHeightTypeApi["OutsideMargin"] = 5] = "OutsideMargin";
})(RelativeHeightTypeApi || (RelativeHeightTypeApi = {}));
