import { ApiParametersChecker } from '../api-utils/api-utils/parameter-checker';
import { HyperlinkInfo } from '../core/model/fields/field';
import { FieldContextMenuHelper } from '../core/model/fields/field-context-menu-helper';
import { FieldsWaitingForUpdate, UpdateFieldsOptions } from '../core/model/fields/tree-creator';
import { UpdateFieldsManipulatorParams } from '../core/model/manipulators/fields-manipulator';
import { SubDocumentInterval, SubDocumentIntervals } from '../core/model/sub-document';
import { convertToIntervalApi } from './interval';
import { SubDocumentApi } from './sub-document';
export var FieldNameApi;
(function (FieldNameApi) {
    FieldNameApi[FieldNameApi["Unknown"] = 0] = "Unknown";
    FieldNameApi[FieldNameApi["Time"] = 1] = "Time";
    FieldNameApi[FieldNameApi["Date"] = 2] = "Date";
    FieldNameApi[FieldNameApi["Page"] = 3] = "Page";
    FieldNameApi[FieldNameApi["NumPages"] = 4] = "NumPages";
    FieldNameApi[FieldNameApi["MergeField"] = 5] = "MergeField";
    FieldNameApi[FieldNameApi["DocVariable"] = 6] = "DocVariable";
    FieldNameApi[FieldNameApi["Hyperlink"] = 7] = "Hyperlink";
    FieldNameApi[FieldNameApi["Seq"] = 8] = "Seq";
    FieldNameApi[FieldNameApi["Tc"] = 9] = "Tc";
    FieldNameApi[FieldNameApi["PageRef"] = 10] = "PageRef";
    FieldNameApi[FieldNameApi["Toc"] = 11] = "Toc";
    FieldNameApi[FieldNameApi["FillIn"] = 12] = "FillIn";
})(FieldNameApi || (FieldNameApi = {}));
export class FieldApi {
    constructor(processor, subDocument, field) {
        this._processor = processor;
        this._field = field;
        this._subDocument = subDocument;
    }
    get index() {
        return this._field.index;
    }
    get interval() {
        return convertToIntervalApi(this._field.getAllFieldInterval());
    }
    get codeInterval() {
        return convertToIntervalApi(this._field.getCodeInterval());
    }
    get subDocument() {
        return new SubDocumentApi(this._processor, this._subDocument);
    }
    get resultInterval() {
        return convertToIntervalApi(this._field.getResultInterval());
    }
    get isShowCode() {
        return this._field.showCode;
    }
    set isShowCode(val) {
        this._processor.modelManager.modelManipulator.field.setFieldShowCode(this._subDocument, this._field, !!val);
    }
    get isHyperlink() {
        return this._field.isHyperlinkField();
    }
    get name() {
        const parser = FieldsWaitingForUpdate.getParser(this._processor.modelManager, this._processor.layoutFormatterManager, null, this._subDocument, this._field);
        return parser ? parser.name : FieldNameApi.Unknown;
    }
    delete() {
        this._processor.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this._subDocument, this._field.getAllFieldInterval()), true, false);
    }
    update(callback) {
        callback = callback ?
            ApiParametersChecker.check(callback, 1, false, [
                ApiParametersChecker.functionDescriptor('callback', (val) => val)
            ]) :
            () => { };
        this._processor.modelManager.history.beginTransaction();
        this._processor.beginUpdate();
        return this._processor.modelManager.modelManipulator.field.updateFields(this._processor.layoutFormatterManager, this._processor.createFieldRequestManager(), new UpdateFieldsManipulatorParams([new SubDocumentIntervals(this._subDocument, [this._field.getAllFieldInterval()])], () => {
            this._processor.endUpdate();
            this._processor.modelManager.history.endTransaction();
            callback(this);
        }, new UpdateFieldsOptions()));
    }
}
export class HyperlinkApi extends FieldApi {
    get hyperlinkInfo() {
        const coreInfo = this._field.getHyperlinkInfo();
        return new HyperlinkInfoApi(FieldContextMenuHelper.getHyperlinkResultText(this._subDocument, this._field), coreInfo.uri, coreInfo.anchor, coreInfo.tip);
    }
    set hyperlinkInfo(hyperlinkInfo) {
        hyperlinkInfo = ApiParametersChecker.check(hyperlinkInfo, 1, false, [
            ApiParametersChecker.objectDescriptor("info", "HyperlinkInfo", (v) => v)
        ]);
        const uri = ApiParametersChecker.check(hyperlinkInfo.url, 1, true, [
            ApiParametersChecker.stringDescriptor("hyperlinkInfo.url", (v) => v ? v : "", true)
        ]);
        const tip = ApiParametersChecker.check(hyperlinkInfo.tooltip, 1, true, [
            ApiParametersChecker.stringDescriptor("hyperlinkInfo.tooltip", (v) => v ? v : "", true)
        ]);
        const anchor = ApiParametersChecker.check(hyperlinkInfo.bookmark, 1, true, [
            ApiParametersChecker.stringDescriptor("hyperlinkInfo.bookmark", (v) => v ? v : "", true)
        ]);
        const shownText = ApiParametersChecker.check(hyperlinkInfo.text, 1, true, [
            ApiParametersChecker.stringDescriptor("hyperlinkInfo.text", (v) => v ? v : "", true)
        ]);
        const hyperlinkInfoCore = new HyperlinkInfo(uri, anchor, tip, false);
        this._processor.modelManager.modelManipulator.field.setHyperlinkInfoWithReplaceResultAndCode(this._subDocument, this.index, hyperlinkInfoCore, shownText);
    }
}
export class HyperlinkInfoApi {
    constructor(text, url, bookmark, tooltip) {
        this.url = url;
        this.bookmark = bookmark;
        this.tooltip = tooltip;
        this.text = text;
    }
}
