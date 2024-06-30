import { RichNumberConverter } from '../../../base-utils/number-converter';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { HashAlgorithmType } from '../options/document-protection';
import { MD5 } from './md5';
import { RIPEMD160 } from './ripemd160';
import { SHA1 } from './sha1';
import { SHA256 } from './sha256';
import { SHA384 } from './sha384';
import { SHA512 } from './sha512';
export class PasswordHashCodeCalculator {
    getBytes(val) {
        return new Uint8Array(new Uint32Array([val]).buffer);
    }
    calculateLegacyPasswordHash(password) {
        if (StringUtils.isNullOrEmpty(password))
            return null;
        return this.getBytes(this.calculateLegacyPasswordHashInt(password));
    }
    calculateLegacyPasswordHashInt(password) {
        if (StringUtils.isNullOrEmpty(password))
            return 0;
        const bytes = this.calculatePasswordBytes(password);
        const high = this.calculateKeyHighWord(bytes);
        const low = this.calculateKeyLowWord(bytes);
        return (((low << 24) & 0xFF000000) | ((low << 8) & 0x00FF0000) | ((high << 8) & 0x0000FF00) | ((high >> 8) & 0x000000FF));
    }
    calculatePasswordHash(password, prefix, hashCount, hashAlgorithmType) {
        const hashAlgorithm = this.createHashAlgorithm(hashAlgorithmType);
        if (hashAlgorithm)
            return this.calculatePasswordHashAfterDetectedAlgoritm(password, prefix, hashCount, hashAlgorithm);
        else {
            const legacyPasswordHash = this.calculateLegacyPasswordHashInt(password);
            return this.concatenate(new Uint8Array(0), legacyPasswordHash);
        }
    }
    generatePasswordPrefix(length) {
        const result = [];
        for (let i = 0; i < length; i++) {
            result[i] = MathUtils.getRandomInt(0, 1000);
        }
        return new Uint8Array(result);
    }
    createHashAlgorithm(hashAlgorithmType) {
        switch (hashAlgorithmType) {
            case HashAlgorithmType.Sha1:
                return new SHA1();
            case HashAlgorithmType.Sha256:
                return new SHA256();
            case HashAlgorithmType.Sha384:
                return new SHA384();
            case HashAlgorithmType.Sha512:
                return new SHA512();
            case HashAlgorithmType.Md5:
                return new MD5();
            case HashAlgorithmType.Ripemd160:
                return new RIPEMD160();
            case HashAlgorithmType.None:
            case HashAlgorithmType.Mac:
            case HashAlgorithmType.HMac:
            case HashAlgorithmType.Ripemd:
            case HashAlgorithmType.Md2:
            case HashAlgorithmType.Md4:
            default:
                return null;
        }
    }
    calculatePasswordHashAfterDetectedAlgoritm(password, prefix, hashCount, hashAlgorithm) {
        const legacyPasswordHash = this.calculateLegacyPasswordHashInt(password);
        return this.calculatePasswordHashCore(this.getUnicodeArray(RichNumberConverter.convertToHexBinary(legacyPasswordHash).toUpperCase()), prefix, hashCount, hashAlgorithm);
    }
    getUnicodeArray(base64) {
        let n = base64.length;
        const arr = new Uint8Array(n * 2);
        while (n--) {
            const index = n * 2;
            arr[index] = base64.charCodeAt(n);
            arr[index + 1] = 0;
        }
        return arr;
    }
    calculatePasswordHashCore(legacyPasswordHash, prefix, hashCount, hashAlgorithm) {
        let bytes = this.concatenateArrays(prefix, legacyPasswordHash);
        let wordArray = this.byteArrayToWordArray(bytes);
        for (let i = 0;;) {
            wordArray = hashAlgorithm.computeHash(wordArray);
            if (i < hashCount) {
                wordArray = this.concatenateArray(wordArray, i);
                i++;
            }
            else
                break;
        }
        return new Uint8Array(this.wordArrayToByteArray(wordArray, wordArray.length));
    }
    byteArrayToWordArray(bytes) {
        const result = [];
        for (let i = 0; i < bytes.length; i++)
            result[(i / 4) | 0] |= bytes[i] << (24 - 8 * i);
        return result;
    }
    wordToByteArray(word, length) {
        const bytes = [], xFF = 0xFF;
        if (length > 0)
            bytes.push(word >>> 24);
        if (length > 1)
            bytes.push((word >>> 16) & xFF);
        if (length > 2)
            bytes.push((word >>> 8) & xFF);
        if (length > 3)
            bytes.push(word & xFF);
        return bytes;
    }
    wordArrayToByteArray(wordArray, length) {
        length = wordArray.length * 4;
        const result = [];
        let bytes;
        let i = 0;
        while (length > 0) {
            bytes = this.wordToByteArray(wordArray[i], Math.min(4, length));
            length -= bytes.length;
            result.push(bytes);
            i++;
        }
        return [].concat.apply([], result);
    }
    concatenateArrays(b1, b2) {
        if (b1 == null)
            return b2;
        if (b2 == null)
            return b1;
        const result = new Uint8Array(b1.length + b2.length);
        result.set(b1);
        result.set(b2, b1.length);
        return result;
    }
    concatenate(bytes, num) {
        const countBytes = new Array(4);
        countBytes[3] = ((num & 0xFF000000) >> 24);
        countBytes[2] = ((num & 0x00FF0000) >> 16);
        countBytes[1] = ((num & 0x0000FF00) >> 8);
        countBytes[0] = ((num & 0x000000FF));
        const result = new Uint8Array(bytes.length + countBytes.length);
        result.set(bytes);
        result.set(countBytes, bytes.length);
        return result;
    }
    concatenateArray(wordArray, num) {
        const countBytes = new Array(4);
        countBytes[3] = (num & 0xFF000000) >> 24;
        countBytes[2] = (num & 0x00FF0000) >> 16;
        countBytes[1] = (num & 0x0000FF00) >> 8;
        countBytes[0] = (num & 0x000000FF);
        const newWordArray = this.byteArrayToWordArray(countBytes);
        return wordArray.concat(newWordArray);
    }
    static compareByteArrays(b1, b2) {
        if (b1 === b2)
            return true;
        if (b1 == null || b2 == null)
            return false;
        if (b1.length != b2.length)
            return false;
        const count = b1.length;
        for (let i = 0; i < count; i++)
            if (b1[i] != b2[i])
                return false;
        return true;
    }
    calculatePasswordBytes(password) {
        if (password.length > 15)
            password = password.substr(0, 15);
        const count = password.length;
        const bytes = new Array(count);
        for (let i = 0; i < count; i++) {
            const ch = password.charCodeAt(i);
            if ((ch & 0x00FF) == 0)
                bytes[i] = ch >> 8;
            else
                bytes[i] = ch & 0x00FF;
        }
        return bytes;
    }
    calculateKeyLowWord(bytes) {
        let result = 0;
        const count = bytes.length;
        for (let i = count - 1; i >= 0; i--)
            result = this.processLowWordByte(result, bytes[i]);
        result = this.processLowWordByte(result, count) ^ 0xCE4B;
        return result;
    }
    processLowWordByte(key, b) {
        return ((((key >> 14) & 0x0001) | ((key << 1) & 0x7FFF)) ^ b);
    }
    calculateKeyHighWord(bytes) {
        const count = bytes.length;
        let result = PasswordHashCodeCalculator.initialValues[count - 1];
        for (let i = 0; i < count; i++)
            result = this.processHighWordByte(result, bytes[i], 15 - (count - i));
        return result;
    }
    processHighWordByte(key, b, rowIndex) {
        let mask = 1;
        for (let i = 0; i <= 6; i++, mask <<= 1)
            if ((b & mask) != 0)
                key ^= PasswordHashCodeCalculator.encryptionMatrix[rowIndex][i];
        return key;
    }
}
PasswordHashCodeCalculator.initialValues = [0xE1F0, 0x1D0F, 0xCC9C, 0x84C0, 0x110C, 0x0E10, 0xF1CE, 0x313E,
    0x1872, 0xE139, 0xD40F, 0x84F9, 0x280C, 0xA96A, 0x4EC3];
