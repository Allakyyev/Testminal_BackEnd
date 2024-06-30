import { SectionPropertyDescriptor } from '../../../core/model/section/section-property-descriptor';
import { ChangeSectionPropertiesCommandBase } from './change-section-properties-command-base';
export class ChangeHeaderOffsetCommand extends ChangeSectionPropertiesCommandBase {
    getDescriptor() {
        return SectionPropertyDescriptor.headerOffset;
    }
}
export class ChangeHeaderOffsetRibbonCommand extends ChangeHeaderOffsetCommand {
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
