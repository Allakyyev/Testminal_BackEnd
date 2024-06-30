var _a;
import { __awaiter } from "tslib";
import * as JSZip from 'jszip';
import { XmlReader } from './xml-reader';
const JSZip2 = (_a = JSZip.default) !== null && _a !== void 0 ? _a : JSZip;
export class ArchiveData {
    constructor(options) {
        this.options = options;
        this.entryMap = {};
    }
    init(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            try {
                const zip = yield JSZip2.loadAsync(blob, {});
                zip.forEach((relativePath, zipEntry) => {
                    that.entryMap[relativePath] = zipEntry;
                });
            }
            catch (err) {
                console.log(`Cannot open file: ${err}`);
            }
        });
    }
    getXmlReader(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = this.entryMap[filePath];
            if (!entry)
                return null;
            try {
                return new XmlReader(yield entry.async('text'), this.options, filePath);
            }
            catch (err) {
                return null;
            }
        });
    }
    getBase64(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = this.entryMap[filePath];
            if (!entry)
                return null;
            try {
                return yield entry.async('base64');
            }
            catch (err) {
                console.log(`Cannot get base46: ${err}`);
                return null;
            }
        });
    }
}
