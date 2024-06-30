import { ModelChangeType } from '../../../core/model/changes/enums';
import { BatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { Flag } from '@devexpress/utils/lib/class/flag';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export var UiEventType;
(function (UiEventType) {
    UiEventType[UiEventType["None"] = 0] = "None";
    UiEventType[UiEventType["FullReset"] = 1] = "FullReset";
    UiEventType[UiEventType["CheckSelectionChange"] = 2] = "CheckSelectionChange";
    UiEventType[UiEventType["PartialReset"] = 4] = "PartialReset";
})(UiEventType || (UiEventType = {}));
export class ClientPublicUiChangesListener extends BatchUpdatableObject {
    constructor(_raiseUpdate) {
        super();
        this._raiseUpdate = _raiseUpdate;
        this.selection = null;
        this.updateEnabled = true;
        this._occuredEvents = new Flag(UiEventType.None);
    }
    onUpdateUnlocked() {
        this.applyEvents();
    }
    modelChanged(change) {
        this._occuredEvents.add(this.getModelChangeEvent(change));
        if (!this.isUpdateLocked())
            this.applyEvents();
    }
    NotifySelectionChanged(selection) {
        this.selection = selection;
        if (this.isUpdateLocked()) {
            this._occuredEvents.set(UiEventType.CheckSelectionChange, true);
        }
        else {
            this._occuredEvents.add(this.getSelectionChangeEvent());
            this.applyEvents();
        }
    }
    forceUpdate(queryCommands) {
        this.addCommands(queryCommands);
        if (!this.isUpdateLocked())
            this.applyEvents();
    }
    getModelChangeEvent(change) {
        switch (change.type) {
            case ModelChangeType.DifferentOddAndEvenPages:
            case ModelChangeType.PageColor:
            case ModelChangeType.DefaultTabWidth:
            case ModelChangeType.HeaderFooterCreated:
            case ModelChangeType.HeaderFooterIndexChanged:
                return UiEventType.None;
            case ModelChangeType.LoadFontInfo:
                return UiEventType.FullReset;
            case ModelChangeType.CreateStyleLink:
            case ModelChangeType.DeleteStyleLink:
                return UiEventType.None;
            case ModelChangeType.AbstractNumberingListAdded:
            case ModelChangeType.AbstractNumberingListDeleted:
            case ModelChangeType.NumberingListAdded:
            case ModelChangeType.NumberingListDeleted:
            case ModelChangeType.ListLevelPropertyChanged:
            case ModelChangeType.ListLevelParagraphPropertyChanged:
            case ModelChangeType.ListLevelCharacterPropertyChanged:
            case ModelChangeType.IOverrideListLevelChanged:
                return UiEventType.None;
            case ModelChangeType.BookmarkCreated:
            case ModelChangeType.BookmarkDeleted:
                return UiEventType.None;
            case ModelChangeType.TabInserted:
            case ModelChangeType.TabDeleted:
                return UiEventType.None;
            case ModelChangeType.LoadPicturesInfo:
            case ModelChangeType.InlinePicturesUpdated:
            case ModelChangeType.InlinePictureInserted:
            case ModelChangeType.AnchoredPictureInserted:
            case ModelChangeType.AnchoredPictureSizeChanged:
            case ModelChangeType.InlineObjectRunPropertyChanged:
                return UiEventType.None;
            case ModelChangeType.FieldInserted:
            case ModelChangeType.FieldDeleted:
            case ModelChangeType.HyperlinkInfoChanged:
            case ModelChangeType.FieldsShowCodeChanged:
                return UiEventType.None;
            case ModelChangeType.SimpleRunInserted:
            case ModelChangeType.TextBufferChanged:
            case ModelChangeType.ParagraphInserted:
            case ModelChangeType.SectionInserted:
            case ModelChangeType.AnchoredTextBoxInserted:
            case ModelChangeType.AnchorObjectRemoved:
            case ModelChangeType.IntervalRemoved:
            case ModelChangeType.ParagraphMerged:
            case ModelChangeType.SectionMerged:
                return UiEventType.FullReset;
            case ModelChangeType.CharacterFormattingChanged:
            case ModelChangeType.CharacterPropertiesChanged:
            case ModelChangeType.ParagraphFormattingChanged:
            case ModelChangeType.ParagraphPropertiesChanged:
            case ModelChangeType.ParagraphAndCharacterMergedPropertiesReset:
            case ModelChangeType.SectionFormattingChanged:
                return UiEventType.FullReset;
            case ModelChangeType.AnchoredTextBoxSizeChanged:
            case ModelChangeType.AnchoredTextBoxPropertiesChanged:
            case ModelChangeType.AnchorInfoPropertyChanged:
            case ModelChangeType.ShapeChanged:
            case ModelChangeType.ShapePropertyChanged:
                return UiEventType.None;
            case ModelChangeType.CharacterStyleApplied:
            case ModelChangeType.ParagraphStyleApplied:
            case ModelChangeType.TableStyleChanged:
            case ModelChangeType.ParagraphNumberingListChanged:
                return UiEventType.FullReset;
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
                return UiEventType.FullReset;
            default:
                return UiEventType.None;
        }
    }
    applyEvents() {
        const occuredEvents = this._occuredEvents.clone();
        const queryCommands = this.queryCommands;
        this._occuredEvents = new Flag(UiEventType.None);
        this.queryCommands = undefined;
        if (!this.updateEnabled)
            return;
        if (occuredEvents.get(UiEventType.CheckSelectionChange))
            occuredEvents.add(this.getSelectionChangeEvent());
        if (occuredEvents.get(UiEventType.FullReset))
            this.raiseUpdate(null);
        else if (occuredEvents.get(UiEventType.PartialReset)) {
            const commands = NumberMapUtils.toListBy(queryCommands, (_true, commandId) => commandId);
            this.raiseUpdate(commands.length ? commands : null);
        }
    }
    raiseUpdate(commands) {
        setTimeout(() => this._raiseUpdate(commands), 0);
    }
    getSelectionChangeEvent() {
        const flag = new Flag(UiEventType.None);
        if (!this.selection || this.selection.shouldResetInputPosition())
            flag.set(UiEventType.FullReset, true);
        else if (this.selection && this.checkActivateHeaderFooter(this.selection)) {
            flag.set(UiEventType.FullReset, true);
        }
        return flag.getValue();
    }
    checkActivateHeaderFooter(selection) {
        return selection.prevState.intervalsInfo.subDocument != selection.currState.intervalsInfo.subDocument &&
            selection.currState.intervalsInfo.subDocument.isHeaderFooter();
    }
    addCommands(queryCommands) {
        if (queryCommands) {
            this._occuredEvents.set(UiEventType.PartialReset, true);
            if (!this.queryCommands)
                this.queryCommands = {};
            NumberMapUtils.forEach(queryCommands, (_true, commandId) => this.queryCommands[commandId] = _true);
        }
        else
            this._occuredEvents.set(UiEventType.FullReset, true);
    }
}
