export var HashAlgorithmType;
(function (HashAlgorithmType) {
    HashAlgorithmType[HashAlgorithmType["None"] = 0] = "None";
    HashAlgorithmType[HashAlgorithmType["Md2"] = 1] = "Md2";
    HashAlgorithmType[HashAlgorithmType["Md4"] = 2] = "Md4";
    HashAlgorithmType[HashAlgorithmType["Md5"] = 3] = "Md5";
    HashAlgorithmType[HashAlgorithmType["Sha1"] = 4] = "Sha1";
    HashAlgorithmType[HashAlgorithmType["Mac"] = 5] = "Mac";
    HashAlgorithmType[HashAlgorithmType["Ripemd"] = 6] = "Ripemd";
    HashAlgorithmType[HashAlgorithmType["Ripemd160"] = 7] = "Ripemd160";
    HashAlgorithmType[HashAlgorithmType["HMac"] = 9] = "HMac";
    HashAlgorithmType[HashAlgorithmType["Sha256"] = 12] = "Sha256";
    HashAlgorithmType[HashAlgorithmType["Sha384"] = 13] = "Sha384";
    HashAlgorithmType[HashAlgorithmType["Sha512"] = 14] = "Sha512";
})(HashAlgorithmType || (HashAlgorithmType = {}));
export var CryptProviderType;
(function (CryptProviderType) {
    CryptProviderType[CryptProviderType["RsaFull"] = 0] = "RsaFull";
    CryptProviderType[CryptProviderType["RsaAES"] = 1] = "RsaAES";
})(CryptProviderType || (CryptProviderType = {}));
export class DocumentProtectionProperties {
    constructor() {
        this.enforceProtection = false;
    }
    copyFrom(obj) {
        this.enforceProtection = obj.enforceProtection;
        this.protectionType = obj.protectionType;
        this.hashAlgorithmType = obj.hashAlgorithmType;
        this.cryptProviderType = obj.cryptProviderType;
        this.hashIterationCount = obj.hashIterationCount;
        this.passwordHash = obj.passwordHash ? new Uint8Array(obj.passwordHash) : null;
        this.passwordPrefix = obj.passwordPrefix ? new Uint8Array(obj.passwordPrefix) : null;
        this.word2003PasswordHash = obj.word2003PasswordHash ? new Uint8Array(obj.word2003PasswordHash) : null;
        this.openOfficePasswordHash = obj.openOfficePasswordHash ? new Uint8Array(obj.openOfficePasswordHash) : null;
    }
    clone() {
        const result = new DocumentProtectionProperties();
        result.copyFrom(this);
        return result;
    }
}
