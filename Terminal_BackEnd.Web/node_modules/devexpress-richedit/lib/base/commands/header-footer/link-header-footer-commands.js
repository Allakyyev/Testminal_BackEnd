import { LayoutPageFlags } from '../../../core/layout/main-structures/layout-page';
import { ChangeFooterIndexHistoryItem, ChangeHeaderIndexHistoryItem } from '../../../core/model/history/items/header-footer-history-items';
import { RangeCopy } from '../../../core/model/manipulators/range/create-range-copy-operation';
import { SectionHeadersFooters } from '../../../core/model/section/header-footer';
import { Section } from '../../../core/model/section/section';
import { SubDocumentInterval, SubDocumentIntervals, SubDocumentPosition } from '../../../core/model/sub-document';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isEven } from '@devexpress/utils/lib/utils/common';
import { RichEditClientCommand } from '../client-command';
import { ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters } from '../sub-document/change-active-sub-document-command';
import { HeaderFooterCommandBase } from './header-footer-command-base';
export class LinkHeaderFooterToPreviousCommand extends HeaderFooterCommandBase {
    isEnabled() {
        if (!super.isEnabled())
            return false;
        const page = this.control.layoutFormatterManager.forceFormatPage(this.selection.pageIndex);
        return page && Section.getPageSectionIndex(page, this.control.modelManager.model.sections) > 0;
    }
    getValue() {
        if (!this.isEnabled())
            return null;
        this.isHeader = this.selection.activeSubDocument.isHeader();
        const pageIndex = this.selection.pageIndex;
        const layoutPage = this.control.layoutFormatterManager.forceFormatPage(pageIndex);
        const sections = this.control.modelManager.model.sections;
        const sectionIndex = Section.getPageSectionIndex(layoutPage, sections);
        const headerFooterType = SectionHeadersFooters.getActualObjectType(sections[sectionIndex], layoutPage.flags.get(LayoutPageFlags.IsFirstPageOfSection), isEven(layoutPage.layoutPageIndex));
        return HeaderFooterCommandBase.getSectionHeadersFooters(this.isHeader, sections[sectionIndex]).isLinkedToPrevious(headerFooterType);
    }
    executeCore(state, _options) {
        const layoutPage = this.control.layoutFormatterManager.forceFormatPage(this.selection.pageIndex);
        const sectionIndex = Section.getPageSectionIndex(layoutPage, this.control.modelManager.model.sections);
        const type = this.selection.activeSubDocument.info.headerFooterType;
        this.history.beginTransaction();
        if (state.value)
            this.unlinkFromPrevious(sectionIndex, type);
        else
            this.linkToPrevious(sectionIndex, type);
        this.history.endTransaction();
        return true;
    }
    linkToPrevious(sectionIndex, type) {
        let section = this.control.modelManager.model.sections[sectionIndex];
        this.performLinkSectionToPrevious(sectionIndex, type, (previousSectionIndex) => {
            let previousSection = section.documentModel.sections[previousSectionIndex];
            let prevObjectIndex = HeaderFooterCommandBase.getSectionHeadersFooters(this.isHeader, previousSection).getObjectIndex(type);
            if (prevObjectIndex === -1) {
                prevObjectIndex = this.control.modelManager.modelManipulator.header.getHeaderFooterManipulator(this.isHeader).createObject(type);
                this.history.addAndRedo(this.createChangeObjectIndexHistoryItem(previousSectionIndex, type, prevObjectIndex));
            }
            this.history.addAndRedo(this.createChangeObjectIndexHistoryItem(sectionIndex, type, prevObjectIndex));
            if (!this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex)
                .execute(this.control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(this.control, this.selection.pageIndex, this.isHeader)))
                this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterBySubDocument)
                    .execute(this.control.commandManager.isPublicApiCall, HeaderFooterCommandBase.getObjectsCache(this.isHeader, this.control)[prevObjectIndex].getSubDocument(this.control.modelManager.model));
        });
    }
    unlinkFromPrevious(sectionIndex, type) {
        let section = this.control.modelManager.model.sections[sectionIndex];
        this.performLinkSectionToPrevious(sectionIndex, type, (previousSectionIndex) => {
            let previousSection = section.documentModel.sections[previousSectionIndex];
            let previousObject = HeaderFooterCommandBase.getSectionHeadersFooters(this.isHeader, previousSection).getObject(type);
            let endPosition = previousObject.getEndPosition(section.documentModel);
            let previousObjectCopyInfo = endPosition > 1 ?
                RangeCopy.create(new SubDocumentIntervals(previousObject.getSubDocument(section.documentModel), [new FixedInterval(0, endPosition - 1)])) :
                null;
            let newObjectIndex = this.control.modelManager.modelManipulator.header.getHeaderFooterManipulator(this.isHeader).createObject(type);
            let newObject = HeaderFooterCommandBase.getObjectsCache(this.isHeader, this.control)[newObjectIndex];
            let newObjectSubDocument = newObject.getSubDocument(this.control.modelManager.model);
            this.history.addAndRedo(this.createChangeObjectIndexHistoryItem(sectionIndex, type, newObjectIndex));
            if (previousObjectCopyInfo) {
                this.history.beginTransaction();
                this.modelManipulator.range.removeInterval(new SubDocumentInterval(newObjectSubDocument, FixedInterval.fromPositions(0, newObjectSubDocument.getDocumentEndPosition())), true, true);
                previousObjectCopyInfo.insertTo(this.modelManipulator, new SubDocumentPosition(newObjectSubDocument, 0));
                this.history.endTransaction();
            }
            if (!this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex).execute(this.control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(this.control, this.selection.pageIndex, this.isHeader)))
                this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterBySubDocument).execute(this.control.commandManager.isPublicApiCall, newObject.getSubDocument(this.control.modelManager.model));
        });
    }
    performLinkSectionToPrevious(sectionIndex, type, linkAction) {
        let nextSection = this.control.modelManager.model.sections[sectionIndex + 1];
        let section = this.control.modelManager.model.sections[sectionIndex];
        let shouldRelinkNextSection = nextSection && this.areSectionsLinked(section, nextSection, type);
        linkAction(sectionIndex - 1);
        if (shouldRelinkNextSection)
            this.linkToPrevious(sectionIndex + 1, type);
    }
    areSectionsLinked(section1, section2, type) {
        return HeaderFooterCommandBase.getSectionHeadersFooters(this.isHeader, section2).getObject(type) ===
            HeaderFooterCommandBase.getSectionHeadersFooters(this.isHeader, section1).getObject(type);
    }
    createChangeObjectIndexHistoryItem(sectionIndex, type, newIndex) {
        return new (this.isHeader ? ChangeHeaderIndexHistoryItem : ChangeFooterIndexHistoryItem)(this.modelManipulator, sectionIndex, type, newIndex, (oldIndex) => {
            if (this.control.selection.activeSubDocument.isHeaderFooter() && oldIndex == -1)
                this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain)
                    .execute(this.control.commandManager.isPublicApiCall);
        });
    }
}
