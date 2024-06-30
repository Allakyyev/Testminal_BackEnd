import { formatMessage } from 'devextreme/localization';
import dxContextMenu from 'devextreme/ui/context_menu';
import { ContextMenuBarBase } from '../../base/bars/context-menu';
import { RichEditClientCommand } from '../../base/commands/client-command';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { DxtUtils } from '../../dxt-utils/dxt-utils/dxt-utils';
import { ContextMenuCommandId } from '../public/commands/enum';
import { cloneContextMenuItem, ContextMenuItem } from '../public/context-menu/item';
import { SimpleContextMenu } from '../public/context-menu/menu';
import { ContextMenuShowingEventArgs } from '../public/events';
export class ClientContextMenuBar extends ContextMenuBarBase {
    constructor(ownerControl, ownerElement, initialItems) {
        super(ownerControl);
        this.ownerElement = ownerElement;
        this.createControl(initialItems);
    }
    onCanvasMouseDown() {
        this.menu.hide();
    }
    dispose() {
        this.menu.dispose();
        DomUtils.hideNode(this.targetElement);
        clearTimeout(this.menuShowTimerId);
    }
    static getInitialItems() {
        const items = getInitialContextMenuItems();
        DxtUtils.correctItemsIcons(items);
        return items;
    }
    createControl(initialItems) {
        this.initialItems = initialItems !== null && initialItems !== void 0 ? initialItems : ClientContextMenuBar.getInitialItems();
        const parentElement = this.ownerElement.appendChild(document.createElement("div"));
        this.targetElement = this.createTargetElement();
        this.menu = new dxContextMenu(parentElement, {
            dataSource: this.initialItems,
            target: this.targetElement,
            onItemClick: (e) => {
                const itemData = e.itemData;
                const param = itemData && itemData.id == ContextMenuCommandId.ApplySpellingSuggestion ? itemData.text : null;
                this.raiseBarCommandExecuted(itemData.id, param);
            },
            onHidden: () => this.owner.Focus(),
        });
    }
    getCommandKeys() {
        return StringMapUtils.toListBy(this.getItemsCache(), (_val, key) => key);
    }
    setItemEnabled(key, enabled) {
        const itemsCache = this.getItemsCache();
        for (let i = 0, item; item = itemsCache[key][i]; i++)
            item.disabled = !enabled;
    }
    setItemVisible(key, visible) {
        const itemsCache = this.getItemsCache();
        for (let i = 0, item; item = itemsCache[key][i]; i++)
            item.visible = visible;
    }
    setItemValue(_key, _value) { }
    hide() {
        this.menu.hide();
    }
    createTargetElement() {
        const targetElement = document.createElement("div");
        targetElement.className = 'dxrePopupTarget';
        document.body.appendChild(targetElement);
        return targetElement;
    }
    getItemsCache() {
        if (!this.cache) {
            this.cache = {};
            this.fillCache(this.initialItems);
        }
        return this.cache;
    }
    fillCache(items) {
        for (const item of items) {
            const key = item.id;
            if (key && RichEditClientCommand[key] !== undefined) {
                let cache = this.cache[key];
                if (!cache)
                    cache = this.cache[key] = [];
                cache.push(item);
            }
            if (item.items)
                this.fillCache(item.items);
        }
    }
    show(getPoint) {
        var _a;
        const items = ListUtils.shallowCopy(this.initialItems);
        this.isSpellingMenu = this.addSuggestionItems(items);
        this.cache = undefined;
        const commandKeys = this.getCommandKeys();
        for (const commandKey of commandKeys)
            this.updateBarItem(commandKey);
        const richEditOwner = this.owner;
        const simpleContextMenu = new SimpleContextMenu(true, () => ListUtils.map(items, item => cloneContextMenuItem(item)));
        const args = new ContextMenuShowingEventArgs(simpleContextMenu);
        richEditOwner.raiseContextMenuShowing(args);
        if (richEditOwner.contextMenuSettings.enabled && args.contextMenu.enabled) {
            const point = getPoint(this);
            this.menu.option("dataSource", (_a = simpleContextMenu._items) !== null && _a !== void 0 ? _a : items);
            this.menuShowTimerId = setTimeout(() => {
                this.menu.option("position.offset", { x: point.x, y: point.y });
                this.menu.show();
            }, 10);
        }
    }
    addSuggestionItems(items) {
        const suggestions = this.getSuggestions();
        if (suggestions === null || suggestions === undefined)
            return false;
        if (suggestions.length > 0) {
            ListUtils.reverseForEach(suggestions, suggestion => {
                items.unshift(new ContextMenuItem(ContextMenuCommandId.ApplySpellingSuggestion, {
                    text: suggestion,
                    icon: undefined,
                    beginGroup: false
                }));
            });
        }
        else
            items.unshift(new ContextMenuItem(ContextMenuCommandId.NoSpellingSuggestions, {
                text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeMistakenWord'),
                icon: undefined,
                beginGroup: false,
                disabled: true
            }));
        return true;
    }
}
function getInitialContextMenuItems() {
    return [
        new ContextMenuItem(ContextMenuCommandId.IgnoreSpellingError, { text: formatMessage('XtraRichEditStringId.MenuCmd_IgnoreMistakenWord'), beginGroup: true }),
        new ContextMenuItem(ContextMenuCommandId.IgnoreAllSpellingErrors, { text: formatMessage('XtraRichEditStringId.MenuCmd_IgnoreAllMistakenWords'), beginGroup: false }),
        new ContextMenuItem(ContextMenuCommandId.AddWordToDictionary, { text: formatMessage('ASPxRichEditStringId.Spelling_AddToDictionary'), beginGroup: false }),
        new ContextMenuItem(ContextMenuCommandId.OpenHyperlink, { text: formatMessage('ASPxRichEditStringId.OpenHyperlink'), icon: 'dxre-icon-Select', beginGroup: true }),
        new ContextMenuItem(ContextMenuCommandId.ShowEditHyperlinkDialog, { text: formatMessage('ASPxRichEditStringId.EditHyperlink'), icon: 'dxre-icon-Hyperlink' }),
        new ContextMenuItem(ContextMenuCommandId.RemoveHyperlink, { text: formatMessage('ASPxRichEditStringId.RemoveHyperlink'), icon: 'dxre-icon-DeleteHyperlink' }),
        new ContextMenuItem(ContextMenuCommandId.UpdateField, { text: formatMessage('ASPxRichEditStringId.UpdateField'), icon: 'dxre-icon-UpdateField', beginGroup: true }),
        new ContextMenuItem(ContextMenuCommandId.ToggleFieldCodes, { text: formatMessage('ASPxRichEditStringId.ToggleFieldCodes'), icon: 'dxre-icon-ToggleFieldCodes' }),
        new ContextMenuItem(ContextMenuCommandId.RestartNumberedList, { text: formatMessage('ASPxRichEditStringId.RestartNumbering'), icon: 'dxre-icon-RestartNumbering', beginGroup: true }),
        new ContextMenuItem(ContextMenuCommandId.ContinueNumberedList, { text: formatMessage('ASPxRichEditStringId.ContinueNumbering'), icon: 'dxre-icon-ContinueNumbering', beginGroup: true }),
        new ContextMenuItem(ContextMenuCommandId.Cut, { text: formatMessage('XtraRichEditStringId.MenuCmd_CutSelection'), beginGroup: true, icon: 'dxre-icon-Cut' }),
        new ContextMenuItem(ContextMenuCommandId.Copy, { text: formatMessage('XtraRichEditStringId.MenuCmd_CopySelection'), icon: 'dxre-icon-Copy' }),
        new ContextMenuItem(ContextMenuCommandId.Paste, { text: formatMessage('XtraRichEditStringId.MenuCmd_Paste'), icon: 'dxre-icon-Paste' }),
        new ContextMenuItem(ContextMenuCommandId.TableMenu, {
            text: formatMessage('ASPxRichEditStringId.InsertButton'), beginGroup: true, icon: 'dxre-icon-InsertTable', items: [
                new ContextMenuItem(ContextMenuCommandId.InsertTableColumnToTheLeft, { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableColumnToTheLeft'), icon: 'dxre-icon-InsertTableColumnsToTheLeft' }),
                new ContextMenuItem(ContextMenuCommandId.InsertTableColumnToTheRight, { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableColumnToTheRight'), icon: 'dxre-icon-InsertTableColumnsToTheRight' }),
                new ContextMenuItem(ContextMenuCommandId.InsertTableRowAbove, { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableRowAbove'), icon: 'dxre-icon-InsertTableRowsAbove' }),
                new ContextMenuItem(ContextMenuCommandId.InsertTableRowBelow, { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableRowBelow'), icon: 'dxre-icon-InsertTableRowsBelow' }),
                new ContextMenuItem(ContextMenuCommandId.ShowInsertTableCellsDialog, { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableCells'), icon: 'dxre-icon-InsertTableCells' }),
            ]
        }),
        new ContextMenuItem(ContextMenuCommandId.ShowDeleteTableCellsDialog, { text: formatMessage('XtraRichEditStringId.MenuCmd_DeleteTableCells'), icon: 'dxre-icon-DeleteTableCells' }),
        new ContextMenuItem(ContextMenuCommandId.ShowSplitCellsDialog, { text: formatMessage('XtraRichEditStringId.MenuCmd_SplitTableCellsMenuItem'), icon: 'dxre-icon-SplitTableCells' }),
        new ContextMenuItem(ContextMenuCommandId.MergeTableCells, { text: formatMessage('XtraRichEditStringId.MenuCmd_MergeTableCells'), icon: 'dxre-icon-MergeTableCells' }),
        new ContextMenuItem(ContextMenuCommandId.DecreaseParagraphIndent, { text: formatMessage('XtraRichEditStringId.MenuCmd_DecrementIndent'), icon: 'dxre-icon-IndentDecrease', beginGroup: true }),
        new ContextMenuItem(ContextMenuCommandId.IncreaseParagraphIndent, { text: formatMessage('XtraRichEditStringId.MenuCmd_IncrementIndent'), icon: 'dxre-icon-IndentIncrease' }),
        new ContextMenuItem(ContextMenuCommandId.ShowFontDialog, { text: formatMessage('ASPxRichEditStringId.Numbering_Font'), icon: 'dxre-icon-FontColor', beginGroup: true }),
        new ContextMenuItem(ContextMenuCommandId.ShowParagraphDialog, { text: formatMessage('XtraRichEditStringId.MenuCmd_ShowParagraphForm'), icon: 'dxre-icon-Paragraph' }),
        new ContextMenuItem(ContextMenuCommandId.ShowBookmarkDialog, { text: formatMessage('XtraRichEditStringId.MenuCmd_Bookmark'), icon: 'dxre-icon-Bookmark', beginGroup: true }),
        new ContextMenuItem(ContextMenuCommandId.ShowHyperlinkDialog, { text: formatMessage('XtraRichEditStringId.MenuCmd_Hyperlink'), icon: 'dxre-icon-Hyperlink' }),
        new ContextMenuItem(ContextMenuCommandId.ChangeFloatingObjectTextWrapTypeMenu, {
            text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeFloatingObjectTextWrapType'), icon: 'dxre-icon-TextWrapSquare', beginGroup: true, items: [
                new ContextMenuItem(ContextMenuCommandId.SetFloatingObjectInlineTextWrapType, { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectInlineWithTextWrapType'), icon: 'dxre-icon-TextWrapInline' }),
                new ContextMenuItem(ContextMenuCommandId.SetFloatingObjectSquareTextWrapType, { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectSquareTextWrapType'), icon: 'dxre-icon-TextWrapSquare' }),
                new ContextMenuItem(ContextMenuCommandId.SetFloatingObjectTightTextWrapType, { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectTightTextWrapType'), icon: 'dxre-icon-TextWrapTight' }),
                new ContextMenuItem(ContextMenuCommandId.SetFloatingObjectThroughTextWrapType, { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectThroughTextWrapType'), icon: 'dxre-icon-TextWrapThrough' }),
                new ContextMenuItem(ContextMenuCommandId.SetFloatingObjectTopAndBottomTextWrapType, { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectTopAndBottomTextWrapType'), icon: 'dxre-icon-TextWrapTopAndBottom' }),
                new ContextMenuItem(ContextMenuCommandId.SetFloatingObjectBehindTextWrapType, { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectBehindTextWrapType'), icon: 'dxre-icon-TextWrapBehind' }),
                new ContextMenuItem(ContextMenuCommandId.SetFloatingObjectInFrontOfTextWrapType, { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectInFrontOfTextWrapType'), icon: 'dxre-icon-TextWrapInFrontOfText' }),
            ]
        }),
        new ContextMenuItem(ContextMenuCommandId.FloatingObjectBringForwardMenu, {
            text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectBringForwardPlaceholder'), icon: 'dxre-icon-FloatingObjectBringForward', items: [
                new ContextMenuItem(ContextMenuCommandId.FloatingObjectBringForward, { text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectBringForward'), icon: 'dxre-icon-FloatingObjectBringForward' }),
                new ContextMenuItem(ContextMenuCommandId.FloatingObjectBringToFront, { text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectBringToFront'), icon: 'dxre-icon-FloatingObjectBringToFront' }),
                new ContextMenuItem(ContextMenuCommandId.FloatingObjectBringInFrontOfText, { text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectBringInFrontOfText'), icon: 'dxre-icon-FloatingObjectBringInFrontOfText' }),
            ]
        }),
        new ContextMenuItem(ContextMenuCommandId.FloatingObjectSendBackwardMenu, {
            text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectSendBackwardPlaceholder'), icon: 'dxre-icon-FloatingObjectSendBackward', items: [
                new ContextMenuItem(ContextMenuCommandId.FloatingObjectSendBackward, { text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectSendBackward'), icon: 'dxre-icon-FloatingObjectSendBackward' }),
                new ContextMenuItem(ContextMenuCommandId.FloatingObjectSendToBack, { text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectSendToBack'), icon: 'dxre-icon-FloatingObjectSendToBack' }),
                new ContextMenuItem(ContextMenuCommandId.FloatingObjectSendBehindText, { text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectSendBehindText'), icon: 'dxre-icon-FloatingObjectSendBehindText' }),
            ]
        }),
        new ContextMenuItem(ContextMenuCommandId.SelectAll, { text: formatMessage('XtraRichEditStringId.MenuCmd_SelectAll'), icon: 'dxre-icon-SelectAll', beginGroup: true }),
    ];
}
