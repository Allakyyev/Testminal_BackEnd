import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class AltChunkImporter {
    constructor(data) {
        this.data = data;
        this.altChunkInfos = [];
    }
    insertAltChunks() {
        ListUtils.reverseForEach(this.altChunkInfos, (chunkInfo) => this.insertAltChunk(chunkInfo));
        this.altChunkInfos = [];
    }
    insertAltChunk(_chunkInfo) {
    }
}
