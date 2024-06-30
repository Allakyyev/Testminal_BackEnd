import { HistoryItem } from '../base/history-item';
import { ModelManipulator } from '../../manipulators/model-manipulator';
import { SubDocument } from '../../sub-document';
export declare class SwitchTextBoxSubDocumentsStateHistoryItem extends HistoryItem {
    private oldSubDocument;
    private readonly textBoxParentSubDocument;
    private readonly position;
    private newSubDocument;
    constructor(modelManipulator: ModelManipulator, oldSubDocument: SubDocument, textBoxParentSubDocument: SubDocument, position: number);
    redo(): void;
    undo(): void;
    private copyPropertiesToLastParagraph;
}
//# sourceMappingURL=switch-text-box-sub-documents-state-history-item.d.ts.map