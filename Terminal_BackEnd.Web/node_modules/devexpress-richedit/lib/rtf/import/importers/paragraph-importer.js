import { DocumentFormatsHelper } from '../../../core/formats/utils/document-formats-helper';
import { NumberingListIndexConstants } from '../../../core/formats/utils/numbering-list-index-constants';
import { Paragraph } from '../../../core/model/paragraph/paragraph';
import { ParagraphPropertiesMerger } from '../../../core/model/properties-merger/paragraph-properties-merger';
import { RichUtils } from '../../../core/model/rich-utils';
import { RunType } from '../../../core/model/runs/run-type';
import { ParagraphRun, SectionRun } from '../../../core/model/runs/simple-runs';
import { Stack } from '@devexpress/utils/lib/class/stack';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfParagraphProperties } from '../model/paragraph/paragraph-properties';
import { RtfBaseImporter } from './importer-base';
class RtfParagraphImporterState {
    constructor(paragraphFormatting) {
        this.paragraphFormatting = paragraphFormatting;
    }
}
export class RtfParagraphImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
        this.states = new Stack();
        this.states.push(new RtfParagraphImporterState(new RtfParagraphProperties()));
    }
    get paragraph() { return this.data.positionStates.last.paragraph; }
    set paragraph(value) { this.data.positionStates.last.paragraph = value; }
    get paragraphFormatting() { return this.states.last.paragraphFormatting; }
    set paragraphFormatting(value) { this.states.last.paragraphFormatting = value; }
    static getOnlyOwnCharacterProperties(source, parentStyle) {
        const parentParagraphPropertiesMerger = new ParagraphPropertiesMerger();
        parentParagraphPropertiesMerger.mergeParagraphStyle(parentStyle);
        const paragraphMerger = new ParagraphPropertiesMerger();
        paragraphMerger.mergeOnlyOwnCharacterProperties(source, parentParagraphPropertiesMerger.innerProperties);
        return paragraphMerger.innerProperties;
    }
    createEmptyParagraph() {
        return new Paragraph(this.subDocument, null, 0, null, null);
    }
    fixLastParagraph() {
        if (this.subDocument.isMain())
            this.data.importers.section.applySectionFormatting(true);
    }
    insertParagraph(asSectionRun = false) {
        const characterImporter = this.data.importers.character;
        const par = this.paragraph;
        const prevPar = ListUtils.last(this.subDocument.paragraphs);
        const lastParPos = prevPar ? prevPar.getEndPosition() : 0;
        const parPos = this.subDocument.positionManager.registerPosition(lastParPos);
        const parLen = characterImporter.logPosition - lastParPos + 1;
        this.data.importers.style.paragraph.ensureStyleExist();
        par.subDocument = this.subDocument;
        par.startLogPosition = parPos;
        par.length = parLen;
        this.applyParagraphFormatting(par, asSectionRun);
        characterImporter.addRun(new (asSectionRun ? SectionRun : ParagraphRun)(characterImporter.logPosition, par, characterImporter.getPropsBundle()), (asSectionRun ? RichUtils.specialCharacters.SectionMark : RichUtils.specialCharacters.ParagraphMark));
        this.subDocument.paragraphs.push(par);
        this.paragraph = this.createEmptyParagraph();
        return par;
    }
    ensureLastParagraph() {
        const lastRun = ListUtils.last(ListUtils.last(this.subDocument.chunks).textRuns);
        if (!lastRun || !lastRun.isParagraphOrSectionRun())
            this.insertParagraph();
    }
    applyParagraphFormatting(paragraph, sectionBreak) {
        const paragraphFormatting = this.paragraphFormatting;
        this.applyParagraphFormattingCore(paragraph, paragraphFormatting);
        if (DocumentFormatsHelper.shouldInsertNumbering(this.documentModel)) {
            const numberingListIndex = paragraphFormatting.paragraphListInfo.numberingListIndex;
            if (numberingListIndex >= 0 || numberingListIndex == NumberingListIndexConstants.noNumberingList) {
                if (!(sectionBreak && paragraph.isEmpty)) {
                    paragraphFormatting.paragraphListInfo.numberingListIndex = Math.max(numberingListIndex, NumberingListIndexConstants.minValue);
                    this.data.importers.numbering.addNumberingListToParagraph(paragraph, paragraphFormatting.paragraphListInfo);
                }
            }
            else if (!this.data.importers.numbering.currentOldListSkipNumbering) {
                this.data.importers.numbering.currentOldMultiLevelListIndex = NumberingListIndexConstants.listIndexNotSetted;
                this.data.importers.numbering.currentOldSimpleListIndex = NumberingListIndexConstants.listIndexNotSetted;
            }
        }
        paragraph.tabs = paragraphFormatting.tabs;
    }
    applyParagraphFormattingCore(paragraph, paragraphFormatting) {
        paragraph.paragraphStyle = this.data.importers.style.paragraph.style;
        paragraph.maskedParagraphProperties = RtfParagraphImporter.getOnlyOwnCharacterProperties(paragraphFormatting.getCoreProperties(), paragraph.paragraphStyle);
    }
    pushState() {
        this.states.push(new RtfParagraphImporterState(this.paragraphFormatting.clone()));
    }
    popState() {
        if (this.states.count > 1)
            this.states.pop();
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
        const textRuns = this.subDocument.getLastChunk().textRuns;
        const shouldInsertParagraph = textRuns.length ? ListUtils.last(textRuns).getType() != RunType.ParagraphRun : true;
        if (shouldInsertParagraph)
            this.insertParagraph();
        this.fixLastParagraph();
    }
}
