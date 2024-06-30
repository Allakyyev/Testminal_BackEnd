import { MapCreator } from '../../../../../base-utils/map-creator';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { ParagraphNumberingReferenceDestination } from '../../paragraph-properties/paragraph-numbering-reference-destination';
import { ParagraphPropertiesBaseDestination } from '../../paragraph-properties/paragraph-properties-base-destination';
export class StyleParagraphPropertiesDestination extends ParagraphPropertiesBaseDestination {
    constructor(data, styleDestination, paragraphProperties, tabs) {
        super(data, paragraphProperties, tabs);
        this.styleDestination = styleDestination;
    }
    get elementHandlerTable() {
        return StyleParagraphPropertiesDestination.handlerTable;
    }
    get numberingId() {
        return this.styleDestination.numberingId;
    }
    set numberingId(value) {
        this.styleDestination.numberingId = value;
    }
    get listLevelIndex() {
        return this.styleDestination.listLevelIndex;
    }
    set listLevelIndex(value) {
        this.styleDestination.listLevelIndex = value;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
}
StyleParagraphPropertiesDestination.handlerTable = new MapCreator(StringMapUtils.map(ParagraphPropertiesBaseDestination.handlerTable, (e) => e))
    .add('numPr', (data) => new ParagraphNumberingReferenceDestination(data, StyleParagraphPropertiesDestination.getThis(data)))
    .get();
