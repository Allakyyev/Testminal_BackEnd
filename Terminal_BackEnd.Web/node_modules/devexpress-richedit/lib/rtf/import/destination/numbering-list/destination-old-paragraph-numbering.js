import { NumberingListIndexConstants } from '../../../../core/formats/utils/numbering-list-index-constants';
import { NumberingFormat } from '../../../../core/model/numbering-lists/list-level-properties';
import { NumberingHelper } from '../../../../core/model/numbering-lists/numbering-helper';
import { AbstractNumberingList, NumberingList } from '../../../../core/model/numbering-lists/numbering-list';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfOldListLevelInfo } from '../../model/numbering-lists/rtf-old-list-level-info';
import { DestinationType } from '../utils/destination-type';
import { DestinationOldParagraphNumberingBase } from './destination-old-paragraph-numbering-base';
export class DestinationOldParagraphNumbering extends DestinationOldParagraphNumberingBase {
    constructor(importer) {
        super(importer);
        this.oldLevelNumber = -1;
        if (importer.importers.numbering.oldListLevelInfo == null)
            importer.importers.numbering.oldListLevelInfo = new RtfOldListLevelInfo();
        importer.importers.character.characterFormatting.coreProperties.setAllUse();
        this.multiLevelListIndex = NumberingListIndexConstants.listIndexNotSetted;
        this.simpleListIndex = NumberingListIndexConstants.listIndexNotSetted;
    }
    get destinationType() { return DestinationType.DestinationOldParagraphNumbering; }
    static onParagraphLevelKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter && parameterValue == 10) {
            DestinationOldParagraphNumbering.onSimpleNumberingKeyword(importer, 0, false);
            return;
        }
        importer.destination.oldLevelNumber = parameterValue;
        importer.destination.simpleList = false;
    }
    static onBulletedParagraphKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.numbering.oldListLevelInfo.listLevelProperties.format = NumberingFormat.Bullet;
    }
    static onSimpleNumberingKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination.simpleList = true;
    }
    static onSkipNumberingKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.numbering.oldListLevelInfo.skipNumbering = true;
    }
    static onListOverrideKeyword(importer, parameterValue, _hasParameter) {
        const index = importer.importers.numbering.listOverrideIndexToNumberingListIndexMap[parameterValue];
        if (index !== undefined)
            importer.importers.paragraph.paragraphFormatting.paragraphListInfo.numberingListIndex = index;
        importer.destination.explicitNumberingListIndex = true;
    }
    static onListLevelKeyword(importer, parameterValue, _hasParameter) {
        importer.importers.paragraph.paragraphFormatting.paragraphListInfo.listLevelIndex = parameterValue;
        importer.destination.explicitListLevelIndex = true;
    }
    createClone() {
        const result = new DestinationOldParagraphNumbering(this.importer);
        return result;
    }
    beforePopRtfState() {
        super.beforePopRtfState();
        if (this.shouldCreateNewList()) {
            this.createNewList();
        }
        else {
            this.skipNumbering = this.isSkipNumbering();
            this.simpleListIndex = this.importer.importers.numbering.currentOldSimpleListIndex;
            this.multiLevelListIndex = this.importer.importers.numbering.currentOldMultiLevelListIndex;
        }
        if (this.explicitNumberingListIndex && this.explicitListLevelIndex) {
            this.listLevelIndex = this.importer.importers.paragraph.paragraphFormatting.listLevelIndex;
            this.numberingListIndex = this.importer.importers.paragraph.paragraphFormatting.numberingListIndex;
        }
        else
            this.listLevelIndex = this.oldLevelNumber >= 0 ? this.oldLevelNumber - 1 : 0;
    }
    afterPopRtfState() {
        super.afterPopRtfState();
        this.importer.importers.paragraph.paragraphFormatting.paragraphListInfo.listLevelIndex = this.listLevelIndex;
        const actualNumberingListIndex = this.isSimpleList() ? this.simpleListIndex : this.multiLevelListIndex;
        this.importer.importers.numbering.currentOldListSkipNumbering = this.skipNumbering;
        if (this.isOldNumberingListCreated) {
            this.importer.importers.numbering.currentOldMultiLevelListIndex = this.multiLevelListIndex;
            this.importer.importers.numbering.currentOldSimpleListIndex = this.simpleListIndex;
            this.importer.importers.numbering.currentOldSimpleList = this.simpleList;
        }
        if (this.explicitListLevelIndex && this.explicitNumberingListIndex) {
            this.importer.importers.paragraph.paragraphFormatting.paragraphListInfo.numberingListIndex = this.numberingListIndex;
            this.importer.importers.paragraph.paragraphFormatting.paragraphListInfo.listLevelIndex = this.listLevelIndex;
        }
        else
            this.importer.importers.paragraph.paragraphFormatting.paragraphListInfo.numberingListIndex = !this.skipNumbering ?
                actualNumberingListIndex : NumberingListIndexConstants.noNumberingList;
    }
    createNewList() {
        const oldListLevelInfo = this.importer.importers.numbering.oldListLevelInfo;
        if (this.simpleList) {
            this.createSimpleNumberingListLevels();
            this.simpleListIndex = this.importer.documentModel.numberingLists.length - 1;
            this.multiLevelListIndex = this.importer.importers.numbering.currentOldMultiLevelListIndex;
        }
        else if (oldListLevelInfo.listLevelProperties.format == NumberingFormat.Bullet) {
            this.createBulletedListLevels();
            this.multiLevelListIndex = this.importer.documentModel.numberingLists.length - 1;
            this.simpleListIndex = this.importer.importers.numbering.currentOldSimpleListIndex;
        }
        else {
            this.createMultilevelListLevels();
            this.multiLevelListIndex = this.importer.documentModel.numberingLists.length - 1;
            this.simpleListIndex = this.importer.importers.numbering.currentOldSimpleListIndex;
        }
    }
    createMultilevelListLevels() {
        const documentModel = this.importer.documentModel;
        const abstractNumberingList = new AbstractNumberingList(documentModel);
        documentModel.abstractNumberingLists.push(abstractNumberingList);
        for (let i = 0; i < abstractNumberingList.levels.length; i++) {
            const levelInfo = this.importer.importers.numbering.oldListLevelInfoCollection.getByIndex(i + 1);
            const level = abstractNumberingList.levels[i];
            const firstLineIndent = levelInfo.indent;
            this.setFirstLineIndent(abstractNumberingList.levels[i], firstLineIndent);
            level.getCharacterProperties().copyFrom(this.importer.importers.character.characterFormatting.coreProperties);
            let formatString = `${levelInfo.textBefore}{${i}}${levelInfo.textAfter}`;
            if (i > 0 && levelInfo.includeInformationFromPreviousLevel)
                formatString = abstractNumberingList.levels[i - 1].getListLevelProperties().displayFormatString + formatString;
            this.setDisplayFormatString(level, formatString);
            this.setLegacyProperties(level, 0, 0);
        }
        this.isOldNumberingListCreated = true;
        documentModel.numberingLists.push(new NumberingList(documentModel, documentModel.abstractNumberingLists.length - 1));
    }
    createBulletedListLevels() {
        const documentModel = this.importer.documentModel;
        const levelOffset = UnitConverter.documentsToTwips(150);
        const abstractNumberingList = new AbstractNumberingList(documentModel);
        documentModel.abstractNumberingLists.push(abstractNumberingList);
        for (let i = 0; i < abstractNumberingList.levels.length; i++) {
            const level = abstractNumberingList.levels[i];
            level.getCharacterProperties().copyFrom(this.importer.importers.character.characterFormatting.coreProperties);
            level.getListLevelProperties().format = NumberingFormat.Bullet;
            const firstLineIndent = levelOffset * i + this.importer.importers.paragraph.paragraphFormatting.coreProperties.firstLineIndent;
            this.setFirstLineIndent(level, firstLineIndent);
            this.setDisplayFormatString(level, this.importer.importers.numbering.oldListLevelInfo.textBefore + this.importer.importers.numbering.oldListLevelInfo.textAfter);
            this.setTemplateCode(level, NumberingHelper.generateNewTemplateCode(documentModel));
            this.setLegacyProperties(level, 0, 0);
        }
        this.isOldNumberingListCreated = true;
        documentModel.numberingLists.push(new NumberingList(documentModel, documentModel.abstractNumberingLists.length - 1));
    }
    createSimpleNumberingListLevels() {
        const documentModel = this.importer.documentModel;
        const addResult = this.shouldCreateNewAbstractSimpleList();
        const existingNumberingListIndex = addResult.existingNumberingListIndex;
        if (addResult.isSecceed) {
            const abstractNumberingList = new AbstractNumberingList(documentModel);
            documentModel.abstractNumberingLists.push(abstractNumberingList);
            for (let i = 0; i < abstractNumberingList.levels.length; i++) {
                const level = abstractNumberingList.levels[i];
                level.getCharacterProperties().copyFrom(this.importer.importers.character.characterFormatting.coreProperties);
                const firstLineIndent = this.importer.importers.paragraph.paragraphFormatting.coreProperties.firstLineIndent + 150 * i;
                this.setFirstLineIndent(level, firstLineIndent);
                this.setDisplayFormatString(level, `${this.importer.importers.numbering.oldListLevelInfo.textBefore}{${i}}${this.importer.importers.numbering.oldListLevelInfo.textAfter}`);
                this.setTemplateCode(level, NumberingHelper.generateNewTemplateCode(documentModel));
                this.setLegacyProperties(level, 0, 0);
                const start = this.importer.importers.numbering.oldListLevelInfo.listLevelProperties.start;
                if (start > 0)
                    level.getListLevelProperties().start = start;
                const numberingFormat = this.importer.importers.numbering.oldListLevelInfo.listLevelProperties.format;
                if (numberingFormat != NumberingFormat.Decimal)
                    level.getListLevelProperties().format = numberingFormat;
            }
            this.isOldNumberingListCreated = true;
            documentModel.numberingLists.push(new NumberingList(documentModel, documentModel.abstractNumberingLists.length - 1));
            this.importer.importers.numbering.numberingListToOldListLevelInfoMap[documentModel.numberingLists.length - 1] = this.importer.importers.numbering.oldListLevelInfo.clone();
        }
        else {
            const abstractNumberingListIndex = documentModel.numberingLists[existingNumberingListIndex].abstractNumberingListIndex;
            const prevNumberingList = ListUtils.last(documentModel.numberingLists);
            const newList = new NumberingList(documentModel, abstractNumberingListIndex);
            const level = newList.levels[0];
            const start = this.importer.importers.numbering.oldListLevelInfo.listLevelProperties.start;
            if (start >= 0)
                level.getListLevelProperties().start = start;
            const numberingFormat = this.importer.importers.numbering.oldListLevelInfo.listLevelProperties.format;
            if (numberingFormat != NumberingFormat.Decimal)
                level.getListLevelProperties().format = numberingFormat;
            if (prevNumberingList != null && prevNumberingList.levels[0].getListLevelProperties().format != level.getListLevelProperties().format)
                level.overrideStart = true;
            level.getCharacterProperties().copyFrom(this.importer.importers.character.characterFormatting.coreProperties);
            const firstLineIndent = this.importer.importers.paragraph.paragraphFormatting.coreProperties.firstLineIndent;
            this.setFirstLineIndent(level, firstLineIndent);
            this.setDisplayFormatString(level, `${this.importer.importers.numbering.oldListLevelInfo.textBefore}{${0}}${this.importer.importers.numbering.oldListLevelInfo.textAfter}`);
            this.setTemplateCode(level, NumberingHelper.generateNewTemplateCode(documentModel));
            this.setLegacyProperties(level, 0, 0);
            documentModel.numberingLists.push(newList);
            this.importer.importers.numbering.numberingListToOldListLevelInfoMap[documentModel.numberingLists.length - 1] = this.importer.importers.numbering.oldListLevelInfo.clone();
        }
    }
    shouldCreateNewAbstractSimpleList() {
        let existingNumberingListIndex;
        if (this.importer.importers.numbering.currentOldSimpleList &&
            this.importer.importers.numbering.currentOldSimpleListIndex >= NumberingListIndexConstants.minValue) {
            existingNumberingListIndex = this.importer.importers.numbering.currentOldSimpleListIndex;
            let oldListLevelInfo = this.importer.importers.numbering.numberingListToOldListLevelInfoMap[existingNumberingListIndex];
            if (!oldListLevelInfo)
                return { isSecceed: true, existingNumberingListIndex: existingNumberingListIndex };
            return { isSecceed: !this.areSameInfo(oldListLevelInfo, this.importer.importers.numbering.oldListLevelInfo), existingNumberingListIndex: existingNumberingListIndex };
        }
        existingNumberingListIndex = NumberingListIndexConstants.listIndexNotSetted;
        let prevParagraphIndex = this.importer.subDocument.paragraphs.length - 1 - 1;
        for (; prevParagraphIndex >= 0; prevParagraphIndex--) {
            const prevParagraph = this.importer.subDocument.paragraphs[prevParagraphIndex];
            if (!prevParagraph.isInList()) {
                if (prevParagraph.numberingListIndex == NumberingListIndexConstants.noNumberingList)
                    continue;
                return { isSecceed: true, existingNumberingListIndex: existingNumberingListIndex };
            }
            const numberingListIndex = prevParagraph.numberingListIndex;
            const prevOldListLevelInfo = this.importer.importers.numbering.numberingListToOldListLevelInfoMap[numberingListIndex];
            if (!prevOldListLevelInfo)
                return { isSecceed: true, existingNumberingListIndex: existingNumberingListIndex };
            if (!this.areSameInfo(prevOldListLevelInfo, this.importer.importers.numbering.oldListLevelInfo))
                return { isSecceed: true, existingNumberingListIndex: existingNumberingListIndex };
            existingNumberingListIndex = numberingListIndex;
            return { isSecceed: false, existingNumberingListIndex: existingNumberingListIndex };
        }
        return { isSecceed: true, existingNumberingListIndex: existingNumberingListIndex };
    }
    setLegacyProperties(level, legacyIndent, legacySpace) {
        level.getListLevelProperties().legacy = true;
        level.getListLevelProperties().legacySpace = legacyIndent;
        level.getListLevelProperties().legacyIndent = legacySpace;
    }
    setDisplayFormatString(level, displayFormatString) {
        level.getListLevelProperties().displayFormatString = displayFormatString;
    }
    setFirstLineIndent(level, lineIndent) {
        level.getParagraphProperties().leftIndent = lineIndent;
    }
    setTemplateCode(level, templateCode) {
        level.getListLevelProperties().templateCode = templateCode;
    }
    shouldCreateNewList() {
        if (this.isNewListLevelInfoPresent())
            return false;
        if (this.isMultilevelList())
            return (!this.sectionMultiLevelListCreated());
        if (this.isSimpleList())
            return true;
        if (this.isSkipNumbering())
            return false;
        return true;
    }
    isNewListLevelInfoPresent() {
        if (this.explicitListLevelIndex && this.explicitNumberingListIndex)
            return true;
        if (this.isSimpleList()) {
            if (this.simpleListIndex < NumberingListIndexConstants.minValue)
                return false;
            const existingListLevelInfo = this.importer.importers.numbering.numberingListToOldListLevelInfoMap[this.simpleListIndex];
            if (!existingListLevelInfo)
                return false;
            return this.areSameInfo(existingListLevelInfo, this.importer.importers.numbering.oldListLevelInfo);
        }
        else
            return this.multiLevelListIndex >= NumberingListIndexConstants.minValue;
    }
    areSameInfo(existingListLevelInfo, rtfOldListLevelInfo) {
        return existingListLevelInfo.textAfter == rtfOldListLevelInfo.textAfter && existingListLevelInfo.textBefore == rtfOldListLevelInfo.textBefore;
    }
    isSimpleList() {
        return this.simpleList;
    }
    isMultilevelList() {
        return (this.oldLevelNumber >= 0) && !this.simpleList;
    }
    sectionMultiLevelListCreated() {
        return this.importer.importers.numbering.currentOldMultiLevelListIndex >= NumberingListIndexConstants.minValue;
    }
    isSkipNumbering() {
        return this.importer.importers.numbering.oldListLevelInfo.skipNumbering;
    }
}
