import { CryptProviderType } from '../../../../core/model/options/document-protection';
import { HexStreamDestination } from '../base/hex-stream-destination';
export class PasswordHashDestination extends HexStreamDestination {
    constructor(importer, dataStream = []) {
        super(importer, dataStream);
    }
    createClone() {
        return new PasswordHashDestination(this.importer, this.dataStream);
    }
    afterPopRtfState() {
        const uint8Array = new Uint8Array(this.getNumberArray());
        const uint32Array = new Uint32Array(uint8Array.buffer);
        const properties = this.importer.documentModel.documentProtectionProperties;
        properties.cryptProviderType = uint32Array[2] == 24 ? CryptProviderType.RsaAES : CryptProviderType.RsaFull;
        properties.hashAlgorithmType = (uint32Array[3] - 0x8000);
        properties.hashIterationCount = uint32Array[4];
        const passwordHashLength = uint32Array[5];
        const passwordPrefixLength = uint32Array[6];
        const startPasswordHashIndex = 40;
        properties.passwordHash = uint8Array.subarray(startPasswordHashIndex, startPasswordHashIndex + passwordHashLength);
        const startpasswordPrefixIndex = startPasswordHashIndex + passwordHashLength;
        properties.passwordPrefix = uint8Array.subarray(startpasswordPrefixIndex, startpasswordPrefixIndex + passwordPrefixLength);
    }
}
