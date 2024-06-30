import { ModelChangeType } from '../../core/model/changes/enums';
import { BatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { SetSelectionStateOptions } from './selection';
export class SelectionModelChangesListener extends BatchUpdatableObject {
    constructor(selection) {
        super();
        this.selection = selection;
    }
    modelChanged(change) {
        switch (change.type) {
            case ModelChangeType.InlinePictureInserted:
            case ModelChangeType.AnchoredPictureInserted:
            case ModelChangeType.FieldInserted:
            case ModelChangeType.FieldDeleted:
            case ModelChangeType.SimpleRunInserted:
            case ModelChangeType.TextBufferChanged:
            case ModelChangeType.ParagraphInserted:
            case ModelChangeType.SectionInserted:
            case ModelChangeType.AnchoredTextBoxInserted:
            case ModelChangeType.AnchorObjectRemoved:
            case ModelChangeType.IntervalRemoved:
            case ModelChangeType.ParagraphMerged:
            case ModelChangeType.SectionMerged:
            case ModelChangeType.TableCreated:
            case ModelChangeType.TableRemoved:
            case ModelChangeType.TableStartPositionShifted:
            case ModelChangeType.TableRowInserted:
            case ModelChangeType.TableRowRemoved:
            case ModelChangeType.TableCellRemoved:
            case ModelChangeType.TableCellInserted: {
                this.raiseSelectionChange();
                break;
            }
        }
    }
    onUpdateUnlocked(occurredEvents) {
        if (occurredEvents != 0)
            this.raiseSelectionChangeCore();
    }
    raiseSelectionChange() {
        if (!this.isUpdateLocked())
            this.raiseSelectionChangeCore();
        else
            this.registerOccurredEvent(1);
    }
    raiseSelectionChangeCore() {
        this.selection.changeState(newState => newState, new SetSelectionStateOptions().forceUpdate());
    }
}
