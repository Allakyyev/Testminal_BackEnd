import { __awaiter } from "tslib";
import { DocumentProtectionType } from '../../../../core/model/json/enums/json-document-enums';
import { CryptProviderType, DocumentProtectionProperties } from '../../../../core/model/options/document-protection';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LeafElementDestination } from '../destination';
export class Base64Binary {
    static decodeArrayBuffer(base64) {
        const arrayBuffer = new ArrayBuffer((base64.length / 4) * 3);
        Base64Binary.decode(base64, arrayBuffer);
        return arrayBuffer;
    }
    static decode(base64, arrayBuffer = null) {
        let input = Base64Binary.removePaddingChars(base64);
        input = Base64Binary.removePaddingChars(input);
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        const bytes = input.length / 4 * 3;
        const uarray = arrayBuffer ? new Uint8Array(arrayBuffer) : new Uint8Array(bytes);
        for (let i = 0, j = 0; i < bytes; i += 3) {
            const enc1 = Base64Binary._keyStr.indexOf(input.charAt(j++));
            const enc2 = Base64Binary._keyStr.indexOf(input.charAt(j++));
            const enc3 = Base64Binary._keyStr.indexOf(input.charAt(j++));
            const enc4 = Base64Binary._keyStr.indexOf(input.charAt(j++));
            const chr1 = (enc1 << 2) | (enc2 >> 4);
            const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            const chr3 = ((enc3 & 3) << 6) | enc4;
            uarray[i] = chr1;
            if (enc3 != 64)
                uarray[i + 1] = chr2;
            if (enc4 != 64)
                uarray[i + 2] = chr3;
        }
        return uarray;
    }
    static getBitesFromInt(num) {
        const arr = new ArrayBuffer(4);
        const view = new DataView(arr);
        view.setInt32(0, num, false);
        return new Uint8Array(arr);
    }
    static removePaddingChars(input) {
        const lkey = Base64Binary._keyStr.indexOf(input.charAt(input.length - 1));
        return lkey == 64 ? input.substring(0, input.length - 1) : input;
    }
}
Base64Binary._keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export class DocumentProtectionDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.data.documentModel.documentProtectionProperties =
                new DocumentProtectionProperties();
            const passHash = this.data.readerHelper.readAttribute(reader, 'hash');
            if (!StringUtils.isNullOrEmpty(passHash))
                properties.passwordHash = Base64Binary.decode(passHash);
            const salt = this.data.readerHelper.readAttribute(reader, 'salt');
            if (!StringUtils.isNullOrEmpty(salt))
                properties.passwordPrefix = Base64Binary.decode(salt);
            const unprotectPassword = this.data.readerHelper.readAttribute(reader, 'unprotectPassword');
            if (!StringUtils.isNullOrEmpty(unprotectPassword)) {
                if (unprotectPassword != '00000000') {
                    let hash = parseInt(unprotectPassword, 16);
                    if (!isNaN(hash)) {
                        const value = hash;
                        hash = ((value << 24) & 0xFF000000) | ((value << 8) & 0x00FF0000) | ((value >> 8) & 0x0000FF00) | ((value >> 24) & 0x000000FF);
                        properties.word2003PasswordHash = Base64Binary.getBitesFromInt(hash);
                    }
                }
            }
            const cryptProviderType = this.data.readerHelper.readAttribute(reader, "cryptProviderType");
            if (!StringUtils.isNullOrEmpty(cryptProviderType))
                properties.cryptProviderType = cryptProviderType == "rsaAES" ? CryptProviderType.RsaAES : CryptProviderType.RsaFull;
            const edit = this.data.readerHelper.readAttribute(reader, 'edit');
            if (edit == 'readOnly' || edit == 'read-only')
                properties.protectionType = DocumentProtectionType.ReadOnly;
            if (edit == 'comments')
                properties.protectionType = DocumentProtectionType.AllowComments;
            properties.enforceProtection = this.data.readerHelper.getWpSTOnOffValue(reader, 'enforcement', false);
            properties.hashAlgorithmType = this.data.readerHelper.getWpSTIntegerValue(reader, 'cryptAlgorithmSid', 0);
            properties.hashIterationCount = this.data.readerHelper.getWpSTIntegerValue(reader, 'cryptSpinCount', 1);
        });
    }
}
