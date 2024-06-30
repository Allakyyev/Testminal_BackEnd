import { DestinationBase } from '../base/destination';
import { LegacyPasswordHashDestination } from '../protection/legacy-password-hash-destination';
import { PasswordHashDestination } from '../protection/password-hash-destination';
import { DestinationType } from '../utils/destination-type';
export class InfoDestination extends DestinationBase {
    get destinationType() { return DestinationType.InfoDestination; }
    ;
    get controlCharHT() { return null; }
    createClone() {
        return new InfoDestination(this.importer);
    }
    static onLegacyPasswordHash(importer, _parameterValue, _hasParameter) {
        importer.destination = new LegacyPasswordHashDestination(importer);
    }
    static onPasswordHash(importer, _parameterValue, _hasParameter) {
        importer.destination = new PasswordHashDestination(importer);
    }
    static onCategoryKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onCreatedKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onDescriptionKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onCreatorKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onKeywordsKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onLastModifiedByKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onLastPrintedKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onModifiedKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onRevisionKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onSubjectKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onTitleKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static getStringDocumentPropertyDestinationBase(_importer, _setProperty) {
    }
    static getDateTimeDocumentPropertyDestinationBase(_importer, _setProperty) {
    }
}
