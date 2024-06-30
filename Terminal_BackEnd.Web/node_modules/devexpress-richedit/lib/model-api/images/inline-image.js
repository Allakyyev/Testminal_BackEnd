import { ImageApi } from './image';
import { WrapTypeApi } from './image-enums';
export class InlineImageApi extends ImageApi {
    constructor(processor, subDocument, position, run) {
        super(processor, subDocument, position, run);
    }
    getWrapType() {
        return WrapTypeApi.Inline;
    }
    ;
}
