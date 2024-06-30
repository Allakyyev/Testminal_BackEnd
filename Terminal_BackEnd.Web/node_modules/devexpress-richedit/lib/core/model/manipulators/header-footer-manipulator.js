import { HeaderFooterCreatedModelChange } from '../changes/model/header-created';
import { HeaderFooterIndexChangedModelChange } from '../changes/model/header-footer-index-changed';
import { SubDocumentInfoType } from '../enums';
import { ChangeFooterIndexHistoryItem, ChangeHeaderIndexHistoryItem } from '../history/items/header-footer-history-items';
import { BaseManipulator } from './base-manipulator';
export class HeaderFooterManipulatorBase extends BaseManipulator {
    createObject(type) {
        let object = this.createObjectCore();
        object.headerFooterType = type;
        let objectIndex = this.getObjectsCache().push(object) - 1;
        this.modelManipulator.notifyModelChanged(new HeaderFooterCreatedModelChange(this.isHeader(), type, object));
        return objectIndex;
    }
    changeObjectIndex(sectionIndex, type, objectIndex) {
        this.modelManipulator.notifyModelChanged(new HeaderFooterIndexChangedModelChange(sectionIndex, this.isHeader(), type, objectIndex));
        let section = this.modelManipulator.model.sections[sectionIndex];
        let oldIndex = this.getContainer(section).getObjectIndex(type);
        this.getContainer(section).setObjectIndex(type, objectIndex);
        return oldIndex;
    }
    insertHeaderFooter(sectionIndex, isHeader, type) {
        this.modelManipulator.batchUpdatableObject.beginUpdate();
        const objectIndex = this.getHeaderFooterManipulator(isHeader).createObject(type);
        this.history.addAndRedo(new (isHeader ? ChangeHeaderIndexHistoryItem : ChangeFooterIndexHistoryItem)(this.modelManipulator, sectionIndex, type, objectIndex, _oldIndex => { }));
        this.modelManipulator.batchUpdatableObject.endUpdate();
    }
    getHeaderFooterManipulator(isHeader) {
        return isHeader ? this.modelManipulator.header : this.modelManipulator.footer;
    }
}
export class HeaderManipulator extends HeaderFooterManipulatorBase {
    createObjectCore() {
        return this.modelManipulator.model.createSubDocument(SubDocumentInfoType.Header, -1).info;
    }
    getObjectsCache() {
        return this.modelManipulator.model.headers;
    }
    isHeader() {
        return true;
    }
    getContainer(section) {
        return section.headers;
    }
}
export class FooterManipulator extends HeaderFooterManipulatorBase {
    createObjectCore() {
        return this.modelManipulator.model.createSubDocument(SubDocumentInfoType.Footer, -1).info;
    }
    getObjectsCache() {
        return this.modelManipulator.model.footers;
    }
    isHeader() {
        return false;
    }
    getContainer(section) {
        return section.footers;
    }
}
