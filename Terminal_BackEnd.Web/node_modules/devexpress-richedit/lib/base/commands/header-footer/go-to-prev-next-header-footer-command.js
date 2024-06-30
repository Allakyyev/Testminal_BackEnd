import { RichEditClientCommand } from '../client-command';
import { ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters } from '../sub-document/change-active-sub-document-command';
import { HeaderFooterCommandBase } from './header-footer-command-base';
export class GoToNextPrevHeaderFooterCommandBase extends HeaderFooterCommandBase {
    executeCore(_state, _options) {
        const selection = this.selection;
        let pageIndex = this.moveFunction(selection.pageIndex);
        const activeSubDocument = this.selection.activeSubDocument;
        const isHeader = activeSubDocument.isHeader();
        for (let layoutPage; layoutPage = this.control.layoutFormatterManager.forceFormatPage(pageIndex); pageIndex = this.moveFunction(pageIndex)) {
            const pageArea = isHeader ?
                layoutPage.getLayoutOtherPageAreasInfo().headerPageArea :
                layoutPage.getLayoutOtherPageAreasInfo().footerPageArea;
            if (pageArea && pageArea.subDocument != activeSubDocument)
                return this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex)
                    .execute(this.control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(this.control, pageIndex, isHeader));
        }
        return false;
    }
}
export class GoToNextHeaderFooterCommand extends GoToNextPrevHeaderFooterCommandBase {
    moveFunction(pageIndex) {
        return ++pageIndex;
    }
}
export class GoToPreviousHeaderFooterCommand extends GoToNextPrevHeaderFooterCommandBase {
    moveFunction(pageIndex) {
        return --pageIndex;
    }
}
