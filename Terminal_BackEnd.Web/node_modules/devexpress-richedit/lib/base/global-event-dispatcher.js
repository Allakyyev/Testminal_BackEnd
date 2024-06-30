import { ModelChangeType } from '../core/model/changes/enums';
import { RichUtils } from '../core/model/rich-utils';
import { SubDocument } from '../core/model/sub-document';
import { BatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ContentInsertedSubDocumentChange } from '../core/model/changes/change-base';
var PublicApiEventType;
(function (PublicApiEventType) {
    PublicApiEventType[PublicApiEventType["None"] = 0] = "None";
    PublicApiEventType[PublicApiEventType["DocumentLoaded"] = 1] = "DocumentLoaded";
    PublicApiEventType[PublicApiEventType["ModelChanged"] = 2] = "ModelChanged";
    PublicApiEventType[PublicApiEventType["SelectionChanged"] = 3] = "SelectionChanged";
    PublicApiEventType[PublicApiEventType["DocumentFormatted"] = 4] = "DocumentFormatted";
})(PublicApiEventType || (PublicApiEventType = {}));
class PublicEvent {
    constructor(type, action, change) {
        this.type = type;
        this.action = action;
        this.change = change;
    }
}
export class GlobalEventDispatcher extends BatchUpdatableObject {
    constructor(rich, onModelChanged) {
        super();
        this.deferredEvents = [];
        this.locked = false;
        this.rich = rich;
        this.onModelChanged = onModelChanged;
    }
    addDeferredEvent(e, change, type = PublicApiEventType.None) {
        if (!this.rich.commandManager.isPublicApiCall || this.rich.modelManager.richOptions.control.raiseClientEventsOnModificationsViaAPI) {
            this.deferredEvents.push(new PublicEvent(type, e, change));
            this.handleDeferredEvents();
        }
    }
    isCharacterPropertiesChangedType(type) {
        return type == ModelChangeType.CharacterPropertiesChanged || type == ModelChangeType.CharacterFormattingChanged;
    }
    equals(source, target) {
        if (!source || !target)
            return false;
        if (this.isCharacterPropertiesChangedType(source.type) && this.isCharacterPropertiesChangedType(target.type)) {
            const sourceChange = source;
            const targetChange = target;
            return sourceChange.subDocumentId == targetChange.subDocumentId && sourceChange.newState.interval.equals(targetChange.newState.interval);
        }
        return false;
    }
    handleDeferredEvents() {
        if (!this.isLocked() && (!this.rich.commandManager.isPublicApiCall || this.rich.modelManager.richOptions.control.raiseClientEventsOnModificationsViaAPI)) {
            const singleEvents = [];
            const occuredFormattingEvents = [];
            let prevInsertingEvent = null;
            this.deferredEvents = ListUtils.reducedMap(this.deferredEvents, (e) => {
                if (e.type == PublicApiEventType.None) {
                    const change = e.change;
                    if (change) {
                        if (this.isCharacterPropertiesChangedType(change.type)) {
                            if (ListUtils.indexBy(occuredFormattingEvents, (oe) => this.equals(oe.change, e.change)) < 0)
                                occuredFormattingEvents.push(e);
                            else
                                return null;
                        }
                        if (change instanceof ContentInsertedSubDocumentChange) {
                            if (this.tryAppendInsertingEvent(prevInsertingEvent, change))
                                return null;
                            else
                                prevInsertingEvent = e;
                        }
                    }
                    return e;
                }
                singleEvents.push(e);
                return null;
            });
            ListUtils.addListOnTail(this.deferredEvents, ListUtils.unique(singleEvents, (a, b) => {
                return a.type - b.type;
            }));
            if (!this.locked) {
                this.locked = true;
                for (let action; action = this.deferredEvents.shift();)
                    action.action();
                this.locked = false;
            }
        }
    }
    tryAppendInsertingEvent(prevEvent, modelChange) {
        if (prevEvent) {
            const prevChange = prevEvent.change;
            if (prevChange.canContinuesWith(modelChange)) {
                prevChange.length += modelChange.length;
                prevEvent.action = () => this.rich.clientSideEvents.raiseContentInserted(prevChange.subDocumentId, new FixedInterval(prevChange.position, prevChange.length));
                return true;
            }
        }
        return false;
    }
    onUpdateUnlocked(_occurredEvents) {
        this.handleDeferredEvents();
    }
    processModelChanged() {
        this.addDeferredEvent(() => this.onModelChanged(), null, PublicApiEventType.ModelChanged);
    }
    NotifyDocumentLoaded() {
        this.addDeferredEvent(() => this.rich.clientSideEvents.raiseDocumentLoaded(), null, PublicApiEventType.DocumentLoaded);
    }
    NotifyPagesReady(_pageChanges) { }
    NotifyFullyFormatted(pageCount) {
        this.addDeferredEvent(() => this.rich.clientSideEvents.raiseDocumentFormatted(pageCount), null, PublicApiEventType.DocumentFormatted);
    }
    NotifySelectionChanged(selection) {
        if (selection.prevState.intervalsInfo.subDocument != selection.currState.intervalsInfo.subDocument)
            this.addDeferredEvent(() => this.rich.clientSideEvents.raiseActiveSubDocumentChanged(), null, PublicApiEventType.SelectionChanged);
        this.addDeferredEvent(() => this.rich.clientSideEvents.raiseSelectionChanged(), null, PublicApiEventType.SelectionChanged);
    }
    NotifyScrollPositionChanged() { }
    modelChanged(change) {
        switch (change.type) {
            case ModelChangeType.PageColor:
            case ModelChangeType.DefaultTabWidth:
            case ModelChangeType.DifferentOddAndEvenPages:
            case ModelChangeType.HeaderFooterIndexChanged:
            case ModelChangeType.SectionFormattingChanged:
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
            case ModelChangeType.AnchoredPictureSizeChanged:
            case ModelChangeType.InlineObjectRunPropertyChanged:
            case ModelChangeType.FieldInserted:
            case ModelChangeType.FieldDeleted:
            case ModelChangeType.HyperlinkInfoChanged:
            case ModelChangeType.FieldsShowCodeChanged:
            case ModelChangeType.TextBufferChanged:
            case ModelChangeType.ParagraphAndCharacterMergedPropertiesReset:
            case ModelChangeType.AnchoredTextBoxSizeChanged:
            case ModelChangeType.AnchoredTextBoxPropertiesChanged:
            case ModelChangeType.AnchorInfoPropertyChanged:
            case ModelChangeType.ShapeChanged:
            case ModelChangeType.ShapePropertyChanged:
            case ModelChangeType.CreateStyleLink:
            case ModelChangeType.DeleteStyleLink:
            case ModelChangeType.CharacterStyleApplied:
            case ModelChangeType.ParagraphStyleApplied:
            case ModelChangeType.TableStyleChanged:
            case ModelChangeType.ParagraphNumberingListChanged:
            case ModelChangeType.TableCreated:
            case ModelChangeType.TableStartPositionShifted:
            case ModelChangeType.TableCellPropertyChanged:
            case ModelChangeType.TablePropertyChanged:
            case ModelChangeType.TableRowPropertyChanged:
            case ModelChangeType.TableCellSplittedHorizontally:
            case ModelChangeType.TableCellMergedHorizontally:
            case ModelChangeType.TableRowInserted:
            case ModelChangeType.TableRowRemoved:
            case ModelChangeType.TableCellRemoved:
            case ModelChangeType.TableCellInserted: {
                this.processModelChanged();
                break;
            }
            case ModelChangeType.SectionMerged: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseContentRemoved(SubDocument.MAIN_SUBDOCUMENT_ID, change.removedInterval, RichUtils.specialCharacters.SectionMark), change);
                break;
            }
            case ModelChangeType.ParagraphMerged: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseContentRemoved(change.subDocumentId, change.removedInterval, RichUtils.specialCharacters.ParagraphMark), change);
                break;
            }
            case ModelChangeType.HeaderFooterCreated:
            case ModelChangeType.InlinePictureInserted:
            case ModelChangeType.AnchoredPictureInserted:
            case ModelChangeType.ParagraphInserted:
            case ModelChangeType.SectionInserted:
            case ModelChangeType.AnchoredTextBoxInserted: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseContentInserted(change.subDocumentId, new FixedInterval(change.position, 1)), change);
                break;
            }
            case ModelChangeType.SimpleRunInserted: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseContentInserted(change.subDocumentId, new FixedInterval(change.position, change.length)), change);
                break;
            }
            case ModelChangeType.AnchorObjectRemoved: {
                break;
            }
            case ModelChangeType.IntervalRemoved: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseContentRemoved(change.subDocumentId, change.interval, change.removedText), change);
                break;
            }
            case ModelChangeType.CharacterFormattingChanged: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseCharacterPropertiesChanged(change.subDocumentId, change.newState.interval), change);
                break;
            }
            case ModelChangeType.CharacterPropertiesChanged: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseCharacterPropertiesChanged(change.subDocumentId, change.newState.interval), change);
                break;
            }
            case ModelChangeType.ParagraphFormattingChanged: {
                this.processModelChanged();
                const paragraphIndexs = this.rich.modelManager.model.subDocuments[change.subDocumentId].getParagraphsIndices(change.newState.interval);
                for (let i = paragraphIndexs.start; i < paragraphIndexs.end; i++) {
                    const parInd = i;
                    this.addDeferredEvent(() => this.rich.clientSideEvents.raiseParagraphPropertiesChanged(change.subDocumentId, parInd), change);
                }
                break;
            }
            case ModelChangeType.ParagraphPropertiesChanged: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseParagraphPropertiesChanged(change.subDocumentId, change.paragraphIndex), change);
                break;
            }
            case ModelChangeType.TableRemoved: {
                this.processModelChanged();
                this.addDeferredEvent(() => this.rich.clientSideEvents.raiseContentRemoved(change.subDocumentId, FixedInterval.fromPositions(change.startPosition, change.endPosition), change.removedText), change);
                break;
            }
            case ModelChangeType.DocumentProtectionChanged: {
                this.processModelChanged();
                break;
            }
            case ModelChangeType.RangePermissionsChanged: {
                this.processModelChanged();
                break;
            }
            case ModelChangeType.RangePermissionsPropertiesChanged: {
                this.processModelChanged();
                break;
            }
        }
    }
}
