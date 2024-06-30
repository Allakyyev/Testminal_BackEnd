import { Log } from '../../../core/rich-utils/debug/logger/base-logger/log';
import { LogSource } from '../../../core/rich-utils/debug/logger/base-logger/log-source';
import { HtmlTagImporterBase } from './base';
export class HtmlUndefinedTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "NoTag";
    }
    importBefore() {
        Log.print(LogSource.HtmlImporter, "HtmlUndefinedTagImporter.importBefore undefined tag", this.element);
    }
    isImportChilds() {
        return !!this.importer.currElementChilds.length;
    }
    importAfter() {
    }
}
