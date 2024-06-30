import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { InputPositionBase } from '../../selection/input-position-base';
import { SelectionIntervalsInfo } from '../../selection/selection-intervals-info';
import { FieldsShowCodeChangedSubDocumentChange } from '../changes/sub-document/field/fields-show-code-changed';
import { HyperlinkInfoChangedSubDocumentChange } from '../changes/sub-document/field/hyperlink-info-changed';
import { HyperlinkInfo } from '../fields/field';
import { FieldsWaitingForUpdate, UpdateFieldsOptions } from '../fields/tree-creator';
import { ApplyFieldHyperlinkStyleHistoryItem } from '../history/items/apply-field-hyperlink-style-history-item';
import { ChangeFieldHyperlinkInfoHistoryItem } from '../history/items/change-field-hyperlink-info-history-item';
import { RemoveHyperlinkHistoryItem } from '../history/items/remove-hyperlink-history-item';
import { JSONUpdateFieldCommand } from '../json/enums/json-field-enums';
import { RunType } from '../runs/run-type';
import { SubDocumentInterval, SubDocumentPosition } from '../sub-document';
import { BaseManipulator } from './base-manipulator';
import { InsertTextManipulatorParams } from './text-manipulator/insert-text-manipulator-params';
export class UpdateFieldsManipulatorParams {
    constructor(subDocsInfo, callback = () => { }, updateOptions = new UpdateFieldsOptions()) {
        this.subDocsInfo = subDocsInfo;
        this.callback = callback ? callback : () => { };
        this.updateOptions = updateOptions;
    }
}
export class UpdateFieldsManipulatorResult {
    constructor(subDocsInfo) {
        this.subDocsInfo = subDocsInfo;
    }
}
class CurrentlyUpdatedSubDocumentInfo {
    constructor(subDocument, requestId) {
        this.subDocument = subDocument;
        this.requestId = requestId;
        this.result = null;
    }
}
export class FieldsManipulator extends BaseManipulator {
    constructor() {
        super(...arguments);
        this.currentlyUpdatedSubDocumentsInfo = {};
        this.requestId = 0;
    }
    setHyperlinkInfoViaHistory(subDocument, fieldIndex, newHyperlinkInfo) {
        this.history.addAndRedo(new ChangeFieldHyperlinkInfoHistoryItem(this.modelManipulator, subDocument, fieldIndex, newHyperlinkInfo));
    }
    setHyperlinkInfoInner(subDocument, fieldIndex, newHyperlinkInfo) {
        const field = subDocument.fields[fieldIndex];
        const oldValue = field.getHyperlinkInfo();
        field.setNewHyperlinkInfo(newHyperlinkInfo);
        this.modelManipulator.notifyModelChanged(new HyperlinkInfoChangedSubDocumentChange(subDocument.id, field.getResultInterval(), field.getCodeInterval(), newHyperlinkInfo));
        return oldValue;
    }
    setHyperlinkInfoWithReplaceResultAndCode(subDocument, fieldIndex, newHyperlinkInfo, shownText) {
        const field = subDocument.fields[fieldIndex];
        const inputPosition = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(subDocument, field.getCodeInterval().start));
        const codeNewText = HyperlinkInfo.getNewCodeText(newHyperlinkInfo);
        this.history.addTransaction(() => {
            this.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, field.getCodeInterval()), true, false);
            let param = new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, field.getCodeInterval().start), inputPosition.charPropsBundle, RunType.TextRun, codeNewText);
            this.modelManipulator.text.insertTextViaHistory(param);
            if (shownText) {
                this.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, field.getResultInterval()), true, false);
                const param = new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, field.getResultInterval().start), inputPosition.charPropsBundle, RunType.TextRun, shownText);
                this.modelManipulator.text.insertTextViaHistory(param);
                this.history.addAndRedo(new ApplyFieldHyperlinkStyleHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, field.getResultInterval())));
            }
            this.setHyperlinkInfoViaHistory(subDocument, fieldIndex, newHyperlinkInfo);
        });
    }
    setAllFieldsShowCode(showCode, subDocuments) {
        for (let sd of subDocuments) {
            const fields = sd.fields;
            let fieldIndexStartRecalculateLayout = null;
            for (let fieldIndex = 0, field; field = fields[fieldIndex]; fieldIndex++) {
                if (field.showCode != showCode) {
                    field.showCode = showCode;
                    if (fieldIndexStartRecalculateLayout === null)
                        fieldIndexStartRecalculateLayout = fieldIndex;
                }
            }
            if (fieldIndexStartRecalculateLayout !== null) {
                this.modelManipulator.notifyModelChanged(new FieldsShowCodeChangedSubDocumentChange(sd.id, FixedInterval.fromPositions(fields[fieldIndexStartRecalculateLayout].getFieldStartPosition(), fields[fields.length - 1].getFieldEndPosition())));
            }
        }
    }
    setFieldShowCode(subDocument, field, showCode) {
        if (field.showCode != showCode) {
            field.showCode = showCode;
            this.modelManipulator.notifyModelChanged(new FieldsShowCodeChangedSubDocumentChange(subDocument.id, field.getAllFieldInterval()));
        }
    }
    continueUpdateFields(model, responce) {
        var subDocument = model.subDocuments[responce[JSONUpdateFieldCommand.SubDocumentId]];
        if (subDocument && subDocument.fieldsWaitingForUpdate)
            subDocument.fieldsWaitingForUpdate.update(responce[JSONUpdateFieldCommand.Info]);
    }
    updateFields(layoutFormatterManager, requestManager, options) {
        if (ListUtils.unsafeAnyOf(options.subDocsInfo, (sdInfo) => !!this.currentlyUpdatedSubDocumentsInfo[sdInfo.subDocument.id])) {
            options.callback(new UpdateFieldsManipulatorResult([]));
            return false;
        }
        const sdInfo = ListUtils.reducedMap(options.subDocsInfo, (subDocInfo) => subDocInfo.subDocument.fields.length > 0 ? subDocInfo : null);
        if (!sdInfo.length) {
            options.callback(new UpdateFieldsManipulatorResult([]));
            return true;
        }
        const currRequestId = this.requestId++;
        for (let info of sdInfo)
            this.currentlyUpdatedSubDocumentsInfo[info.subDocument.id] = new CurrentlyUpdatedSubDocumentInfo(info.subDocument, currRequestId);
        this.modelManipulator.modelManager.history.beginTransaction();
        const lastIntervalInfoIndex = sdInfo.length - 1;
        for (let intervalIndex = 0, sdInterval; sdInterval = sdInfo[intervalIndex]; intervalIndex++) {
            sdInterval.subDocument.fieldsWaitingForUpdate =
                new FieldsWaitingForUpdate(this.modelManipulator.modelManager, layoutFormatterManager, requestManager, sdInterval, options.updateOptions, (result) => {
                    result.subDocIntervals.subDocument.fieldsWaitingForUpdate = null;
                    this.currentlyUpdatedSubDocumentsInfo[result.subDocIntervals.subDocument.id].result = result.subDocIntervals;
                    if (this.allSubDocsByRequestUpdated(currRequestId)) {
                        this.modelManipulator.modelManager.history.endTransaction();
                        options.callback(this.collectResult(currRequestId));
                    }
                });
            sdInterval.subDocument.fieldsWaitingForUpdate.update(null, intervalIndex == lastIntervalInfoIndex);
        }
        return true;
    }
    get isBusy() { return NumberMapUtils.isEmpty(this.currentlyUpdatedSubDocumentsInfo); }
    allSubDocsByRequestUpdated(requestId) {
        return NumberMapUtils.allOf(this.currentlyUpdatedSubDocumentsInfo, (info) => info.requestId != requestId || !!info.result);
    }
    collectResult(requestId) {
        const result = new UpdateFieldsManipulatorResult([]);
        const restInfo = {};
        NumberMapUtils.forEach(this.currentlyUpdatedSubDocumentsInfo, (info, key) => {
            if (info.requestId == requestId)
                result.subDocsInfo.push(info.result);
            else
                restInfo[key] = info;
        });
        this.currentlyUpdatedSubDocumentsInfo = restInfo;
        return result;
    }
    removeHyperlink(subDocument, field) {
        if (!field || !field.isHyperlinkField())
            return;
        this.history.beginTransaction();
        this.history.addAndRedo(new RemoveHyperlinkHistoryItem(this.modelManipulator, subDocument, field));
        this.history.endTransaction();
    }
    changeHyperlinkInfo(subDocument, field, hyperlinkInfo, resultText) {
        if (!field || !field.isHyperlinkField())
            return false;
        const codeNewText = HyperlinkInfo.getNewCodeText(hyperlinkInfo);
        const fieldCodeInterval = field.getCodeInterval();
        this.history.addTransaction(() => {
            if (fieldCodeInterval.length)
                this.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, fieldCodeInterval), true, false);
            const inpPos = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(subDocument, fieldCodeInterval.start));
            this.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, fieldCodeInterval.start), inpPos.charPropsBundle, RunType.TextRun, codeNewText));
            if (resultText) {
                const fieldResultInterval = field.getResultInterval();
                if (fieldResultInterval.length)
                    this.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, fieldResultInterval), true, false);
                inpPos.setIntervals(SelectionIntervalsInfo.fromPosition(subDocument, fieldResultInterval.start));
                this.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, fieldResultInterval.start), inpPos.charPropsBundle, RunType.TextRun, resultText));
                this.history.addAndRedo(new ApplyFieldHyperlinkStyleHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, field.getResultInterval())));
            }
            this.history.addAndRedo(new ChangeFieldHyperlinkInfoHistoryItem(this.modelManipulator, subDocument, field.index, hyperlinkInfo));
        });
        return true;
    }
}
