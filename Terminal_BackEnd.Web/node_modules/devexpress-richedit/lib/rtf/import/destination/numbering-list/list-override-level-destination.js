import { RtfListOverrideLevel } from '../../model/numbering-lists/rtf-list-override-level';
import { DestinationBase } from '../base/destination';
import { DestinationType } from '../utils/destination-type';
import { ListLevelDestination } from './list-level-destination';
export class ListOverrideLevelDestination extends DestinationBase {
    constructor() {
        super(...arguments);
        this.overrideLevel = new RtfListOverrideLevel();
    }
    get destinationType() { return DestinationType.ListOverrideLevelDestination; }
    get controlCharHT() { return null; }
    static onListOverrideFormatKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        destination.overrideLevel.overrideFormat = true;
    }
    static onListOverrideStartAtKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        destination.overrideLevel.overrideStartAt = true;
    }
    static onListOverrideStartAtValueKeyword(importer, parameterValue, hasParameter) {
        const destination = importer.destination;
        if (hasParameter)
            destination.overrideLevel.startAt = parameterValue;
        else
            destination.overrideLevel.startAt = 0;
    }
    static onListOverrideListLevelKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        if (destination.overrideLevel.overrideFormat) {
            const newDestination = new ListLevelDestination(importer);
            importer.destination = newDestination;
            destination.overrideLevel.level = newDestination.level;
        }
    }
    createClone() {
        const clone = new ListOverrideLevelDestination(this.importer);
        clone.overrideLevel = this.overrideLevel;
        return clone;
    }
}
