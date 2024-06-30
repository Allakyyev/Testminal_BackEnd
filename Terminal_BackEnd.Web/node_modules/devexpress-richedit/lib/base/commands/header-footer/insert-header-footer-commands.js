import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { ControlOptions } from '../../../core/model/options/control';
import { isNumber } from '@devexpress/utils/lib/utils/common';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters } from '../sub-document/change-active-sub-document-command';
export class InsertHeaderFooterCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    isEnabled() {
        return super.isEnabled() &&
            ControlOptions.isEnabled(this.control.modelManager.richOptions.control.sections) &&
            ControlOptions.isEnabled(this.control.modelManager.richOptions.control.headersFooters) &&
            this.control.innerClientProperties.viewsSettings.isPrintLayoutView &&
            this.selection.activeSubDocument.isMain();
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        if (isNumber(parameter))
            return parameter;
        const subDocument = this.selection.activeSubDocument;
        const cursorPos = LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, this.selection.lastSelectedInterval.start, DocumentLayoutDetailsLevel.Page, new LayoutPositionCreatorConflictFlags().setDefault(this.selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
        return cursorPos.pageIndex;
    }
    executeCore(_state, options) {
        return this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex).execute(this.control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(this.control, options.param, this.isHeader()));
    }
}
export class InsertHeaderCommand extends InsertHeaderFooterCommandBase {
    isHeader() {
        return true;
    }
}
export class InsertFooterCommand extends InsertHeaderFooterCommandBase {
    isHeader() {
        return false;
    }
}
