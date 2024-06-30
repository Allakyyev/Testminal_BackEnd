import { CodePageCharacterDecoder } from './code-page-character-decoder';
import { CodePages } from './code-pages';
export class SkipCharacterDecoder extends CodePageCharacterDecoder {
    constructor() {
        super(CodePages.default);
    }
    processChar(_importer, _ch) {
    }
    flush(_importer) {
    }
}
