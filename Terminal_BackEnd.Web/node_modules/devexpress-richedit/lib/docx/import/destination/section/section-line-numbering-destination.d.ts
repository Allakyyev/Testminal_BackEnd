import { SectionProperties } from '../../../../core/model/section/section-properties';
import { LeafElementDestination } from '../destination';
import { XmlReader } from '../../../zip/xml-reader';
export declare class SectionLineNumberingDestination extends LeafElementDestination {
    protected get secProps(): SectionProperties;
    processElementOpen(reader: XmlReader): Promise<void>;
}
//# sourceMappingURL=section-line-numbering-destination.d.ts.map