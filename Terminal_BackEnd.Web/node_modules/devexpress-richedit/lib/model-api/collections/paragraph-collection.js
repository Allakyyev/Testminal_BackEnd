import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { ParagraphApi } from '../paragraph';
import { SubDocumentApi } from '../sub-document';
import { Collection } from './collection';
export class ParagraphCollection extends Collection {
    constructor(processor, subDocument) {
        super(processor);
        this._subDocument = subDocument;
    }
    create(position) {
        return new SubDocumentApi(this._processor, this._subDocument).insertParagraph(position);
    }
    find(position) {
        const interval = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => new FixedInterval(n, 0)),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length))
        ]);
        const result = [];
        const paragraphs = this._subDocument.getParagraphsByInterval(interval);
        ListUtils.forEach(paragraphs, (par) => {
            result.push(this._getItem(par));
        });
        return result;
    }
    _getItem(coreItem) {
        return new ParagraphApi(this._processor, coreItem);
    }
    _getCoreItems() {
        return this._subDocument.paragraphs;
    }
}
