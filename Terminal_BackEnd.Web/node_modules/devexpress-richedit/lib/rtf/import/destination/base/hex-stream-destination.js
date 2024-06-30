import { HexContentDestination } from './hex-content-destination';
export class HexStreamDestination extends HexContentDestination {
    constructor(importer, dataStream) {
        super(importer);
        this.dataStream = dataStream;
    }
    processBinCharCore(ch) {
        this.dataStream.push(ch);
    }
    getNumberArray() {
        let firstPosition = true;
        let currentValue = 0;
        const result = [];
        this.dataStream.forEach(char => {
            if (char == ' ')
                return;
            const hex = this.importer.hexToInt(char, false);
            if (firstPosition)
                currentValue = hex << 4;
            else {
                currentValue += hex;
                result.push(currentValue);
                currentValue = 0;
            }
            firstPosition = !firstPosition;
        });
        return result;
    }
}
