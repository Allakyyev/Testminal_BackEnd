import { MapCreator } from '../../../../base-utils/map-creator';
import { ParagraphPropertyDescriptor } from '../../../../core/model/paragraph/paragraph-properties';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { PropertyDestination } from '../property-destination';
import { InnerSectionDestination } from '../section/inner-section-destination';
import { ParagraphStyleReferenceDestination } from '../style/paragraph/paragraph-style-reference-destination';
import { ParagraphNumberingReferenceDestination } from './paragraph-numbering-reference-destination';
import { ParagraphPropertiesBaseDestination } from './paragraph-properties-base-destination';
export class ParagraphPropertiesDestination extends ParagraphPropertiesBaseDestination {
    constructor(data, paragraphDestination, paragraphProperties, tabs) {
        super(data, paragraphProperties, tabs);
        this.paragraphDestination = paragraphDestination;
        data.subDocumentInfo.paragraphImporter.resetParMarkCharProperties()
            .resetParMarkCharacterStyle()
            .resetStyle();
        ListUtils.clear(tabs.tabsInfo);
    }
    get listLevelIndex() { return this.paragraphDestination.listLevelIndex; }
    set listLevelIndex(value) { this.paragraphDestination.listLevelIndex = value; }
    get numberingId() { return this.paragraphDestination.numberingId; }
    set numberingId(value) { this.paragraphDestination.numberingId = value; }
    get elementHandlerTable() {
        return ParagraphPropertiesDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
}
ParagraphPropertiesDestination.handlerTable = new MapCreator(StringMapUtils.map(ParagraphPropertiesBaseDestination.handlerTable, (e) => e))
    .add('pStyle', (data) => new ParagraphStyleReferenceDestination(data))
    .add('sectPr', (data) => {
    data.sectionImporter.shouldInsertSection = !data.subDocumentInfo.tableImporter.isInsideTable;
    return new InnerSectionDestination(data);
})
    .add('numPr', (data) => new ParagraphNumberingReferenceDestination(data, ParagraphPropertiesDestination.getThis(data)))
    .add('divId', (data) => new PropertyDestination(data, (value) => {
    const id = parseInt(value, 10);
    const webSettings = data.documentModel.webSettings;
    if (webSettings.id == id && webSettings.isBodyMarginsSet())
        ParagraphPropertiesDestination.getThis(data).paragraphProperties.setValue(ParagraphPropertyDescriptor.divId, id);
}))
    .get();
