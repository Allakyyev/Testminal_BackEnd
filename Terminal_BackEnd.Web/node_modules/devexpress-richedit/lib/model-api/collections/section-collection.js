import { ApiUtils } from '../api-utils/api-utils';
import { SectionApi } from '../section';
import { SubDocumentApi } from '../sub-document';
import { Collection } from './collection';
export class SectionCollection extends Collection {
    find(position) {
        ApiUtils.assertNumber(position, "position");
        const section = this._processor.modelManager.model.getSectionByPosition(position);
        return new SectionApi(this._processor, section);
    }
    create(sectionBreakPosition, type) {
        return new SubDocumentApi(this._processor, this._processor.modelManager.model.mainSubDocument).insertSectionBreak(sectionBreakPosition, type);
    }
    _getItem(coreItem) {
        return new SectionApi(this._processor, coreItem);
    }
    _getCoreItems() {
        return this._processor.modelManager.model.sections;
    }
}
