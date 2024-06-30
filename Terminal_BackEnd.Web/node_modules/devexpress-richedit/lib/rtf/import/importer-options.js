import { InvalidDocumentMode } from '../../core/formats/utils/enums';
import { Log } from '../../core/rich-utils/debug/logger/base-logger/log';
export class RtfImporterOptions {
    constructor(throwInvalidFile = (reason) => { if (Log.isDebug)
        console.log(`LoadedFileIsIncorrect: ${reason}`); }) {
        this.invalidDocumentMode = InvalidDocumentMode.OpenAnyway;
        this.throwInvalidFile = throwInvalidFile;
    }
}
