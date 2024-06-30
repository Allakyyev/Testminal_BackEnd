import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { Field, HyperlinkInfo } from '../../core/model/fields/field';
import { FieldContextMenuHelper } from '../../core/model/fields/field-context-menu-helper';
import { ApplyFieldHyperlinkStyleHistoryItem } from '../../core/model/history/items/apply-field-hyperlink-style-history-item';
import { ChangeFieldHyperlinkInfoHistoryItem } from '../../core/model/history/items/change-field-hyperlink-info-history-item';
import { FieldInsertHistoryItem } from '../../core/model/history/items/field-insert-history-item';
import { SubDocumentInterval } from '../../core/model/sub-document';
import { InputPositionBase } from '../../core/selection/input-position-base';
import { SelectionIntervalsInfo } from '../../core/selection/selection-intervals-info';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { HyperlinkApi } from '../field';
import { convertToIntervalApi } from '../interval';
import { SubDocumentApi } from '../sub-document';
import { Collection } from './collection';
import { findFields } from './field-collection';
export class HyperlinkCollection extends Collection {
    constructor(processor, subDocument) {
        super(processor);
        this._subDocument = subDocument;
    }
    create(position, hyperlinkInfo) {
        const interval = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => new FixedInterval(n, 0)),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length))
        ]);
        const docEndPos = this._subDocument.getDocumentEndPosition() - 1;
        const startP = MathUtils.restrictValue(interval.start, 0, docEndPos);
        const endP = MathUtils.restrictValue(interval.end, 0, docEndPos);
        interval.start = startP;
        interval.length = Math.max(0, endP - startP);
        hyperlinkInfo = ApiParametersChecker.check(hyperlinkInfo, 2, false, [
            ApiParametersChecker.objectDescriptor("hyperlinkInfo", "DevExpress.RichEdit.HyperinkInfo", (s) => s)
        ]);
        hyperlinkInfo.tooltip = ApiParametersChecker.check(hyperlinkInfo.tooltip, 2, true, [
            ApiParametersChecker.stringDescriptor("hyperlinkInfo.tooltip", (s) => s ? s : "", true)
        ]);
        hyperlinkInfo.text = ApiParametersChecker.check(hyperlinkInfo.text, 2, true, [
            ApiParametersChecker.stringDescriptor("hyperlinkInfo.text", (s) => s ? s : "", true)
        ]);
        hyperlinkInfo.bookmark = ApiParametersChecker.check(hyperlinkInfo.bookmark, 2, true, [
            ApiParametersChecker.stringDescriptor("hyperlinkInfo.bookmark", (s) => s ? s : "", true)
        ]);
        hyperlinkInfo.url = ApiParametersChecker.check(hyperlinkInfo.url, 2, true, [
            ApiParametersChecker.stringDescriptor("hyperlinkInfo.url", (s) => s ? s : "", true)
        ]);
        const info = new HyperlinkInfo(hyperlinkInfo.url, hyperlinkInfo.bookmark, hyperlinkInfo.tooltip, false);
        const canChangeHyperlinkDisplayText = FieldContextMenuHelper.canChangeHyperlinkDisplayText(new SubDocumentInterval(this._subDocument, interval));
        const subDocument = new SubDocumentApi(this._processor, this._subDocument);
        const inputPos = new InputPositionBase().setIntervals(new SelectionIntervalsInfo(this._subDocument, [interval]));
        const modelManipulator = this._processor.modelManager.modelManipulator;
        this._processor.beginUpdate();
        this._processor.modelManager.history.beginTransaction();
        this._processor.modelManager.history.addAndRedo(new FieldInsertHistoryItem(this._processor.modelManager.modelManipulator, this._subDocument, interval.start, 0, interval.length, false, inputPos.charPropsBundle));
        const fieldIndex = Field.normedBinaryIndexOf(this._subDocument.fields, interval.start + 1);
        const field = this._subDocument.fields[fieldIndex];
        this._processor.modelManager.history.addAndRedo(new ChangeFieldHyperlinkInfoHistoryItem(modelManipulator, this._subDocument, field.index, info));
        subDocument.insertText(field.getCodeInterval().start, HyperlinkInfo.getNewCodeText(info));
        if (canChangeHyperlinkDisplayText && hyperlinkInfo.text || field.getResultInterval().length == 0) {
            subDocument.deleteText(convertToIntervalApi(field.getResultInterval()));
            subDocument.insertText(field.getResultInterval().start, !hyperlinkInfo.text || hyperlinkInfo.text == "" ? info.getUriPlusAnchor() : hyperlinkInfo.text);
        }
        this._processor.modelManager.history.addAndRedo(new ApplyFieldHyperlinkStyleHistoryItem(this._processor.modelManager.modelManipulator, new SubDocumentInterval(this._subDocument, field.getResultInterval())));
        this._processor.modelManager.history.endTransaction();
        this._processor.endUpdate();
        return this._getItem(this._subDocument.fields[Field.binaryIndexOf(this._subDocument.fields, interval.start + 1)]);
    }
    find(position) {
        const interval = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => new FixedInterval(n, 0)),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length))
        ]);
        return ListUtils.reducedMap(findFields(this._subDocument.fields, interval), f => f.isHyperlinkField() ? this._getItem(f) : null);
    }
    _getItem(coreItem) {
        return new HyperlinkApi(this._processor, this._subDocument, coreItem);
    }
    _getCoreItems() {
        return ListUtils.reducedMap(this._subDocument.fields, (f) => f.isHyperlinkField() ? f : null);
    }
}
