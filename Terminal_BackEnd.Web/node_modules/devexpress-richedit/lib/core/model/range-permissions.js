import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ConstInterval } from '@devexpress/utils/lib/intervals/const';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { BookmarkBase } from './bookmarks';
export class RangePermission extends BookmarkBase {
    constructor(positionManager, interval, userName, group) {
        super(positionManager, interval);
        this.userName = userName.toLowerCase();
        this.group = group.toLowerCase();
    }
    isGranted(settings) {
        return RangePermission.allow(this.group, RangePermission.Everyone_GROUP_NAME) ||
            RangePermission.allow(this.userName, settings.authenticationUserName) ||
            RangePermission.allow(this.userName, settings.authenticationEMail) ||
            RangePermission.allow(this.group, settings.authenticationGroup);
    }
    static allow(permissionValue, settingsValue) {
        return settingsValue != "" && permissionValue == settingsValue;
    }
    get end() { return this._interval.end - 1; }
    get length() { return this.end - this.start; }
    get interval() { return FixedInterval.fromPositions(this.start, this.end); }
    get constRangePermission() {
        return new ConstRangePermission(this, this.userName, this.group);
    }
    getRangePermissionColor(model, documentProtection) {
        if (model.isDocumentProtectionEnabled)
            return documentProtection.rangeHighlightColor;
        let id = this.userName;
        if (!StringUtils.isNullOrEmpty(this.group))
            id += ':' + this.group;
        let color = model.colorProvider.rangePermissionColors[id];
        if (!color) {
            color = model.colorProvider.getColor();
            model.colorProvider.rangePermissionColors[id] = color;
        }
        return color;
    }
    clone(positionManager) {
        return new RangePermission(positionManager, this.interval, this.userName, this.group);
    }
    equals(obj) {
        return super.equals(obj) && (StringUtils.isNullOrEmpty(this.userName) ? this.group == obj.group : this.userName == obj.userName);
    }
}
RangePermission.Everyone_GROUP_NAME = "Everyone".toLowerCase();
RangePermission.Current_GROUP_NAME = "Current User".toLowerCase();
RangePermission.Editors_GROUP_NAME = "Editors".toLowerCase();
RangePermission.Owners_GROUP_NAME = "Owners".toLowerCase();
RangePermission.Contributors_GROUP_NAME = "Contributors".toLowerCase();
RangePermission.Administrators_GROUP_NAME = "Administrators".toLowerCase();
export class ConstRangePermission extends ConstInterval {
    constructor(interval, userName, group) {
        super();
        this.interval = BoundaryInterval.makeByConstInterval(interval);
        this.userName = userName;
        this.group = group;
    }
    get start() { return this.interval.start; }
    get length() { return this.interval.length; }
    get end() { return this.interval.end; }
    equals(obj) {
        return obj && this.userName == obj.userName && this.group == obj.group && this.interval.equals(obj.interval);
    }
    static comparer(a, b) {
        const diff = a.start - b.start;
        return diff == 0 ? (a.userName != b.userName ? Comparers.string(a.userName, b.userName) : Comparers.string(a.group, b.group)) : diff;
    }
}
