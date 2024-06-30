import { LayoutPageFlags } from '../../../core/layout/main-structures/layout-page';
import { DifferentOddAndEvenPagesHistoryItem } from '../../../core/model/history/items/document-properties-history-items';
import { SectionDifferentFirstPageHistoryItem } from '../../../core/model/history/items/section-properties-history-items';
import { SectionHeadersFooters } from '../../../core/model/section/header-footer';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isEven } from '@devexpress/utils/lib/utils/common';
import { RichEditClientCommand } from '../client-command';
import { ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters } from '../sub-document/change-active-sub-document-command';
import { HeaderFooterCommandBase } from './header-footer-command-base';
export class DifferentFirstPageAndOddEvenHeaderFooterCommandBase extends HeaderFooterCommandBase {
    DEPRECATEDConvertOptionsParameter(parameter) {
        return typeof parameter === 'boolean' ? parameter : !this.getValue();
    }
    executeCore(state, options) {
        const pageIndex = this.selection.pageIndex;
        const sectionIndex = this.getSectionIndex(pageIndex);
        const section = this.control.modelManager.model.sections[sectionIndex];
        const activeSubDoc = this.selection.activeSubDocument;
        const isHeader = activeSubDoc.isHeader();
        const sectionHeadersFooters = HeaderFooterCommandBase.getSectionHeadersFooters(isHeader, section);
        let newValue = options.param;
        if (newValue === state.value)
            return false;
        this.history.beginTransaction();
        const page = this.control.layoutFormatterManager.forceFormatPage(pageIndex);
        const isFirstPageOfSection = page.flags.get(LayoutPageFlags.IsFirstPageOfSection);
        this.changeSectionProperty(section, newValue);
        const headerFooterType = SectionHeadersFooters.getActualObjectType(section, isFirstPageOfSection, isEven(page.layoutPageIndex));
        let info = sectionHeadersFooters.getObject(headerFooterType);
        if (!info) {
            const manipulator = this.control.modelManager.modelManipulator.header.getHeaderFooterManipulator(isHeader);
            manipulator.changeObjectIndex(sectionIndex, headerFooterType, manipulator.createObject(headerFooterType));
            info = sectionHeadersFooters.getObject(headerFooterType);
        }
        if (!this.control.layout.isFullyFormatted)
            this.control.layoutFormatterManager.formatSyncAllDocument();
        if (!this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex).execute(this.control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(this.control, pageIndex, isHeader)))
            this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex).execute(this.control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(this.control, this.control.layout.pages.length - 1, isHeader));
        this.history.endTransaction();
        return true;
    }
}
export class DifferentFirstPageHeaderFooterCommand extends DifferentFirstPageAndOddEvenHeaderFooterCommandBase {
    getValue() {
        return this.control.modelManager.model.sections[this.getSectionIndex(this.selection.pageIndex)].sectionProperties.differentFirstPage;
    }
    changeSectionProperty(section, newValue) {
        this.history.addAndRedo(new SectionDifferentFirstPageHistoryItem(this.modelManipulator, new FixedInterval(section.startLogPosition.value, section.getLength()), newValue));
    }
}
export class DifferentOddEvenHeaderFooterCommand extends DifferentFirstPageAndOddEvenHeaderFooterCommandBase {
    getValue() {
        return this.control.modelManager.model.differentOddAndEvenPages;
    }
    changeSectionProperty(_section, newValue) {
        this.history.addAndRedo(new DifferentOddAndEvenPagesHistoryItem(this.modelManipulator, newValue));
    }
}
