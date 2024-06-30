import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { CharacterPropertiesMerger } from '../../../core/model/properties-merger/character-properties-merger';
import { TextRun } from '../../../core/model/runs/text-run';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { MaskedCharacterPropertiesBundle } from '../../../core/rich-utils/properties-bundle';
import { Stack } from '@devexpress/utils/lib/class/stack';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { UnicodeCharHelper } from '../../utils/unicode-char-helper';
import { RtfCharacterProperties } from '../model/character/character-properties';
import { RtfBaseImporter } from './importer-base';
class RtfCharacterImporterState {
    constructor(characterFormatting) {
        this.characterFormatting = characterFormatting;
    }
}
export class RtfCharacterImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
        this.states = new Stack();
        const defaultCharacterProperties = new RtfCharacterProperties();
        defaultCharacterProperties.coreProperties = this.data.documentModel.defaultCharacterProperties;
        this.states.push(new RtfCharacterImporterState(defaultCharacterProperties));
        this.logPosition = 0;
    }
    get characterFormatting() { return this.states.last.characterFormatting; }
    static getOnlyOwnCharacterProperties(source, parentCharacterStyle) {
        const parentPropertiesMerger = new CharacterPropertiesMerger();
        parentPropertiesMerger.mergeCharacterStyle(parentCharacterStyle);
        const merger = new CharacterPropertiesMerger();
        merger.innerProperties.fontInfo = source.fontInfo;
        merger.mergeOnlyOwnCharacterProperties(source, parentPropertiesMerger.innerProperties);
        return merger.innerProperties;
    }
    getPropsBundle() {
        return new MaskedCharacterPropertiesBundle(RtfCharacterImporter.getOnlyOwnCharacterProperties(this.characterFormatting.coreProperties, this.data.importers.style.character.style), this.data.importers.style.character.style);
    }
    insertText(text) {
        this.addRun(new TextRun(this.logPosition, text.length, this.data.importers.paragraph.paragraph, this.getPropsBundle()), text);
    }
    setFontNameAndInsertText(text, charType) {
        UnicodeCharHelper.setUnicodeFontNameByCharType(this.data.documentModel.cache.fontInfoCache, charType, this.characterFormatting);
        this.insertText(text);
    }
    getLastRunProperties() {
        const textRun = ListUtils.last(ListUtils.last(this.subDocument.chunks).textRuns);
        if (textRun)
            return textRun.getCharPropsBundle(this.documentModel);
        return this.getPropsBundle();
    }
    addSimpleRun(runConstr, text, useLastProperties) {
        const properties = useLastProperties ? this.getLastRunProperties() : this.getPropsBundle();
        const run = new runConstr(this.logPosition, this.data.importers.paragraph.paragraph, properties);
        return this.addRun(run, text);
    }
    addRun(run, text) {
        const chunk = ListUtils.last(this.subDocument.chunks);
        chunk.textRuns.push(run);
        chunk.textBuffer += text;
        this.logPosition += run.getLength();
        return run;
    }
    insertSpace() {
        if (this.data.importers.character.characterFormatting.rtfFormattingInfo.deleted)
            return;
        this.insertText(" ");
    }
    splitByCharTypeAndInsertText(text) {
        if (!text)
            return;
        const oldFontInfo = this.characterFormatting.coreProperties.fontInfo;
        let currentText = text.charAt(0);
        let lastCharType = UnicodeCharHelper.calculateCharType(currentText);
        for (let i = 1; i < text.length; i++) {
            const ch = text.charAt(i);
            const charType = UnicodeCharHelper.calculateCharType(ch);
            if (lastCharType != charType) {
                this.setFontNameAndInsertText(currentText, lastCharType);
                currentText = '';
            }
            currentText += ch;
            lastCharType = charType;
        }
        this.setFontNameAndInsertText(currentText, lastCharType);
        this.characterFormatting.coreProperties.setValue(CharacterPropertyDescriptor.fontInfo, oldFontInfo);
    }
    appendChar(ch) {
        const oldFontInfo = this.characterFormatting.coreProperties.fontInfo;
        UnicodeCharHelper.setUnicodeFontName(this.data.documentModel.cache.fontInfoCache, ch, this.characterFormatting);
        this.insertText(ch);
        this.characterFormatting.coreProperties.setValue(CharacterPropertyDescriptor.fontInfo, oldFontInfo);
    }
    onPlainKeyword() {
        this.applyDefaultCharacterProperties();
    }
    applyDefaultCharacterProperties() {
        const defaultFormatting = this.documentModel.defaultCharacterProperties;
        const currentPositionFormatting = this.characterFormatting.coreProperties;
        currentPositionFormatting.fontInfo = this.data.importers.font.fonts
            .getRtfFontInfoById(this.data.importers.font.defaultFontNumber).getCoreObjectByName(this.documentModel);
        this.data.importers.character.characterFormatting.resetUseAssociatedProperties();
        currentPositionFormatting.fontSize = 12;
        currentPositionFormatting.fontBold = defaultFormatting.fontBold;
        currentPositionFormatting.fontItalic = defaultFormatting.fontItalic;
        currentPositionFormatting.fontStrikeoutType = defaultFormatting.fontStrikeoutType;
        currentPositionFormatting.fontUnderlineType = defaultFormatting.fontUnderlineType;
        currentPositionFormatting.allCaps = defaultFormatting.allCaps;
        currentPositionFormatting.smallCaps = defaultFormatting.smallCaps;
        currentPositionFormatting.hidden = defaultFormatting.hidden;
        currentPositionFormatting.underlineWordsOnly = defaultFormatting.underlineWordsOnly;
        currentPositionFormatting.strikeoutWordsOnly = defaultFormatting.strikeoutWordsOnly;
        currentPositionFormatting.highlightColor = defaultFormatting.highlightColor;
        currentPositionFormatting.underlineColor = defaultFormatting.underlineColor;
        currentPositionFormatting.strikeoutColor = defaultFormatting.strikeoutColor;
        currentPositionFormatting.shadingInfo = ShadingInfo.auto;
        currentPositionFormatting.shadingInfo = defaultFormatting.shadingInfo;
        currentPositionFormatting.script = defaultFormatting.script;
        currentPositionFormatting.textColor = defaultFormatting.textColor;
        this.data.setCodePage(this.data.documentProperties.defaultCodePage);
    }
    pushState() {
        this.states.push(new RtfCharacterImporterState(this.characterFormatting.clone()));
    }
    popState() {
        if (this.states.count > 1)
            this.states.pop();
    }
    startImportSubDocument() {
        this.logPosition = this.subDocument.getLastChunk().getEndPosition();
    }
    finalizeSubDocument() {
    }
}
