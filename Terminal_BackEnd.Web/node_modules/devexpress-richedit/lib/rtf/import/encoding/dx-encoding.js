import { MapCreator } from '../../../base-utils/map-creator';
import { CodePages } from './code-pages';
export class DXEncoding {
    static codePageFromCharset(charset) {
        const codePage = DXEncoding.charsetToCodepageMapping[charset];
        if (codePage)
            return codePage;
        return CodePages.default;
    }
}
DXEncoding.charsetToCodepageMapping = new MapCreator()
    .add(0, CodePages.Ansi)
    .add(134, CodePages.GB2315)
    .add(129, CodePages.Hangul)
    .add(136, CodePages.Big5)
    .add(161, CodePages.Greek)
    .add(162, CodePages.Turkis)
    .add(163, CodePages.Vietnamese)
    .add(177, CodePages.Hebrew)
    .add(178, CodePages.Arabic)
    .add(186, CodePages.Baltic)
    .add(204, CodePages.Russian)
    .add(238, CodePages.default)
    .add(77, CodePages.MacRoman)
    .add(89, CodePages.MacRussian)
    .get();
