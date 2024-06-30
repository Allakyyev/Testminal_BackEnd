import { PaperKind } from '../../../../core/model/section/paper-kind';
import { SectionProperties } from '../../../../core/model/section/section-properties';
import { RtfGeneralSectionInfo } from './general-section-info';
import { RtfMarginsInfo } from './margins-info';
import { PageNumberingInfo } from './page-numbering-info';
import { LineNumberingProperties } from '../../../../core/model/section/line-numbering-properties';
export declare class RtfSectionProperties {
    coreProperties: SectionProperties;
    readonly margins: RtfMarginsInfo;
    readonly pageNumbering: PageNumberingInfo;
    readonly generalSectionInfo: RtfGeneralSectionInfo;
    readonly lineNumbering: LineNumberingProperties;
    restartPageNumbering: boolean;
    drawVerticalSeparator: boolean;
    paperKind: PaperKind;
    currentColumnIndex: number;
    constructor();
    protected ensureCurrentColumnExists(): void;
    setCurrentColumnSpace(value: number): void;
    setCurrentColumnWidth(value: number): void;
    validatePaperKind(): void;
    clone(): RtfSectionProperties;
    copyFrom(obj: RtfSectionProperties): void;
}
//# sourceMappingURL=rtf-section-properties.d.ts.map