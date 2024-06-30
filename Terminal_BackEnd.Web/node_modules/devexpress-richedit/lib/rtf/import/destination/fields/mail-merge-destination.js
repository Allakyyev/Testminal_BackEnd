import { DestinationBase } from '../base/destination';
import { StringPropertyBaseDestination } from '../base/string-property-base-destination';
import { DestinationType } from '../utils/destination-type';
import { FieldMapDataDestination } from './field-map-data-destination';
export class MailMergeProperties {
}
export class MailMergeDestination extends DestinationBase {
    constructor() {
        super(...arguments);
        this.mmProps = new MailMergeProperties();
    }
    get destinationType() { return DestinationType.MailMergeDestination; }
    get controlCharHT() { return null; }
    static onConnectionStringKeyword(importer, _parameterValue, _hasParameter) {
        const properties = importer.destination.mmProps;
        importer.destination = new StringPropertyBaseDestination(importer, (value) => {
            properties.connectionString = value;
        });
    }
    static onQueryKeyword(importer, _parameterValue, _hasParameter) {
        const properties = importer.destination.mmProps;
        importer.destination = new StringPropertyBaseDestination(importer, (value) => {
            properties.query = value;
        });
    }
    static onDataSourceKeyword(importer, _parameterValue, _hasParameter) {
        const properties = importer.destination.mmProps;
        importer.destination = new StringPropertyBaseDestination(importer, (value) => {
            properties.dataSource = value;
        });
    }
    static onFieldMapDataKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new FieldMapDataDestination(importer);
    }
    createClone() {
        return new MailMergeDestination(this.importer);
    }
}
