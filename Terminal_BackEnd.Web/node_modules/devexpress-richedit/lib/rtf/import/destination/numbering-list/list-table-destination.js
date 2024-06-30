import { RtfNumberingList, RtfNumberingListType } from '../../model/numbering-lists/rtf-numbering-list';
import { DestinationBase } from '../base/destination';
import { DestinationType } from '../utils/destination-type';
import { ListLevelDestination } from './list-level-destination';
import { ListNameDestination } from './list-name-destination';
import { ListStyleNameDestination } from './list-style-name-destination';
export class ListTableDestination extends DestinationBase {
    get destinationType() { return DestinationType.ListTableDestination; }
    get controlCharHT() { return null; }
    nestedGroupFinished(nestedDestination) {
        this.tryToHandleFinishOfListNameDestination(nestedDestination);
        this.tryToHandleFinishOfListStyleNameDestination(nestedDestination);
        this.tryToHandleFinishOfListLevelDestination(nestedDestination);
    }
    tryToHandleFinishOfListNameDestination(nestedDestination) {
        const currentDestination = this.importer.destination;
        if (nestedDestination instanceof ListNameDestination)
            currentDestination.currentList.name = nestedDestination.value;
    }
    tryToHandleFinishOfListStyleNameDestination(nestedDestination) {
        const currentDestination = this.importer.destination;
        if (nestedDestination instanceof ListStyleNameDestination)
            currentDestination.currentList.styleName = nestedDestination.value;
    }
    tryToHandleFinishOfListLevelDestination(nestedDestination) {
        const currentDestination = this.importer.destination;
        if (nestedDestination instanceof ListLevelDestination)
            currentDestination.currentList.levels.push(nestedDestination.level);
    }
    static onListKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        destination.currentList = new RtfNumberingList();
        importer.documentProperties.listTable.push(destination.currentList);
    }
    static onListIdKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (destination.currentList != null && hasParameter)
            destination.currentList.id = parameterValue;
    }
    static onListTemplatIdKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListStyleIdKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (destination.currentList != null && hasParameter)
            destination.currentList.parentStyleId = parameterValue;
    }
    static onListStyleNameKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new ListStyleNameDestination(importer);
    }
    static onListNameKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new ListNameDestination(importer);
    }
    static onListHybridKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        destination.currentList.numberingListType = RtfNumberingListType.Hybrid;
    }
    static onListRestartAtEachSectionKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListTemplateIdKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListSimpleKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListLevelKeyword(importer, _parameterValue, _hasParameter) {
        const destination = new ListLevelDestination(importer);
        importer.importers.character.characterFormatting.coreProperties.resetAllUse();
        importer.destination = destination;
    }
    processKeywordCore(keyword, parameterValue, hasParameter) {
        const translator = this.keywordHT[keyword];
        if (translator) {
            translator(this.importer, parameterValue, hasParameter);
            return true;
        }
        return false;
    }
    processCharCore(_ch) { }
    createClone() {
        const clone = new ListTableDestination(this.importer);
        clone.currentList = this.currentList;
        return clone;
    }
}
