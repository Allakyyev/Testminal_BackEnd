import { ModelChangeType } from '../../core/model/changes/enums';
import { BatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { Flag } from '@devexpress/utils/lib/class/flag';
var InputPositionEventType;
(function (InputPositionEventType) {
    InputPositionEventType[InputPositionEventType["None"] = 0] = "None";
    InputPositionEventType[InputPositionEventType["FullReset"] = 1] = "FullReset";
    InputPositionEventType[InputPositionEventType["ResetSectionProperties"] = 2] = "ResetSectionProperties";
    InputPositionEventType[InputPositionEventType["CheckSelectionChange"] = 4] = "CheckSelectionChange";
})(InputPositionEventType || (InputPositionEventType = {}));
export class InputPositionModelChangesListener extends BatchUpdatableObject {
    constructor(inputPosition, selection) {
        super();
        this.updateEnabled = true;
        this.inputPosition = inputPosition;
        this.selection = selection;
    }
    onUpdateUnlocked(occurredEvents) {
        this.applyEvent(occurredEvents);
    }
    NotifySelectionChanged() {
        this.applyEvent(this.getSelectionChangeEvent());
    }
    modelChanged(change) {
        const occurredEvents = this.getModelChangeEvent(change);
        if (this.isUpdateLocked())
            this.registerOccurredEvent(occurredEvents);
        else
            this.applyEvent(occurredEvents);
    }
    applyEvent(occurredEvents) {
        if (!this.updateEnabled)
            return;
        const flag = new Flag(occurredEvents);
        if (flag.get(InputPositionEventType.CheckSelectionChange))
            flag.add(this.getSelectionChangeEvent());
        if (flag.get(InputPositionEventType.FullReset))
            this.inputPosition.reset();
        else if (flag.get(InputPositionEventType.ResetSectionProperties))
            this.inputPosition.resetSectionMergedProperties();
    }
    getSelectionChangeEvent() {
        return this.selection.shouldResetInputPosition() ?
            InputPositionEventType.FullReset :
            InputPositionEventType.None;
        ;
    }
    getModelChangeEvent(change) {
        switch (change.type) {
            case ModelChangeType.DifferentOddAndEvenPages:
            case ModelChangeType.PageColor:
                return InputPositionEventType.ResetSectionProperties;
            case ModelChangeType.DefaultTabWidth:
            case ModelChangeType.HeaderFooterCreated:
            case ModelChangeType.HeaderFooterIndexChanged:
            case ModelChangeType.LoadFontInfo:
            case ModelChangeType.SectionFormattingChanged:
            case ModelChangeType.CreateStyleLink:
            case ModelChangeType.DeleteStyleLink:
                return InputPositionEventType.FullReset;
            case ModelChangeType.AbstractNumberingListAdded:
            case ModelChangeType.AbstractNumberingListDeleted:
            case ModelChangeType.NumberingListAdded:
            case ModelChangeType.NumberingListDeleted:
            case ModelChangeType.ListLevelPropertyChanged:
            case ModelChangeType.ListLevelParagraphPropertyChanged:
            case ModelChangeType.ListLevelCharacterPropertyChanged:
            case ModelChangeType.IOverrideListLevelChanged:
                return InputPositionEventType.FullReset;
            case ModelChangeType.BookmarkCreated:
            case ModelChangeType.BookmarkDeleted:
                return InputPositionEventType.None;
            case ModelChangeType.TabInserted:
            case ModelChangeType.TabDeleted:
                return InputPositionEventType.FullReset;
            case ModelChangeType.LoadPicturesInfo:
            case ModelChangeType.InlinePicturesUpdated:
                return InputPositionEventType.None;
            case ModelChangeType.InlinePictureInserted:
            case ModelChangeType.AnchoredPictureInserted:
                return InputPositionEventType.FullReset;
            case ModelChangeType.AnchoredPictureSizeChanged:
                return InputPositionEventType.None;
            case ModelChangeType.InlineObjectRunPropertyChanged:
                return InputPositionEventType.FullReset;
            case ModelChangeType.FieldInserted:
            case ModelChangeType.FieldDeleted:
                return InputPositionEventType.None;
            case ModelChangeType.HyperlinkInfoChanged:
                return InputPositionEventType.FullReset;
            case ModelChangeType.FieldsShowCodeChanged:
                return InputPositionEventType.None;
            case ModelChangeType.SimpleRunInserted:
            case ModelChangeType.TextBufferChanged:
            case ModelChangeType.ParagraphInserted:
            case ModelChangeType.SectionInserted:
            case ModelChangeType.AnchoredTextBoxInserted:
            case ModelChangeType.AnchorObjectRemoved:
            case ModelChangeType.IntervalRemoved:
            case ModelChangeType.ParagraphMerged:
            case ModelChangeType.SectionMerged:
                return InputPositionEventType.FullReset;
            case ModelChangeType.CharacterFormattingChanged:
            case ModelChangeType.CharacterPropertiesChanged:
            case ModelChangeType.ParagraphFormattingChanged:
            case ModelChangeType.ParagraphPropertiesChanged:
            case ModelChangeType.ParagraphAndCharacterMergedPropertiesReset:
                return InputPositionEventType.FullReset;
            case ModelChangeType.AnchoredTextBoxSizeChanged:
                return InputPositionEventType.None;
            case ModelChangeType.AnchoredTextBoxPropertiesChanged:
            case ModelChangeType.AnchorInfoPropertyChanged:
            case ModelChangeType.ShapeChanged:
            case ModelChangeType.ShapePropertyChanged:
                return InputPositionEventType.FullReset;
            case ModelChangeType.CharacterStyleApplied:
            case ModelChangeType.ParagraphStyleApplied:
            case ModelChangeType.TableStyleChanged:
            case ModelChangeType.ParagraphNumberingListChanged:
                return InputPositionEventType.FullReset;
            case ModelChangeType.TableCreated:
            case ModelChangeType.TableRemoved:
            case ModelChangeType.TableStartPositionShifted:
            case ModelChangeType.TableCellPropertyChanged:
            case ModelChangeType.TablePropertyChanged:
            case ModelChangeType.TableRowPropertyChanged:
            case ModelChangeType.TableCellSplittedHorizontally:
            case ModelChangeType.TableCellMergedHorizontally:
            case ModelChangeType.TableRowInserted:
            case ModelChangeType.TableRowRemoved:
            case ModelChangeType.TableCellRemoved:
            case ModelChangeType.TableCellInserted:
                return InputPositionEventType.FullReset;
            default:
                return InputPositionEventType.None;
        }
    }
}
