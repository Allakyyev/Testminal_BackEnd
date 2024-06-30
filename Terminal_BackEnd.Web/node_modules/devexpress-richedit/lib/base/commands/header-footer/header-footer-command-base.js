import { ControlOptions } from '../../../core/model/options/control';
import { Section } from '../../../core/model/section/section';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class HeaderFooterCommandBase extends CommandBase {
    getState() {
        const isEnabled = this.isEnabled();
        return new SimpleCommandState(isEnabled, isEnabled ? this.getValue() : false);
    }
    isEnabled() {
        return super.isEnabled() &&
            ControlOptions.isEnabled(this.control.modelManager.richOptions.control.sections) &&
            ControlOptions.isEnabled(this.control.modelManager.richOptions.control.headersFooters) &&
            this.control.innerClientProperties.viewsSettings.isPrintLayoutView &&
            this.selection.activeSubDocument.isHeaderFooter();
    }
    getValue() {
        return null;
    }
    getSectionIndex(pageIndex) {
        const layoutPage = this.control.layoutFormatterManager.forceFormatPage(pageIndex);
        const lp = layoutPage ? layoutPage : this.control.layout.getLastValidPage();
        return lp ? Section.getPageSectionIndex(lp, this.control.modelManager.model.sections) : 0;
    }
    static getObjectsCache(isHeader, control) {
        return isHeader ? control.modelManager.model.headers : control.modelManager.model.footers;
    }
    static getSectionHeadersFooters(isHeader, section) {
        return isHeader ? section.headers : section.footers;
    }
}
