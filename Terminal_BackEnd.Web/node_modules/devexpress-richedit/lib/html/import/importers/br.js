import { RichUtils } from '../../../core/model/rich-utils';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ImportedTextRunInfo } from '../containers/runs';
import { HtmlTagImporterBase } from './base';
export class HtmlBrTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "BR";
    }
    importBefore() {
        const breakChar = this.element.style.pageBreakBefore == "always" ?
            RichUtils.specialCharacters.PageBreak :
            RichUtils.specialCharacters.LineBreak;
        this.addRun(new ImportedTextRunInfo(this.importer.modelManager.model, this.importer.measurer, breakChar, this.importer.htmlImporterMaskedCharacterProperties.getBundleFrom(this.element, new FixedInterval(this.importer.currPosition, 1))));
    }
    isImportChilds() {
        return false;
    }
    importAfter() {
    }
}
