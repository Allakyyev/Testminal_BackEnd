import { ModelChangeType } from '../../core/model/changes/enums';
import { Flag } from '@devexpress/utils/lib/class/flag';
import { BarBase } from './base';
export var ContextMenuEventType;
(function (ContextMenuEventType) {
    ContextMenuEventType[ContextMenuEventType["None"] = 0] = "None";
    ContextMenuEventType[ContextMenuEventType["FullReset"] = 1] = "FullReset";
    ContextMenuEventType[ContextMenuEventType["CheckSelectionChange"] = 2] = "CheckSelectionChange";
})(ContextMenuEventType || (ContextMenuEventType = {}));
export class ContextMenuBarBase extends BarBase {
    constructor() {
        super(...arguments);
        this.selection = null;
        this.isSpellingMenu = false;
    }
    forceUpdate(queryCommands) {
        if (this.isUpdateLocked())
            this.registerOccurredEvent(ContextMenuEventType.FullReset);
        else
            this.updateItemsState(queryCommands);
    }
    getSuggestions() {
        let suggestions = undefined;
        if (this.core.spellChecker.settings.isEnabled) {
            const selectedMisspelledInterval = this.core.spellChecker.getSelectedMisspelledInterval(this.core.selection.intervals);
            if (selectedMisspelledInterval)
                suggestions = selectedMisspelledInterval.errorInfo.suggestions;
        }
        return suggestions;
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
            this.registerOccurredEvent(ContextMenuEventType.CheckSelectionChange);
        else
            this.applyEvent(this.getSelectionChangeEvent());
    }
    applyEvent(occurredEvents) {
        if (!this.updateEnabled)
            return;
        const flag = new Flag(occurredEvents);
        if (flag.get(ContextMenuEventType.CheckSelectionChange))
            flag.add(this.getSelectionChangeEvent());
        if (flag.get(ContextMenuEventType.FullReset))
            this.updateItemsState();
    }
    getSelectionChangeEvent() {
        return this.selection && !this.selection.shouldResetInputPosition() ?
            ContextMenuEventType.None :
            ContextMenuEventType.FullReset;
    }
    getModelChangeEvent(change) {
        switch (change.type) {
            case ModelChangeType.DifferentOddAndEvenPages:
            case ModelChangeType.PageColor:
            case ModelChangeType.DefaultTabWidth:
            case ModelChangeType.HeaderFooterCreated:
            case ModelChangeType.HeaderFooterIndexChanged:
            case ModelChangeType.LoadFontInfo:
            case ModelChangeType.SectionFormattingChanged:
            case ModelChangeType.CreateStyleLink:
            case ModelChangeType.DeleteStyleLink:
            case ModelChangeType.AbstractNumberingListAdded:
            case ModelChangeType.AbstractNumberingListDeleted:
            case ModelChangeType.NumberingListAdded:
            case ModelChangeType.NumberingListDeleted:
            case ModelChangeType.ListLevelPropertyChanged:
            case ModelChangeType.ListLevelParagraphPropertyChanged:
            case ModelChangeType.ListLevelCharacterPropertyChanged:
            case ModelChangeType.IOverrideListLevelChanged:
            case ModelChangeType.BookmarkCreated:
            case ModelChangeType.BookmarkDeleted:
            case ModelChangeType.TabInserted:
            case ModelChangeType.TabDeleted:
            case ModelChangeType.LoadPicturesInfo:
            case ModelChangeType.InlinePicturesUpdated:
            case ModelChangeType.InlinePictureInserted:
            case ModelChangeType.AnchoredPictureInserted:
            case ModelChangeType.AnchoredPictureSizeChanged:
            case ModelChangeType.InlineObjectRunPropertyChanged:
            case ModelChangeType.FieldInserted:
            case ModelChangeType.FieldDeleted:
            case ModelChangeType.HyperlinkInfoChanged:
            case ModelChangeType.FieldsShowCodeChanged:
            case ModelChangeType.SimpleRunInserted:
            case ModelChangeType.TextBufferChanged:
            case ModelChangeType.ParagraphInserted:
            case ModelChangeType.SectionInserted:
            case ModelChangeType.AnchoredTextBoxInserted:
            case ModelChangeType.AnchorObjectRemoved:
            case ModelChangeType.IntervalRemoved:
            case ModelChangeType.ParagraphMerged:
            case ModelChangeType.SectionMerged:
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
            default:
                return ContextMenuEventType.None;
        }
    }
}
