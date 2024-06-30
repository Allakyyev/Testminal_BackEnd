import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { Field } from '../../core/model/fields/field';
import { UpdateFieldsOptions } from '../../core/model/fields/tree-creator';
import { FieldInsertHistoryItem } from '../../core/model/history/items/field-insert-history-item';
import { InsertTextHistoryItem } from '../../core/model/history/items/insert-text-history-item';
import { UpdateFieldsManipulatorParams } from '../../core/model/manipulators/fields-manipulator';
import { InsertTextManipulatorParams } from '../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../../core/model/runs/run-type';
import { SubDocumentIntervals, SubDocumentPosition } from '../../core/model/sub-document';
import { InputPositionBase } from '../../core/selection/input-position-base';
import { SelectionIntervalsInfo } from '../../core/selection/selection-intervals-info';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isNumber } from '@devexpress/utils/lib/utils/common';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { getRestrictedInterval } from '../api-utils/api-utils';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { FieldApi } from '../field';
import { Collection } from './collection';
export class FieldCollection extends Collection {
    constructor(processor, subDocument) {
        super(processor);
        this._subDocument = subDocument;
    }
    create(position, code) {
        const codeInterval = ApiParametersChecker.check(position, 1, false, [
            ModelParametersChecker.intervalDescriptor("codeInterval", interval => getRestrictedInterval(interval, 0, this._subDocument.getDocumentEndPosition())),
            ApiParametersChecker.numberDescriptor("position", (n) => new FixedInterval(MathUtils.restrictValue(n, 0, this._subDocument.getDocumentEndPosition() - 1), 0)),
        ]);
        if (isNumber(position))
            code = ApiParametersChecker.check(code, 2, true, [
                ApiParametersChecker.stringDescriptor("code", (s) => s, true)
            ]);
        else
            code = undefined;
        const inputPos = new InputPositionBase().setIntervals(new SelectionIntervalsInfo(this._subDocument, [new FixedInterval(codeInterval.start, 0)]));
        this._processor.beginUpdate();
        this._processor.modelManager.history.beginTransaction();
        this._processor.modelManager.history.addAndRedo(new FieldInsertHistoryItem(this._processor.modelManager.modelManipulator, this._subDocument, codeInterval.start, codeInterval.length, 0, true, inputPos.charPropsBundle));
        if (code) {
            this._processor.modelManager.history.addAndRedo(new InsertTextHistoryItem(this._processor.modelManager.modelManipulator, new InsertTextManipulatorParams(new SubDocumentPosition(this._subDocument, codeInterval.start + 1), inputPos.charPropsBundle, RunType.TextRun, code)));
        }
        this._processor.modelManager.history.endTransaction();
        this._processor.endUpdate();
        return this._getItem(this._subDocument.fields[Field.binaryIndexOf(this._subDocument.fields, codeInterval.start + 1)]);
    }
    createMergeField(position, name) {
        return this.create(position, `MERGEFIELD "${name}"`);
    }
    find(position) {
        const interval = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => new FixedInterval(n, 0)),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length))
        ]);
        return findFields(this._subDocument.fields, interval).map(f => this._getItem(f));
    }
    showAllFieldResults(doInAllSubDocuments) {
        this._showAllFieldCodesCore(doInAllSubDocuments, false);
    }
    showAllFieldCodes(doInAllSubDocuments) {
        this._showAllFieldCodesCore(doInAllSubDocuments, true);
    }
    updateAllFields(callback, options) {
        if (callback)
            callback = ApiParametersChecker.check(callback, 1, true, [
                ApiParametersChecker.functionDescriptor('callback', (val) => val)
            ]);
        if (options)
            options = ApiParametersChecker.check(options, 2, false, [
                ApiParametersChecker.objectDescriptor('options', 'UpdateFieldsOptions', (val) => val)
            ]);
        else
            options = new UpdateFieldsOptionsApi(true, true);
        const sdInfo = options.doInAllSubDocuments ?
            NumberMapUtils.toListBy(this._processor.modelManager.model.subDocuments, (sd) => new SubDocumentIntervals(sd, [sd.interval])) :
            [new SubDocumentIntervals(this._subDocument, [this._subDocument.interval])];
        this._processor.beginUpdate();
        this._processor.modelManager.history.beginTransaction();
        return this._processor.modelManager.modelManipulator.field.updateFields(this._processor.layoutFormatterManager, this._processor.createFieldRequestManager(), new UpdateFieldsManipulatorParams(sdInfo, () => {
            this._processor.modelManager.history.endTransaction();
            this._processor.endUpdate();
            if (callback)
                callback();
        }, new UpdateFieldsOptions(options.updateTocFields)));
    }
    _showAllFieldCodesCore(doInAllSubDocuments = true, showCode) {
        doInAllSubDocuments = ApiParametersChecker.check(doInAllSubDocuments, 1, true, [
            ApiParametersChecker.booleanDescriptor('doInAllSubDocuments', (val) => val)
        ]);
        const subDocumentsList = doInAllSubDocuments ?
            NumberMapUtils.toList(this._processor.modelManager.model.subDocuments) :
            [this._subDocument];
        this._processor.beginUpdate();
        this._processor.modelManager.modelManipulator.field.setAllFieldsShowCode(showCode, subDocumentsList);
        this._processor.endUpdate();
    }
    _getItem(coreItem) {
        return new FieldApi(this._processor, this._subDocument, coreItem);
    }
    _getCoreItems() {
        return this._subDocument.fields;
    }
}
export class UpdateFieldsOptionsApi {
    constructor(doInAllSubDocuments = true, updateTocFields = true) {
        this.doInAllSubDocuments = doInAllSubDocuments;
        this.updateTocFields = updateTocFields;
    }
}
export function findFields(fields, interval) {
    if (fields.length == 0)
        return [];
    let fieldIndex = fields[Math.max(0, Field.normedBinaryIndexOf(fields, interval.start))].getAbsolutelyTopLevelField().index;
    const resultFields = [];
    for (let field; field = fields[fieldIndex]; fieldIndex++) {
        const fieldInterval = field.getAllFieldInterval();
        const intersection = IntervalAlgorithms.getIntersection(fieldInterval, interval);
        if (intersection && (!!intersection.length || fieldInterval.contains(intersection.start)))
            resultFields.push(field);
        else if (!field.parent && field.getFieldStartPosition() >= interval.end)
            break;
    }
    return resultFields;
}
