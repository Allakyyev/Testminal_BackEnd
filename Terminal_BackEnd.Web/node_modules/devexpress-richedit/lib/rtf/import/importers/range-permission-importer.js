import { RangePermission } from '../../../core/model/range-permissions';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { RtfRevisionAuthors } from '../model/rtf-revision-authors';
import { RtfBaseImporter } from './importer-base';
export class RtfRangePermissionImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
        this.revisionAuthors = new RtfRevisionAuthors();
        this.userNames = [];
    }
    get rangePermissions() { return this.data.positionStates.last.rangePermissions; }
    insertRangePermissions() {
        StringMapUtils.forEach(this.data.importers.rangePermission.rangePermissions, (rangePermission, _name) => {
            if (rangePermission.validate(this.subDocument))
                this.subDocument.rangePermissions.push(new RangePermission(this.subDocument.positionManager, new BoundaryInterval(rangePermission.start, rangePermission.end), rangePermission.userName, rangePermission.group));
        });
        this.data.subDocument.rangePermissions.sort((a, b) => a.start != b.start ? a.start - b.start : a.end - b.end);
    }
    getUserNameById(id) {
        const userName = this.userNames[id - 1];
        return userName !== undefined ? userName : "";
    }
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
        this.insertRangePermissions();
    }
}
