import { HyperlinkInfo } from '../../../core/model/fields/field';
import { ControlOptions } from '../../../core/model/options/control';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ImportedFieldCodeEndRunInfo, ImportedFieldCodeStartRunInfo, ImportedFieldResultEndRunInfo, ImportedTextRunInfo } from '../containers/runs';
import { HtmlTagImporterBase } from './base';
export class HtmlATagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "A";
    }
    importBefore() {
        const hyperlinkElement = this.element;
        if (!hyperlinkElement.href)
            return;
        const uriParts = hyperlinkElement.href.split("#");
        const hyperlinkInfo = new HyperlinkInfo(uriParts[0], uriParts.length > 1 ? uriParts[1] : "", hyperlinkElement.title, false);
        const codeText = [
            " HYPERLINK \"",
            hyperlinkInfo.uri,
            "\" ",
            hyperlinkInfo.tip == "" ? "" : "\\o \"" + hyperlinkInfo.tip + "\" ",
            hyperlinkInfo.anchor == "" ? "" : "\\l \"" + hyperlinkInfo.anchor + "\" "
        ].join("");
        this.addRun(new ImportedFieldCodeStartRunInfo(this.importer.charPropsBundle, hyperlinkInfo, this.importer.fieldsId));
        this.addRun(new ImportedTextRunInfo(this.importer.modelManager.model, this.importer.measurer, codeText, this.importer.htmlImporterMaskedCharacterProperties.getBundleFrom(this.element, new FixedInterval(this.importer.currPosition, codeText.length))));
        this.addRun(new ImportedFieldCodeEndRunInfo(this.importer.charPropsBundle, this.importer.fieldsId));
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
        if (!this.element.href)
            return;
        this.addRun(new ImportedFieldResultEndRunInfo(this.importer.charPropsBundle, this.importer.fieldsId));
        this.importer.fieldsId++;
    }
    isAllowed() {
        return ControlOptions.isEnabled(this.importer.modelManager.richOptions.control.hyperlinks);
    }
}
