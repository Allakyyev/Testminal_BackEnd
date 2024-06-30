import { PaperKind } from '../../../../core/model/section/paper-kind';
import { SectionColumnProperties } from '../../../../core/model/section/section-column-properties';
import { SectionProperties } from '../../../../core/model/section/section-properties';
import { RtfGeneralSectionInfo } from './general-section-info';
import { RtfMarginsInfo } from './margins-info';
import { PageNumberingInfo } from './page-numbering-info';
import { LineNumberingProperties } from '../../../../core/model/section/line-numbering-properties';
export class RtfSectionProperties {
    constructor() {
        this.coreProperties = new SectionProperties();
        this.margins = new RtfMarginsInfo();
        this.pageNumbering = new PageNumberingInfo();
        this.generalSectionInfo = new RtfGeneralSectionInfo();
        this.lineNumbering = new LineNumberingProperties();
        this.restartPageNumbering = false;
        this.drawVerticalSeparator = false;
        this.paperKind = PaperKind.A4;
        this.currentColumnIndex = 0;
    }
    ensureCurrentColumnExists() {
        while (this.coreProperties.columnsInfo.length <= this.currentColumnIndex)
            this.coreProperties.columnsInfo.push(new SectionColumnProperties(1, 1));
    }
    setCurrentColumnSpace(value) {
        this.ensureCurrentColumnExists();
        this.coreProperties.columnsInfo[this.currentColumnIndex].space = value;
    }
    setCurrentColumnWidth(value) {
        this.ensureCurrentColumnExists();
        this.coreProperties.columnsInfo[this.currentColumnIndex].width = value;
    }
    validatePaperKind() {
    }
    clone() {
        const obj = new RtfSectionProperties();
        obj.copyFrom(this);
        return obj;
    }
    copyFrom(obj) {
        this.coreProperties = obj.coreProperties.clone();
        this.margins.copyFrom(obj.margins);
        this.pageNumbering.copyFrom(obj.pageNumbering);
        this.generalSectionInfo.copyFrom(obj.generalSectionInfo);
        this.lineNumbering.copyFrom(obj.lineNumbering);
        this.restartPageNumbering = obj.restartPageNumbering;
        this.currentColumnIndex = obj.currentColumnIndex;
        this.drawVerticalSeparator = obj.drawVerticalSeparator;
    }
}
