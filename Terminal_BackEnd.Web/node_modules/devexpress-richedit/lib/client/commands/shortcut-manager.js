import { RichEditClientCommand } from '../../base/commands/client-command';
import { ShortcutManager } from '../../base/commands/shortcut-manager';
import { KeyCode, ModifierKey } from '@devexpress/utils/lib/utils/key';
export class ClientShortcutManager extends ShortcutManager {
    constructor(commandManager, control) {
        super(commandManager, control);
        this.createShortcut(commandManager, RichEditClientCommand.CreateNewDocumentLocally, [ModifierKey.Ctrl | KeyCode.Key_n], [ModifierKey.Meta | KeyCode.Key_n]);
        this.createShortcut(commandManager, RichEditClientCommand.OpenDocumentLocally, [ModifierKey.Ctrl | KeyCode.Key_o, ModifierKey.Ctrl | KeyCode.F12], [ModifierKey.Meta | KeyCode.Key_o]);
        this.createShortcut(commandManager, RichEditClientCommand.ExportDocument, [ModifierKey.Ctrl | KeyCode.Key_s], [ModifierKey.Meta | KeyCode.Key_s]);
        this.createShortcut(commandManager, RichEditClientCommand.PrintDocumentOnClient, [ModifierKey.Ctrl | KeyCode.Key_p], [ModifierKey.Meta | KeyCode.Key_p]);
    }
}
