import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { CreateRangePermissionHistoryItem } from '../../core/model/history/items/range-permission-history-item';
import { ConstRangePermission, RangePermission } from '../../core/model/range-permissions';
import { Constants } from '@devexpress/utils/lib/constants';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { findRangePermission, findRangePermissions, findRangePermissionsByIntervals } from '../api-utils/range-permission-finder';
import { RangePermissionApi } from '../range-permission';
import { Collection } from './collection';
export class RangePermissionCollection extends Collection {
    constructor(processor, subDocument) {
        super(processor);
        this._subDocument = subDocument;
    }
    protectRange(intervals, userName = '', group = RangePermission.Everyone_GROUP_NAME) {
        const modelManager = this._processor.modelManager;
        modelManager.history.beginTransaction();
        const modelIntervals = ListUtils.map(intervals, (interval) => new FixedInterval(interval.start, interval.length));
        const mergedIntervals = IntervalAlgorithms.getMergedIntervals(modelIntervals, true);
        let startPosition = 0;
        let endPosition = 0;
        const result = [];
        ListUtils.forEach(mergedIntervals, (interval) => {
            endPosition = interval.start + 1;
            const length = endPosition - startPosition;
            if (length)
                result.push(this.create({ start: startPosition, length: length }, userName, group));
            startPosition = interval.end;
        });
        endPosition = this._subDocument.interval.end;
        const length = endPosition - startPosition;
        if (length)
            result.push(this.create({ start: startPosition, length: length }, userName, group));
        modelManager.history.endTransaction();
        return result;
    }
    find(options) {
        const sd = this._subDocument;
        ApiParametersChecker.objectDescriptor('options', 'DevExpress.RichEdit.IRangePermissionSearchOptions', (opt) => opt);
        const permissions = isDefined(options.position) ?
            findByPosition(options.position, true, sd.rangePermissions) : sd.rangePermissions;
        const permissionCurentUser = isDefined(options.userName) ?
            findByUserName(options.userName, permissions) : permissions;
        const result = isDefined(options.group) ?
            findByGroup(options.group, permissions) : permissionCurentUser;
        return ListUtils.map(result, (permission) => this._getItem(permission));
    }
    isAllowEdit(position) {
        const coreIntervals = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (pos) => [new FixedInterval(pos, 0)], 0, Constants.MAX_SAFE_INTEGER),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => [new FixedInterval(interval.start, interval.length)], 0, Constants.MAX_SAFE_INTEGER),
            ModelParametersChecker.intervalsDescriptor("intervals", (apiIntervals) => ListUtils.map(apiIntervals, (interval) => new FixedInterval(interval.start, interval.length)), 0, Constants.MAX_SAFE_INTEGER)
        ]);
        return this._subDocument.isEditable(coreIntervals);
    }
    create(interval, userName = '', group = RangePermission.Everyone_GROUP_NAME) {
        const coreInterval = ApiParametersChecker.check(interval, 1, false, [
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length)),
        ]);
        const modelManager = this._processor.modelManager;
        modelManager.history.addAndRedo(new CreateRangePermissionHistoryItem(modelManager.modelManipulator, this._subDocument, new ConstRangePermission(coreInterval, userName, group)));
        const rangePermission = findRangePermission(this._subDocument.rangePermissions, coreInterval, userName, group);
        return this._getItem(rangePermission);
    }
    _getItem(coreItem) {
        return new RangePermissionApi(this._processor, this._subDocument, coreItem);
    }
    _getCoreItems() {
        return this._subDocument.rangePermissions;
    }
}
function findByPosition(position, canBeUndefined, sourceCollection) {
    return ListUtils.map(ApiParametersChecker.check(position, 1, canBeUndefined, [
        ApiParametersChecker.numberDescriptor("position", (pos) => findRangePermissionsByIntervals(sourceCollection, [new FixedInterval(pos, 0)]), 0, Constants.MAX_SAFE_INTEGER),
        ModelParametersChecker.intervalDescriptor("interval", (interval) => findRangePermissionsByIntervals(sourceCollection, [new FixedInterval(interval.start, interval.length)]), 0, Constants.MAX_SAFE_INTEGER),
        ModelParametersChecker.intervalsDescriptor("intervals", (apiIntervals) => findRangePermissionsByIntervals(sourceCollection, ListUtils.map(apiIntervals, (interval) => new FixedInterval(interval.start, interval.length))), 0, Constants.MAX_SAFE_INTEGER)
    ]), (b) => b);
}
function findByUserName(value, permissions) {
    return ListUtils.map(ApiParametersChecker.check(value, 1, true, [
        ApiParametersChecker.stringDescriptor("userName", (userName) => findRangePermissions(permissions, permission => permission.userName == userName), false),
        ApiParametersChecker.regExpDescriptor('regexp', (regexp) => findRangePermissions(permissions, permission => regexp.test(permission.userName)))
    ]), (b) => b);
}
function findByGroup(value, permissions) {
    return ListUtils.map(ApiParametersChecker.check(value, 1, true, [
        ApiParametersChecker.stringDescriptor("group", (group) => findRangePermissions(permissions, permission => permission.group == group), false),
        ApiParametersChecker.regExpDescriptor('regexp', (regexp) => findRangePermissions(permissions, permission => regexp.test(permission.group)))
    ]), (b) => b);
}
