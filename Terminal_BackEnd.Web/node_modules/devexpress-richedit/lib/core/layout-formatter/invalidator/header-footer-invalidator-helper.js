import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { LayoutPageFlags } from '../../layout/main-structures/layout-page';
import { SectionHeadersFooters } from '../../model/section/header-footer';
import { Section } from '../../model/section/section';
export class HeaderFooterInvalidatorHelper {
    constructor(model, layout, headerFooterType) {
        this.model = model;
        this.layout = layout;
        this.headerFooterType = headerFooterType;
    }
    isNoPages() {
        this.startPageIndex = 0;
        this.endPageIndex = 0;
        return this.layout.pages.length == 0;
    }
    initByPageIndex(initPageIndex) {
        if (this.isNoPages())
            return;
        this.initPageIndex = Math.min(initPageIndex, this.layout.pages.length - 1);
        this.initSectionIndex = Section.getPageSectionIndex(this.layout.pages[this.initPageIndex], this.model.sections);
        this.calculatePageIndexes();
    }
    initBySectionIndex(sectionIndex) {
        if (this.isNoPages())
            return;
        this.initSectionIndex = sectionIndex;
        const sectionStartPosition = this.model.sections[this.initSectionIndex].startLogPosition.value;
        this.initPageIndex = SearchUtils.normedInterpolationIndexOf(this.layout.pages, (p) => p.getPosition(), sectionStartPosition);
        this.calculatePageIndexes();
    }
    calculatePageIndexes() {
        this.calcStartPageIndex();
        const moveFunc = (ind) => ++ind;
        this.endPageIndex = this.getPageIndex(this.getSectionIndex(moveFunc) - this.initSectionIndex + 1, moveFunc);
        if (this.endPageIndex <= this.startPageIndex)
            this.endPageIndex = this.startPageIndex + 1;
    }
    calcStartPageIndex() {
        const moveFunc = (ind) => --ind;
        const startSectionIndex = this.getSectionIndex(moveFunc);
        this.startPageIndex = this.getPageIndex(this.initSectionIndex - startSectionIndex + 1, moveFunc);
    }
    getSectionIndex(getNextSectionIndex) {
        const sections = this.model.sections;
        let sectionIndex = this.initSectionIndex;
        for (let section; (section = sections[sectionIndex]) && SectionHeadersFooters.isLinkedToPrevious(section, this.headerFooterType); sectionIndex = getNextSectionIndex(sectionIndex))
            ;
        return Math.max(0, sectionIndex);
    }
    getPageIndex(skipSections, getNextPageIndex) {
        const pages = this.layout.pages;
        let pageIndex = this.initPageIndex;
        for (let page; page = pages[pageIndex]; pageIndex = getNextPageIndex(pageIndex)) {
            if (page.flags.get(LayoutPageFlags.IsFirstPageOfSection)) {
                if (skipSections > 0)
                    skipSections--;
                else
                    break;
            }
        }
        return Math.max(0, pageIndex);
    }
}
