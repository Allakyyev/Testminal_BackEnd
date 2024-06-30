import { StringValueDestination } from '../base/string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class ListLevelTextDestination extends StringValueDestination {
    constructor() {
        super(...arguments);
        this.levelTemplateId = 0;
    }
    get destinationType() { return DestinationType.ListLevelTextDestination; }
    get controlCharHT() { return null; }
    createEmptyClone() {
        return new ListLevelTextDestination(this.importer);
    }
    createClone() {
        const clone = super.createClone();
        clone.levelTemplateId = this.levelTemplateId;
        return clone;
    }
    beforeNestedGroupFinished(nestedDestination) {
        super.beforeNestedGroupFinished(nestedDestination);
        this._value = nestedDestination.value;
    }
    static onListLevelTemplateIdKeyword(importer, parameterValue, hasParameter) {
        importer.destination.levelTemplateId = hasParameter ?
            ListLevelTextDestination.fixLevelTemplateId(parameterValue) : 0;
    }
    static fixLevelTemplateId(levelTemplateId) {
        return Math.abs(levelTemplateId);
    }
}
