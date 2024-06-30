import { ColorHelper } from '../core/model/color/color';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
export class PdfCharacterPropertiesExporter {
    exportCharacterProperties(doc, box, pos, size, needUnderlineAndStrikeout) {
        const colorProps = box.colorInfo;
        let textColor = colorProps.textColor;
        const foregroundColor = colorProps.foregroundColor;
        if (box.hyperlinkTip)
            doc.link(pos.x, pos.y, size.width, size.height, box.hyperlinkTip);
        if (foregroundColor != ColorHelper.AUTOMATIC_COLOR) {
            doc.save();
            doc.rect(pos.x, pos.y + 1, size.width, size.height - 2).fill(ColorUtils.colorToHash(foregroundColor));
            doc.restore();
        }
        if (textColor == ColorHelper.AUTOMATIC_COLOR)
            textColor = ColorHelper.BLACK_COLOR;
        doc.fillColor(ColorUtils.colorToHash(textColor));
        if (needUnderlineAndStrikeout && box.characterProperties.fontStrikeoutType && box.characterProperties.fontUnderlineType)
            doc.strike(pos.x, pos.y, size.width, size.height, { color: ColorUtils.colorToHash(textColor) });
    }
}
