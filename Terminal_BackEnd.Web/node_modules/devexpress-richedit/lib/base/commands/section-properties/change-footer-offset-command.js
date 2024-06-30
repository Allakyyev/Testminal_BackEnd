import { SectionPropertyDescriptor } from '../../../core/model/section/section-property-descriptor';
import { ChangeSectionPropertiesCommandBase } from './change-section-properties-command-base';
export class ChangeFooterOffsetCommand extends ChangeSectionPropertiesCommandBase {
    getDescriptor() {
        return SectionPropertyDescriptor.footerOffset;
    }
}
export class ChangeFooterOffsetRibbonCommand extends ChangeFooterOffsetCommand {
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.control.uiUnitConverter.UIToTwips(parameter);
    }
    getStateValue(options = this.convertToCommandOptions(null)) {
        return this.control.uiUnitConverter.twipsToUI(super.getStateValue(options));
    }
    isEnabled(options) {
        return super.isEnabled(options) &&
            this.control.innerClientProperties.viewsSettings.isPrintLayoutView &&
            this.selection.activeSubDocument.isHeaderFooter();
    }
}
