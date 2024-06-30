import { InvalidDocumentMode } from '../../core/formats/utils/enums';
import { Log } from '../../core/rich-utils/debug/logger/base-logger/log';
export class ImporterOptions {
    constructor(throwInvalidFile = (reason) => { if (Log.isDebug)
        console.log(`LoadedFileIsIncorrect: ${reason}`); }) {
        this.invalidDocumentMode = InvalidDocumentMode.OpenAnyway;
        this.allowIntPercentage = false;
        this.createEmptyDocumentOnLoadError = true;
        this.ignoreDeletedText = true;
        this.ignoreInsertedText = true;
        this.ignoreComments = true;
        this.throwInvalidFile = throwInvalidFile;
    }
}
