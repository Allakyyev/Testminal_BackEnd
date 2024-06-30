import { HeaderFooterType } from './enums';
export class SectionHeadersFooters {
    constructor(section) {
        this.indices = {};
        this.section = section;
        this.setObjectIndex(HeaderFooterType.Even, SectionHeadersFooters.INVALID_INDEX);
        this.setObjectIndex(HeaderFooterType.Odd, SectionHeadersFooters.INVALID_INDEX);
        this.setObjectIndex(HeaderFooterType.First, SectionHeadersFooters.INVALID_INDEX);
    }
    getObject(type) {
        let index = this.getObjectIndex(type);
        return this.getObjectsCache()[index];
    }
    getObjectIndex(type) {
        return this.indices[type];
    }
    setObjectIndex(type, objectIndex) {
        this.indices[type] = objectIndex;
    }
    getActualObject(firstPageOfSection, isEvenPage) {
        let type = SectionHeadersFooters.getActualObjectType(this.section, firstPageOfSection, isEvenPage);
        let index = this.getObjectIndex(type);
        return this.getObjectsCache()[index];
    }
    copyFrom(source) {
        this.indices = {};
        this.setObjectIndex(HeaderFooterType.Even, source.getObjectIndex(HeaderFooterType.Even));
        this.setObjectIndex(HeaderFooterType.Odd, source.getObjectIndex(HeaderFooterType.Odd));
        this.setObjectIndex(HeaderFooterType.First, source.getObjectIndex(HeaderFooterType.First));
    }
    isLinkedToPrevious(type) {
        const previousSection = this.section.documentModel.getPreviousSection(this.section);
        return previousSection && this.getContainer(previousSection).getObjectIndex(type) === this.getObjectIndex(type);
    }
    canLinkToPrevious() {
        return !!this.section.documentModel.getPreviousSection(this.section);
    }
    static getActualObjectType(section, firstPageOfSection, isEvenPage) {
        if (firstPageOfSection && section.sectionProperties.differentFirstPage)
            return HeaderFooterType.First;
        return isEvenPage && section.documentModel.differentOddAndEvenPages ? HeaderFooterType.Even : HeaderFooterType.Odd;
    }
    static isLinkedToPrevious(section, headerFooterType) {
        return section.headers.isLinkedToPrevious(headerFooterType) || section.footers.isLinkedToPrevious(headerFooterType);
    }
}
SectionHeadersFooters.INVALID_INDEX = -1;
export class SectionHeaders extends SectionHeadersFooters {
    getContainer(section) {
        return section.headers;
    }
    getObjectsCache() {
        return this.section.documentModel.headers;
    }
    clone() {
        let clone = new SectionHeaders(this.section);
        clone.copyFrom(this);
        return clone;
    }
}
export class SectionFooters extends SectionHeadersFooters {
    getContainer(section) {
        return section.footers;
    }
    getObjectsCache() {
        return this.section.documentModel.footers;
    }
    clone() {
        let clone = new SectionFooters(this.section);
        clone.copyFrom(this);
        return clone;
    }
}
