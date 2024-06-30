import { BorderLineStyle } from '../core/model/borders/enums';
import { ColorHelper } from '../core/model/color/color';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
export class PdfLayoutTableColumnInfoExporter {
    constructor(doc) {
        this.doc = doc;
    }
    export(tableColumnInfo, columnOffset) {
        this.doc.save();
        const pos = Point.plus(columnOffset, tableColumnInfo);
        for (let row of tableColumnInfo.tableRows) {
            for (let cell of row.backgroundInfos) {
                if (cell.color != ColorHelper.AUTOMATIC_COLOR && ColorHelper.getCssStringInternal(cell.color) != 'transparent') {
                    const backgroundPos = new Point(pos.x + cell.x, pos.y + cell.y).applyConverter(UnitConverter.pixelsToPointsF);
                    this.doc.save();
                    this.doc.rect(backgroundPos.x, backgroundPos.y, UnitConverter.pixelsToPointsF(cell.width), UnitConverter.pixelsToPointsF(cell.height))
                        .fill(ColorUtils.colorToHash(cell.color));
                    this.doc.restore();
                }
            }
        }
        for (let border of tableColumnInfo.horizontalBorders)
            this.exportHorizontalBorder(border, pos);
        for (let border of tableColumnInfo.verticalBorders)
            this.exportVerticalBorder(border, pos);
        this.doc.restore();
    }
    isRenderTableBorder(borderInfo) {
        return borderInfo && borderInfo.style != BorderLineStyle.None && borderInfo.style != BorderLineStyle.Nil;
    }
    exportHorizontalBorder(border, tblPos) {
        const borderInfo = border.borderInfo;
        if (this.isRenderTableBorder(borderInfo)) {
            const brdPos = Point.plus(tblPos, new Point(border.xPos, border.yPos)).applyConverter(UnitConverter.pixelsToPointsF);
            this.drawHorizontalLine(brdPos, UnitConverter.pixelsToPointsF(border.length), UnitConverter.pixelsToPointsF(borderInfo.width), borderInfo.color);
        }
    }
    exportVerticalBorder(border, tblPos) {
        const borderInfo = border.borderInfo;
        if (this.isRenderTableBorder(borderInfo)) {
            const brdPos = Point.plus(tblPos, new Point(border.xPos, border.yPos)).applyConverter(UnitConverter.pixelsToPointsF);
            this.drawVerticalLine(brdPos, UnitConverter.pixelsToPointsF(borderInfo.width), UnitConverter.pixelsToPointsF(border.length), borderInfo.color);
        }
    }
    drawHorizontalLine(pos, length, width, color) {
        this.doc.rect(pos.x, pos.y - width / 2, length, width).fill(ColorUtils.colorToHash(color));
    }
    drawVerticalLine(pos, width, height, color) {
        this.doc.rect(pos.x, pos.y, width, height).fill(ColorUtils.colorToHash(color));
    }
}
