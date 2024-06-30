import { HtmlTagImporterBase } from './base';
import { ImportedTextRunInfo } from '../containers/runs';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { RichUtils } from '../../../core/model/rich-utils';
export class HtmlSpanTagImporter extends HtmlTagImporterBase {
    constructor() {
        super(...arguments);
        this.importChilds = true;
    }
    elementTag() {
        return "SPAN";
    }
    importBefore() {
        var _a, _b;
        const tabCountStr = (_b = (_a = this.element.getAttribute('style')) === null || _a === void 0 ? void 0 : _a.split(';').find(e => e.startsWith('mso-tab-count:'))) === null || _b === void 0 ? void 0 : _b.replace('mso-tab-count:', '');
        if (tabCountStr) {
            const count = parseInt(tabCountStr);
            this.importer.addRun(new ImportedTextRunInfo(this.importer.modelManager.model, this.importer.measurer, StringUtils.repeat(RichUtils.specialCharacters.TabMark, count), this.importer.htmlImporterMaskedCharacterProperties.getBundleFrom(this.element, new FixedInterval(this.importer.currPosition, count))));
            this.importChilds = false;
        }
    }
    isImportChilds() {
        return this.importChilds;
    }
    importAfter() {
    }
}
