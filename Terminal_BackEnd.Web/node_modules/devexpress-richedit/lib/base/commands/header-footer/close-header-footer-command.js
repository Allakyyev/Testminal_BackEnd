import { RichEditClientCommand } from '../client-command';
import { HeaderFooterCommandBase } from './header-footer-command-base';
export class CloseHeaderFooterCommand extends HeaderFooterCommandBase {
    executeCore(_state, _options) {
        return this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain)
            .execute(this.control.commandManager.isPublicApiCall);
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
