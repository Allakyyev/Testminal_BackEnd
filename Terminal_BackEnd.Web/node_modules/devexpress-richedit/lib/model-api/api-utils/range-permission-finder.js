import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export function findRangePermissionsByIntervals(sourceCollection, intervals) {
    const permissions = [];
    IntervalAlgorithms.handleAffectedObjects(sourceCollection, IntervalAlgorithms.getMergedIntervals(intervals, true), (permission, _index, interval, intersection) => {
        if (intersection.length || permission.length == 0 || intersection.start == permission.start ||
            (interval.length == 0 && interval.start < permission.end))
            permissions.push(permission);
    }, (_pos, _collection) => 0);
    return permissions;
}
export function findRangePermissions(sourceCollection, check) {
    const result = [];
    ListUtils.forEach(sourceCollection, (permission) => {
        if (check(permission))
            result.push(permission);
    });
    return result;
}
export function findRangePermission(sourceCollection, coreInterval, userName, group) {
    const intervals = findRangePermissionsByIntervals(sourceCollection, [coreInterval]);
    return ListUtils.elementBy(intervals, (permission) => permission.userName == userName && permission.group == group);
}
