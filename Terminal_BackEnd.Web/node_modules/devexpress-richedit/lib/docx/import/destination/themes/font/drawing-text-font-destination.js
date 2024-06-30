import { __awaiter } from "tslib";
import { DrawingTextFont } from '../../../../../core/model/drawing/drawing-text-font';
import { Constants } from '@devexpress/utils/lib/constants';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LeafElementDestination } from '../../destination';
export class DrawingTextFontDestination extends LeafElementDestination {
    constructor(data, textFont) {
        super(data);
        this.textFont = textFont;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeface = this.data.readerHelper.readAttribute(reader, 'typeface');
            if (!StringUtils.isNullOrEmpty(typeface))
                this.textFont.typeface = typeface;
            const panose = this.data.readerHelper.readAttribute(reader, 'panose');
            if (!StringUtils.isNullOrEmpty(panose) && panose.length != 20)
                this.data.options.throwInvalidFile('Invalid fonts');
            if (!StringUtils.isNullOrEmpty(panose))
                this.textFont.panose = panose;
            const pitchFamily = this.data.readerHelper.getIntegerValue(reader, 'pitchFamily', DrawingTextFont.DefaultPitchFamily);
            if (Math.abs(pitchFamily) > Constants.MAX_BYTE)
                this.data.options.throwInvalidFile('Invalid fonts');
            this.textFont.pitchFamily = pitchFamily;
            const charset = this.data.readerHelper.getIntegerValue(reader, 'charset', DrawingTextFont.DefaultCharset);
            if (Math.abs(charset) > Constants.MAX_BYTE)
                this.data.options.throwInvalidFile('Invalid fonts');
            this.textFont.charset = charset;
        });
    }
}
