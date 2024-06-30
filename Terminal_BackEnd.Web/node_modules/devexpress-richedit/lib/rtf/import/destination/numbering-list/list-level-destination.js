import { RichUtils } from '../../../../core/model/rich-utils';
import { RtfNumberingFormats } from '../../../utils/numbering-formats';
import { UnicodeCharHelper } from '../../../utils/unicode-char-helper';
import { RtfListLevel } from '../../model/numbering-lists/rtf-list-level';
import { DestinationBase } from '../base/destination';
import { DestinationType } from '../utils/destination-type';
import { ListLevelNumbersDestination } from './list-level-numbers-destination';
import { ListLevelTextDestination } from './list-level-text-destination';
export class ListLevelDestination extends DestinationBase {
    constructor() {
        super(...arguments);
        this.level = new RtfListLevel();
    }
    get destinationType() { return DestinationType.ListLevelDestination; }
    get controlCharHT() { return null; }
    nestedGroupFinished(nestedDestination) {
        this.tryToHandleFinishOfListLevelTextDestination(nestedDestination);
        this.tryToHandleFinishOfListLevelNumbersDestination(nestedDestination);
    }
    beforePopRtfState() {
        this.applyListLevelParagraphProperties();
        this.applyListLevelCharacterProperties();
    }
    tryToHandleFinishOfListLevelTextDestination(nestedDestination) {
        const currentDestination = this.importer.destination;
        if (nestedDestination instanceof ListLevelTextDestination) {
            currentDestination.level.text = nestedDestination.value;
            currentDestination.level.listLevelProperties.templateCode = nestedDestination.levelTemplateId;
        }
    }
    tryToHandleFinishOfListLevelNumbersDestination(nestedDestination) {
        const currentDestination = this.importer.destination;
        if (nestedDestination instanceof ListLevelNumbersDestination)
            currentDestination.level.numbers = nestedDestination.value;
    }
    applyListLevelParagraphProperties() {
        const destination = this.importer.destination;
        destination.level.paragraphProperties = this.importer.importers.paragraph.paragraphFormatting.getCoreProperties();
    }
    applyListLevelCharacterProperties() {
        const destination = this.importer.destination;
        const text = destination.level.text;
        if (text.length > 1)
            UnicodeCharHelper.setUnicodeFontName(this.importer.documentModel.cache.fontInfoCache, text[1], this.importer.importers.character.characterFormatting);
        destination.level.characterProperties.copyFrom(this.importer.importers.character.characterFormatting.coreProperties);
    }
    static onListLevelStartAtKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (hasParameter)
            destination.level.listLevelProperties.start = parameterValue;
    }
    static onListLevelTentativeKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListLevelNumberingFormatKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (hasParameter) {
            if (parameterValue >= 0 && parameterValue < RtfNumberingFormats.length)
                destination.level.listLevelProperties.format = RtfNumberingFormats[parameterValue];
        }
    }
    static onListLevelAlignmentKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (hasParameter)
            destination.level.listLevelProperties.alignment = parameterValue;
    }
    static onListLevelOldKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter || parameterValue != 0) {
            const destination = importer.destination;
            destination.level.listLevelProperties.legacy = true;
        }
    }
    static onListLevelPrevKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListLevelPrevspaceKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListLevelIndentKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter) {
            const destination = importer.destination;
            destination.level.listLevelProperties.legacyIndent = parameterValue;
        }
    }
    static onListLevelSpaceKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter) {
            const destination = importer.destination;
            destination.level.listLevelProperties.legacySpace = parameterValue;
        }
    }
    static onListLevelTextKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new ListLevelTextDestination(importer);
    }
    static onListLevelNumbersKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new ListLevelNumbersDestination(importer);
    }
    static onListLevelFollowKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (hasParameter) {
            if (parameterValue == 0)
                destination.level.listLevelProperties.separator = RichUtils.specialCharacters.TabMark;
            else {
                if (parameterValue == 1)
                    destination.level.listLevelProperties.separator = ' ';
                else
                    destination.level.listLevelProperties.separator = '\u0000';
            }
        }
    }
    static onListLevelLegalKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (hasParameter)
            destination.level.listLevelProperties.convertPreviousLevelNumberingToDecimal = (parameterValue != 0);
    }
    static onListLevelNoRestartKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (!hasParameter)
            destination.level.listLevelProperties.suppressRestart = true;
        else
            destination.level.listLevelProperties.suppressRestart = (parameterValue != 0);
    }
    static onListLevelPictureKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListLevelPictureNoSizeKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        destination.level.listLevelProperties.suppressBulletResize = true;
    }
    static onParagraphStyleKeyword(_importer, _parameterValue, _hasParameter) {
    }
    processControlCharCore(_ch) {
    }
    processKeywordCore(keyword, parameterValue, hasParameter) {
        const translator = this.keywordHT[keyword];
        if (translator) {
            translator(this.importer, parameterValue, hasParameter);
            return true;
        }
        return false;
    }
    processCharCore(_ch) {
    }
    createClone() {
        const clone = new ListLevelDestination(this.importer);
        clone.level = this.level;
        return clone;
    }
}
