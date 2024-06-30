import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { SectionFooters, SectionHeaders } from './header-footer';
export class Section {
    constructor(documentModel, startLogPosition, length, sectionProperties) {
        this.documentModel = documentModel;
        this.startLogPosition = startLogPosition;
        this.length = length;
        this.sectionProperties = sectionProperties;
        this.headers = new SectionHeaders(this);
        this.footers = new SectionFooters(this);
    }
    getLength() {
        return this.length;
    }
    setLength(subDocument, newLength) {
        if (subDocument.isMain())
            this.length = newLength;
    }
    getEndPosition() {
        return this.startLogPosition.value + this.length;
    }
    static getPageSectionIndex(layoutPage, sections) {
        const layoutPageStartPosition = layoutPage.getPosition();
        return SearchUtils.normedInterpolationIndexOf(sections, s => s.startLogPosition.value, layoutPageStartPosition);
    }
    get interval() { return new FixedInterval(this.startLogPosition.value, this.length); }
    cloneToNewModel(model) {
        return new Section(model, model.mainSubDocument.positionManager.registerPosition(this.startLogPosition.value), this.length, this.sectionProperties.clone());
    }
}
