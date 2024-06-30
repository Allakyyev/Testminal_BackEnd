import { MapCreator } from '../../../../base-utils/map-creator';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { RunPropertiesBaseDestination } from '../character-properties/run-properties-base-destination';
import { ElementDestination } from '../destination';
import { TabsDestination } from '../tabs/tabs-destination';
import { ParagraphMarkRunStyleReferenceDestination } from './paragraph-mark-run-style-reference-destination';
import { ParagraphBordersDestination } from './properties/borders/borders-destination';
import { ContextualSpacingDestination } from './properties/contextual-spacing-destination';
import { KeepLinesTogetherDestination } from './properties/keep-lines-together-destination';
import { KeepWithNextDestination } from './properties/keep-with-next-destination';
import { OutlineLevelDestination } from './properties/outline-level-destination';
import { PageBreakBeforeDestination } from './properties/page-break-before-destination';
import { ParagraphAlignmentDestination } from './properties/paragraph-alignment-destination';
import { ParagraphIndentsDestination } from './properties/paragraph-indents-destination';
import { ParagraphRightToLeftDestination } from './properties/paragraph-right-to-left-destination';
import { ParagraphShadingDestination } from './properties/paragraph-shading-destination';
import { ParagraphSpacingDestination } from './properties/paragraph-spacing-destination';
import { SuppressHyphenationDestination } from './properties/suppress-hyphenation-destination';
import { SuppressLineNumbersDestination } from './properties/suppress-line-numbers-destination';
import { WidowOrphanControlDestination } from './properties/widow-orphan-control-destination';
export class ParagraphPropertiesBaseDestination extends ElementDestination {
    constructor(data, paragraphProperties, tabs) {
        super(data);
        this.paragraphProperties = paragraphProperties;
        this.tabs = tabs;
    }
    get elementHandlerTable() {
        return ParagraphPropertiesBaseDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static getParagraphProperties(data) {
        return ParagraphPropertiesBaseDestination.getThis(data).paragraphProperties;
    }
}
ParagraphPropertiesBaseDestination.handlerTable = new MapCreator()
    .add('rPr', (data) => {
    data.subDocumentInfo.paragraphImporter.resetParMarkCharProperties();
    return new ParagraphMarkRunPropertiesDestination(data, data.subDocumentInfo.paragraphImporter.parMarkCharProperties);
})
    .add('spacing', (data) => new ParagraphSpacingDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('ind', (data) => new ParagraphIndentsDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('suppressAutoHyphens', (data) => new SuppressHyphenationDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('suppressLineNumbers', (data) => new SuppressLineNumbersDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('supressLineNumbers', (data) => new SuppressLineNumbersDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('contextualSpacing', (data) => new ContextualSpacingDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('bidi', (data) => new ParagraphRightToLeftDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('pageBreakBefore', (data) => new PageBreakBeforeDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('keepNext', (data) => new KeepWithNextDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('keepLines', (data) => new KeepLinesTogetherDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('widowControl', (data) => new WidowOrphanControlDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('jc', (data) => new ParagraphAlignmentDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('tabs', (data) => new TabsDestination(data, ParagraphPropertiesBaseDestination.getThis(data).tabs))
    .add('outlineLvl', (data) => new OutlineLevelDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('shd', (data) => new ParagraphShadingDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .add('pBdr', (data) => new ParagraphBordersDestination(data, ParagraphPropertiesBaseDestination.getParagraphProperties(data)))
    .get();
export class ParagraphMarkRunPropertiesDestination extends RunPropertiesBaseDestination {
    get elementHandlerTable() {
        return ParagraphMarkRunPropertiesDestination.handlerTable;
    }
}
ParagraphMarkRunPropertiesDestination.handlerTable = new MapCreator(StringMapUtils.map(RunPropertiesBaseDestination.handlerTable, (e) => e))
    .add('rStyle', (data, _reader) => new ParagraphMarkRunStyleReferenceDestination(data))
    .get();
