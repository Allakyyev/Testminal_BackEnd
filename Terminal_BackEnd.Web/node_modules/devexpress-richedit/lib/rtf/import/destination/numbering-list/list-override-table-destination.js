import { RtfNumberingListOverride } from '../../model/numbering-lists/rtf-numbering-list-override';
import { DestinationBase } from '../base/destination';
import { DestinationType } from '../utils/destination-type';
import { ListOverrideLevelDestination } from './list-override-level-destination';
export class ListOverrideTableDestination extends DestinationBase {
    get destinationType() { return DestinationType.ListOverrideTableDestination; }
    get controlCharHT() { return null; }
    static onListOverrideKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        destination.currentOverride = new RtfNumberingListOverride();
        importer.documentProperties.listOverrideTable.push(destination.currentOverride);
    }
    static onListOverrideListIdKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (destination.currentOverride != null && hasParameter)
            destination.currentOverride.listId = parameterValue;
    }
    static onListOverrideCountKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onListOverrideIdKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (destination.currentOverride != null && hasParameter)
            destination.currentOverride.id = parameterValue;
    }
    static onListOverrideLevelKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        const newDestination = new ListOverrideLevelDestination(importer);
        importer.destination = newDestination;
        if (destination.currentOverride != null)
            destination.currentOverride.levels.push(newDestination.overrideLevel);
    }
    createClone() {
        const clone = new ListOverrideTableDestination(this.importer);
        clone.currentOverride = this.currentOverride;
        return clone;
    }
}
