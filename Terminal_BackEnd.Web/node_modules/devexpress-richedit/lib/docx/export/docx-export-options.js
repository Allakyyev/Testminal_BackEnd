import { DocumentExporterOptions } from '../../core/formats/options';
export class DocxExportOptions extends DocumentExporterOptions {
    constructor() {
        super(...arguments);
        this.limitBookmarkNameTo40Chars = true;
        this.limitStyleNameTo253Chars = true;
        this.limitFontNameTo31Chars = true;
        this.allowAlternateStyleNames = true;
        this.exportCompatibilitySettings = true;
    }
}
