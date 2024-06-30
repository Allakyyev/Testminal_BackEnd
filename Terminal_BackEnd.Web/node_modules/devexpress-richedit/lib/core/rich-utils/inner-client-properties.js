import { ViewSettings } from '../view-settings/views-settings';
export class InnerClientProperties {
    constructor(viewsSettings) {
        this.showHiddenSymbols = false;
        this.showTableGridLines = false;
        this.viewsSettings = new ViewSettings();
        this.viewsSettings.copyFrom(viewsSettings);
    }
}