PasswordHashCodeCalculator.encryptionMatrix = [
    [0xAEFC, 0x4DD9, 0x9BB2, 0x2745, 0x4E8A, 0x9D14, 0x2A09],
    [0x7B61, 0xF6C2, 0xFDA5, 0xEB6B, 0xC6F7, 0x9DCF, 0x2BBF],
    [0x4563, 0x8AC6, 0x05AD, 0x0B5A, 0x16B4, 0x2D68, 0x5AD0],
    [0x0375, 0x06EA, 0x0DD4, 0x1BA8, 0x3750, 0x6EA0, 0xDD40],
    [0xD849, 0xA0B3, 0x5147, 0xA28E, 0x553D, 0xAA7A, 0x44D5],
    [0x6F45, 0xDE8A, 0xAD35, 0x4A4B, 0x9496, 0x390D, 0x721A],
    [0xEB23, 0xC667, 0x9CEF, 0x29FF, 0x53FE, 0xA7FC, 0x5FD9],
    [0x47D3, 0x8FA6, 0x0F6D, 0x1EDA, 0x3DB4, 0x7B68, 0xF6D0],
    [0xB861, 0x60E3, 0xC1C6, 0x93AD, 0x377B, 0x6EF6, 0xDDEC],
    [0x45A0, 0x8B40, 0x06A1, 0x0D42, 0x1A84, 0x3508, 0x6A10],
    [0xAA51, 0x4483, 0x8906, 0x022D, 0x045A, 0x08B4, 0x1168],
    [0x76B4, 0xED68, 0xCAF1, 0x85C3, 0x1BA7, 0x374E, 0x6E9C],
    [0x3730, 0x6E60, 0xDCC0, 0xA9A1, 0x4363, 0x86C6, 0x1DAD],
    [0x3331, 0x6662, 0xCCC4, 0x89A9, 0x0373, 0x06E6, 0x0DCC],
    [0x1021, 0x2042, 0x4084, 0x8108, 0x1231, 0x2462, 0x48C4]
];
