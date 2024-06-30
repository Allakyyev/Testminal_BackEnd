import { MaskedCharacterProperties } from '../../../core/model/character/character-properties';
import { Paragraph } from '../../../core/model/paragraph/paragraph';
import { MaskedParagraphProperties } from '../../../core/model/paragraph/paragraph-properties';
import { TabProperties } from '../../../core/model/paragraph/paragraph-style';
import { RichUtils } from '../../../core/model/rich-utils';
import { ParagraphRun, SectionRun } from '../../../core/model/runs/simple-runs';
import { MaskedCharacterPropertiesBundle } from '../../../core/rich-utils/properties-bundle';
import { Constants } from '@devexpress/utils/lib/constants';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class ParagraphImporter {
    constructor(data) {
        this.paraId = Constants.MIN_SAFE_INTEGER;
        this.data = data;
        this.createParagraph();
    }
    resetProperties() {
        this.properties = MaskedParagraphProperties.createDefault(this.data.documentModel);
        return this;
    }
    resetStyle() {
        this.style = this.data.stylesImporter.paragraphManager.defaultStyle;
        return this;
    }
    resetTabs() {
        this.tabs = new TabProperties();
        return this;
    }
    resetParMarkCharacterStyle() {
        this.parMarkCharacterStyle = this.data.documentModel.characterStyles[0];
        return this;
    }
    resetParMarkCharProperties() {
        this.parMarkCharProperties = MaskedCharacterProperties.createDefault(this.data.documentModel);
        return this;
    }
    createParagraph() {
        this.resetProperties()
            .resetStyle()
            .resetTabs()
            .resetParMarkCharProperties()
            .resetParMarkCharacterStyle();
        const lastPar = ListUtils.last(this.data.subDocument.paragraphs);
        this.paragraph = new Paragraph(this.data.subDocument, this.data.subDocument.positionManager.registerPosition(lastPar ? lastPar.getEndPosition() : 0), 0, null, null);
        return this.paragraph;
    }
    insertParagraph(asSectionRun = false) {
        const paragraph = this.paragraph;
        this.data.subDocumentInfo.characterImporter.addRun(new (asSectionRun ? SectionRun : ParagraphRun)(this.data.subDocumentInfo.positionImporter.currPosition, paragraph, new MaskedCharacterPropertiesBundle(this.parMarkCharProperties, this.parMarkCharacterStyle)), (asSectionRun ? RichUtils.specialCharacters.SectionMark : RichUtils.specialCharacters.ParagraphMark));
        this.data.subDocument.paragraphs.push(paragraph);
        paragraph.length = this.data.subDocumentInfo.positionImporter.currPosition - paragraph.startLogPosition.value;
        this.applyParagraphProperties();
        this.createParagraph();
        return paragraph;
    }
    applyParagraphProperties() {
        this.paragraph.paragraphStyle = this.style;
        this.paragraph.maskedParagraphProperties = this.data.documentModel.cache.maskedParagraphPropertiesCache.getItem(this.properties.clone());
        this.paragraph.tabs = this.tabs.clone();
    }
}
