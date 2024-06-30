import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { RtfBaseImporter } from './importer-base';
import { RtfCharacterStyleImporter } from './styles/character-style-importer';
import { RtfParagraphStyleImporter } from './styles/paragraph-style-importer';
import { RtfTableStyleImporter } from './styles/table-style-importer';
export class RtfStylesImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
        this.linkParagraphStyleIndexToCharacterStyleIndex = {};
        this.nextParagraphStyleIndexTable = {};
        this.paragraph = new RtfParagraphStyleImporter(data);
        this.paragraph.mapRtfIndexToModelIndex[0] = 0;
        this.character = new RtfCharacterStyleImporter(data);
        this.table = new RtfTableStyleImporter(data);
        this.importers = [
            this.paragraph,
            this.character,
            this.table,
        ];
    }
    applyStyleLinks() {
        NumberMapUtils.forEach(this.linkParagraphStyleIndexToCharacterStyleIndex, (rtfCharStyleInd, rtfParStyleInd) => {
            if (this.paragraph.mapRtfIndexToModelIndex[rtfParStyleInd] !== undefined &&
                this.character.mapRtfIndexToModelIndex[rtfCharStyleInd] !== undefined) {
                const parStyle = this.paragraph.getModelIndex(rtfParStyleInd);
                const charStyle = this.character.getModelIndex(rtfCharStyleInd);
                this.documentModel.stylesManager.registerLink(this.documentModel.characterStyles[charStyle], this.documentModel.paragraphStyles[parStyle]);
            }
        });
        NumberMapUtils.forEach(this.nextParagraphStyleIndexTable, (rtfNextStyleIndex, rtfParStyleInd) => {
            if (this.paragraph.mapRtfIndexToModelIndex[rtfParStyleInd] !== undefined &&
                this.paragraph.mapRtfIndexToModelIndex[rtfNextStyleIndex] !== undefined) {
                const parStyle = this.paragraph.getModelIndex(rtfParStyleInd);
                const nextParStyle = this.paragraph.getModelIndex(rtfNextStyleIndex);
                this.documentModel.paragraphStyles[parStyle].nextParagraphStyle = this.documentModel.paragraphStyles[nextParStyle];
            }
        });
    }
    pushState() {
        for (let imp of this.importers)
            imp.pushState();
    }
    popState() {
        ListUtils.reverseForEach(this.importers, imp => imp.popState());
    }
    startImportSubDocument() {
        for (let imp of this.importers)
            imp.startImportSubDocument();
    }
    finalizeSubDocument() {
    }
}
