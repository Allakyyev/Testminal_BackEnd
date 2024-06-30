import { BorderLineStyle } from '../../../core/model/borders/enums';
import { ColorModelInfoCache } from '../../../core/model/caches/hashed-caches/color-model-info-cache';
import { TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { Errors } from '@devexpress/utils/lib/errors';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { RtfContentExporter } from './rtf-content-exporter';
export class RtfPropertiesExporter {
    constructor(documentModel, rtfExportHelper, rtfBuilder) {
        this.documentModel = documentModel;
        this.rtfExportHelper = rtfExportHelper;
        this.rtfBuilder = rtfBuilder;
    }
    writeBoolCommand(command, value) {
        if (value)
            this.rtfBuilder.writeCommand(command);
        else
            this.rtfBuilder.writeIntegerCommand(command, 0);
    }
    writeBorderProperties(border) {
        const defaultBorder = this.documentModel.defaultTableCellProperties.borders.bottomBorder;
        this.writeBorderStyle(border.style);
        if (border.style == BorderLineStyle.Nil)
            return;
        this.writeBorderWidth(border.width, defaultBorder.width);
        if (border.offset != defaultBorder.offset)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.BorderSpace, border.offset);
        if (!defaultBorder.color.equals(border.color) && !ColorModelInfoCache.defaultItem.equals(border.color)) {
            const colorIndex = this.rtfExportHelper.getColorIndex(border.color);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.BorderColor, colorIndex);
        }
        if (border.frame != defaultBorder.frame)
            this.rtfBuilder.writeCommand(RtfExportSR.BorderFrame);
        if (border.shadow != defaultBorder.shadow)
            this.rtfBuilder.writeCommand(RtfExportSR.BorderShadow);
    }
    writeBorderWidth(value, defaultValue) {
        if (value == defaultValue)
            return;
        if (value > 255) {
            value = Math.min((value / 2), 255);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.BorderWidth, value);
            this.rtfBuilder.writeCommand(RtfExportSR.BorderDoubleWidth);
        }
        else
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.BorderWidth, value);
    }
    writeBorderStyle(value) {
        if (value != BorderLineStyle.Single) {
            let borderCommand = RtfContentExporter.borderLineStyles[value];
            if (borderCommand)
                this.rtfBuilder.writeCommand(borderCommand);
            else {
            }
        }
        else
            this.rtfBuilder.writeCommand(RtfExportSR.BorderSingleWidth);
    }
    writeWidthUnit(unit, typeKeyword, valueKeyword, writeValueAnyway = false) {
        const defaultWidthUnit = TableWidthUnit.createDefault();
        if (unit.type != defaultWidthUnit.type) {
            let val = unit.value;
            switch (unit.type) {
                case TableWidthUnitType.ModelUnits:
                    this.rtfBuilder.writeIntegerCommand(typeKeyword, TableWidthUnitType.ModelUnits);
                    break;
                case TableWidthUnitType.FiftiethsOfPercent:
                    this.rtfBuilder.writeIntegerCommand(typeKeyword, TableWidthUnitType.FiftiethsOfPercent);
                    break;
                case TableWidthUnitType.Auto:
                    this.rtfBuilder.writeIntegerCommand(typeKeyword, TableWidthUnitType.Auto);
                    break;
                case TableWidthUnitType.Nil:
                    this.rtfBuilder.writeIntegerCommand(typeKeyword, TableWidthUnitType.Nil);
                    break;
                default:
                    throw new Error(Errors.InternalException);
            }
            if (unit.value != defaultWidthUnit.value || writeValueAnyway)
                this.rtfBuilder.writeIntegerCommand(valueKeyword, val);
        }
    }
    writeWidthUnitInTwips(unit, typeKeyword, valueKeyword) {
        const defaultWidthUnit = TableWidthUnit.createDefault();
        if (unit.type != defaultWidthUnit.type) {
            switch (unit.type) {
                case TableWidthUnitType.ModelUnits:
                    this.rtfBuilder.writeIntegerCommand(typeKeyword, TableWidthUnitType.ModelUnits);
                    break;
                case TableWidthUnitType.Nil:
                    this.rtfBuilder.writeIntegerCommand(typeKeyword, TableWidthUnitType.Nil);
                    break;
                default:
                    throw new Error(Errors.InternalException);
                    break;
            }
            if (unit.value != defaultWidthUnit.value)
                this.rtfBuilder.writeIntegerCommand(valueKeyword, unit.value);
        }
    }
    shouldExportCellMargin(marginUnit) {
        return marginUnit.type != TableWidthUnitType.Nil || marginUnit.value != 0;
    }
}
