import { ModelChangeType } from '../../enums';
export class TableStartPositionShiftedSubDocumentChange {
    constructor(subDocumentId, table, oldPosition, newPosition) {
        this.subDocumentId = subDocumentId;
        this.table = table;
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.type = ModelChangeType.TableStartPositionShifted;
    }
}
