import { RichEditClientCommand } from '../client-command';
import { ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters } from '../sub-document/change-active-sub-document-command';
import { HeaderFooterCommandBase } from './header-footer-command-base';
export class GoToHeaderFooterCommandBase extends HeaderFooterCommandBase {
    executeCore(_state, _options) {
        return this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex)
            .execute(this.control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(this.control, this.selection.pageIndex, this.selection.activeSubDocument.isFooter()));
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class GoToHeaderCommand extends GoToHeaderFooterCommandBase {
    isEnabled() {
        return super.isEnabled() && this.selection.activeSubDocument.isFooter();
    }
}
export class GoToFooterCommand extends GoToHeaderFooterCommandBase {
    isEnabled() {
        return super.isEnabled() && this.selection.activeSubDocument.isHeader();
    }
}
