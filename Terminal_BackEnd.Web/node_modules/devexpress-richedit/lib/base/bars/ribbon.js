import { ModelChangeType } from '../../core/model/changes/enums';
import { Flag } from '@devexpress/utils/lib/class/flag';
import { RichEditClientCommand } from '../commands/client-command';
import { BarBase } from './base';
export var RibbonEventType;
(function (RibbonEventType) {
    RibbonEventType[RibbonEventType["None"] = 0] = "None";
    RibbonEventType[RibbonEventType["FullReset"] = 1] = "FullReset";
    RibbonEventType[RibbonEventType["CheckSelectionChange"] = 2] = "CheckSelectionChange";
    RibbonEventType[RibbonEventType["ActivateHeaderFooter"] = 4] = "ActivateHeaderFooter";
})(RibbonEventType || (RibbonEventType = {}));
export class RibbonBarBase extends BarBase {
    constructor() {
        super(...arguments);
        this.selection = null;
    }
    updateContextItem(commandKey) {
        const command = this.core.commandManager.getCommand(commandKey);
        if (command)
            this.setContextItemVisible(commandKey, command.getState().visible);
    }
    forceUpdate(queryCommands) {
        if (this.isUpdateLocked())
            this.registerOccurredEvent(RibbonEventType.FullReset);
        else
            this.updateItemsState(queryCommands);
    }
    checkActivateHeaderFooter(selection) {
        return selection.prevState.intervalsInfo.subDocument != selection.currState.intervalsInfo.subDocument &&
            selection.currState.intervalsInfo.subDocument.isHeaderFooter();
    }
    activateHeaderFooter() {
        this.setContextItemVisible(RichEditClientCommand.ContextItem_HeadersFooters, true);
        this.activateContextItem(RichEditClientCommand.ContextItem_HeadersFooters);
    }
    onUpdateUnlocked(occurredEvents) {
        this.applyEvent(occurredEvents);
    }
    modelChanged(change) {
        const occurredEvents = this.getModelChangeEvent(change);
        if (this.isUpdateLocked())
            this.registerOccurredEvent(occurredEvents);
        else
            this.applyEvent(occurredEvents);
    }
    NotifySelectionChanged(selection) {
        this.selection = selection;
        if (this.isUpdateLocked())
            this.registerOccurredEvent(RibbonEventType.CheckSelectionChange);
        else
            this.applyEvent(this.getSelectionChangeEvent());
    }
    applyEvent(occurredEvents) {
        if (!this.updateEnabled)
            return;
        const flag = new Flag(occurredEvents);
        if (flag.get(RibbonEventType.CheckSelectionChange))
            flag.add(this.getSelectionChangeEvent());
        if (flag.get(RibbonEventType.ActivateHeaderFooter))
            this.activateHeaderFooter();
        if (flag.get(RibbonEventType.FullReset))
            this.updateItemsState();
    }
    getSelectionChangeEvent() {
        const flag = new Flag(RibbonEventType.None);
        if (!this.selection || this.selection.shouldResetInputPosition())
            flag.set(RibbonEventType.FullReset, true);
        if (this.selection && this.checkActivateHeaderFooter(this.selection)) {
            flag.set(RibbonEventType.ActivateHeaderFooter, true);
            flag.set(RibbonEventType.FullReset, true);
        }
        return flag.getValue();
    }
    getModelChangeEvent(change) {
        switch (change.type) {
            case ModelChangeType.DifferentOddAndEvenPages:
            case ModelChangeType.PageColor:
            case ModelChangeType.DefaultTabWidth:
            case ModelChangeType.HeaderFooterCreated:
            case ModelChangeType.HeaderFooterIndexChanged:
                return RibbonEventType.None;
            case ModelChangeType.LoadFontInfo:
                return RibbonEventType.FullReset;
            case ModelChangeType.SectionFormattingChanged:
                return RibbonEventType.FullReset;
            case ModelChangeType.CreateStyleLink:
            case ModelChangeType.DeleteStyleLink:
                return RibbonEventType.None;
            case ModelChangeType.AbstractNumberingListAdded:
            case ModelChangeType.AbstractNumberingListDeleted:
            case ModelChangeType.NumberingListAdded:
            case ModelChangeType.NumberingListDeleted:
            case ModelChangeType.ListLevelPropertyChanged:
            case ModelChangeType.ListLevelParagraphPropertyChanged:
            case ModelChangeType.ListLevelCharacterPropertyChanged:
            case ModelChangeType.IOverrideListLevelChanged:
                return RibbonEventType.None;
            case ModelChangeType.BookmarkCreated:
            case ModelChangeType.BookmarkDeleted:
                return RibbonEventType.None;
            case ModelChangeType.TabInserted:
            case ModelChangeType.TabDeleted:
                return RibbonEventType.None;
            case ModelChangeType.LoadPicturesInfo:
            case ModelChangeType.InlinePicturesUpdated:
            case ModelChangeType.InlinePictureInserted:
            case ModelChangeType.AnchoredPictureInserted:
            case ModelChangeType.AnchoredPictureSizeChanged:
            case ModelChangeType.InlineObjectRunPropertyChanged:
                return RibbonEventType.FullReset;
            case ModelChangeType.FieldInserted:
            case ModelChangeType.FieldDeleted:
            case ModelChangeType.HyperlinkInfoChanged:
            case ModelChangeType.FieldsShowCodeChanged:
                return RibbonEventType.None;
            case ModelChangeType.SimpleRunInserted:
            case ModelChangeType.TextBufferChanged:
            case ModelChangeType.ParagraphInserted:
            case ModelChangeType.SectionInserted:
            case ModelChangeType.AnchoredTextBoxInserted:
            case ModelChangeType.AnchorObjectRemoved:
            case ModelChangeType.IntervalRemoved:
            case ModelChangeType.ParagraphMerged:
            case ModelChangeType.SectionMerged:
                return RibbonEventType.FullReset;
            case ModelChangeType.CharacterFormattingChanged:
            case ModelChangeType.CharacterPropertiesChanged:
            case ModelChangeType.ParagraphFormattingChanged:
            case ModelChangeType.ParagraphPropertiesChanged:
            case ModelChangeType.ParagraphAndCharacterMergedPropertiesReset:
            case ModelChangeType.AnchoredTextBoxSizeChanged:
            case ModelChangeType.AnchoredTextBoxPropertiesChanged:
            case ModelChangeType.AnchorInfoPropertyChanged:
            case ModelChangeType.ShapeChanged:
            case ModelChangeType.ShapePropertyChanged:
            case ModelChangeType.CharacterStyleApplied:
            case ModelChangeType.ParagraphStyleApplied:
            case ModelChangeType.TableStyleChanged:
            case ModelChangeType.ParagraphNumberingListChanged:
                return RibbonEventType.FullReset;
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
                return RibbonEventType.FullReset;
            default:
                return RibbonEventType.None;
        }
    }
}
