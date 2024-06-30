import { HexStreamDestination } from '../base/hex-stream-destination';
export class LegacyPasswordHashDestination extends HexStreamDestination {
    constructor(importer, dataStream = []) {
        super(importer, dataStream);
    }
    createClone() {
        return new LegacyPasswordHashDestination(this.importer, this.dataStream);
    }
    afterPopRtfState() {
        const value = this.getNumberArray();
        const result = [];
        for (let i = 3; i >= 0; i--)
            result.push(value[i]);
        this.importer.documentModel.documentProtectionProperties.word2003PasswordHash = new Uint8Array(result);
    }
}
