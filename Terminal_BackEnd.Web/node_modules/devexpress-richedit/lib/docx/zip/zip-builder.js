var _a;
import * as JSZip from 'jszip';
import { ContentType } from '../utils/constants';
const JSZip2 = (_a = JSZip.default) !== null && _a !== void 0 ? _a : JSZip;
export class ZipBuilder {
    constructor() {
        this.zip = new JSZip2();
        this.folders = {};
    }
    addFile(filePath, writer) {
        this.zip.file(filePath, '<?xml version="1.0" encoding="utf-8"?>\n' + writer.convertToString(), { createFolders: true });
    }
    addBase64(filePath, base64) {
        this.zip.file(filePath, base64, { createFolders: true, base64: true });
    }
    generateBlob(callback) {
        this.zip
            .generateAsync({
            type: 'blob',
            mimeType: ContentType.document,
            compression: 'DEFLATE',
            compressionOptions: {
                level: 1,
            },
        })
            .then(callback);
    }
    generateBase64(callback) {
        this.zip
            .generateAsync({
            type: 'base64',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 1,
            },
        })
            .then(callback);
    }
}
