import { MapCreator } from '../../base-utils/map-creator';
import { Log } from '../../core/rich-utils/debug/logger/base-logger/log';
import { ChunkedText } from '@devexpress/utils/lib/class/chunked-text';
import { Errors } from '@devexpress/utils/lib/errors';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { boolToString } from '@devexpress/utils/lib/utils/common';
import { RtfExportSR } from '../translation-table/rtf-export-sr';
import { byteToHex } from '../../base-utils/hexadecimal-converter';
import { Characters } from './characters';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class RtfBuilder {
    constructor() {
        this.rowLengthBound = 200;
        this.init();
    }
    clear() {
        this.init();
    }
    init() {
        this.rtfContent = new ChunkedText("");
        this.unicodeTextBuilder = new ChunkedText("");
        this.isPreviousWriteCommand = false;
        this.rowLength = 0;
        this.hexMode = false;
    }
    writeCommandCore(command, writeParam) {
        this.rtfContent.addText(command);
        writeParam();
        this.isPreviousWriteCommand = true;
        this.increaseRowLength(command.length);
    }
    writeCommand(command, param) {
        this.writeCommandCore(command, () => {
            if (param != undefined)
                if (typeof param === "boolean")
                    this.rtfContent.addText(boolToString(param));
                else
                    this.rtfContent.addText(param.toString());
        });
    }
    writeIntegerCommand(command, param) {
        const intValue = Math.floor(param);
        if (Log.isDebug && intValue !== param)
            throw new Error(Errors.InternalException);
        this.writeCommandCore(command, () => this.rtfContent.addText(intValue.toString()));
    }
    createKeyword(propertyName) {
        return "\\" + propertyName;
    }
    createOptionalKeyword(propertyName) {
        return "\\*" + propertyName;
    }
    writeAnsiText(text) {
        const count = text.length;
        if (this.isPreviousWriteCommand)
            this.rtfContent.addText(RtfExportSR.Space);
        for (let i = 0; i < count; i++) {
            const ch = text[i];
            const str = this.correctAnsiString(ch);
            this.rtfContent.addText(str);
        }
        this.isPreviousWriteCommand = false;
        this.increaseRowLength(text.length);
    }
    writeText(text, specialMarks = RtfBuilder.specialMarks) {
        const count = text.length;
        for (var i = 0; i < count; i++) {
            const ch = text[i];
            const specialMark = specialMarks[ch];
            if (specialMark)
                this.writeTextDirect(specialMark);
            else
                this.writeChar(ch);
        }
    }
    writeTextDirect(text, makeStringUnicodeCompatible = false) {
        if (this.isPreviousWriteCommand)
            this.rtfContent.addText(RtfExportSR.Space);
        if (makeStringUnicodeCompatible)
            this.rtfContent.addText(this.getUnicodeCompatibleStringDirect(text));
        else
            this.rtfContent.addText(text);
        this.isPreviousWriteCommand = false;
        this.increaseRowLength(text.length);
    }
    writeTextDirectUnsafe(text) {
        if (this.isPreviousWriteCommand)
            this.rtfContent.addText(RtfExportSR.Space);
        const textLength = text.textLength;
        this.rtfContent.addText(text.getText());
        this.isPreviousWriteCommand = false;
        this.increaseRowLength(textLength);
    }
    writeChar(ch) {
        if (this.isPreviousWriteCommand)
            this.rtfContent.addText(RtfExportSR.Space);
        const str = this.getUnicodeCompatibleString(ch);
        this.rtfContent.addText(str);
        this.isPreviousWriteCommand = false;
        this.increaseRowLength(str.length);
    }
    openGroup() {
        this.rtfContent.addText(RtfExportSR.OpenGroup);
        this.isPreviousWriteCommand = false;
        this.increaseRowLength(RtfExportSR.OpenGroup.length);
    }
    closeGroup() {
        this.rtfContent.addText(RtfExportSR.CloseGroup);
        this.isPreviousWriteCommand = false;
        this.increaseRowLength(RtfExportSR.CloseGroup.length);
    }
    static isSpecialSymbol(ch) {
        return ch == '{' || ch == '}' || ch == '\\';
    }
    textHasNonASCIISymbol(text) {
        const count = text.length;
        for (let i = 0; i < count; i++) {
            let code = text.charCodeAt(i);
            if (!this.isASCII(code))
                return true;
        }
        return false;
    }
    isASCII(code) {
        return code >= 0 && code <= 127;
    }
    isANSI(code) {
        return code >= 0 && code <= 255;
    }
    containsNonAnsiChar(str) {
        return ListUtils.anyOf(str.split(''), (ch) => !this.isANSI(this.getCode(ch)));
    }
    correctAnsiString(ch) {
        this.unicodeTextBuilder = new ChunkedText("");
        const code = this.getCode(ch);
        if (this.isANSI(code)) {
            if (RtfBuilder.isSpecialSymbol(ch))
                this.unicodeTextBuilder.addText("\\");
            this.unicodeTextBuilder.addText(ch);
        }
        else
            this.unicodeTextBuilder.addText('?');
        return this.unicodeTextBuilder.getText();
    }
    getUnicodeCompatibleString(ch) {
        this.unicodeTextBuilder = new ChunkedText("");
        const code = this.getCode(ch);
        if (this.isASCII(code)) {
            if (RtfBuilder.isSpecialSymbol(ch))
                this.unicodeTextBuilder.addText("\\");
            this.unicodeTextBuilder.addText(ch);
        }
        else
            this.appendUnicodeCompatibleCharCore(code, ch);
        return this.unicodeTextBuilder.getText();
    }
    getUnicodeCompatibleStringDirect(text) {
        this.unicodeTextBuilder = new ChunkedText("");
        const length = text.length;
        for (var i = 0; i < length; i++) {
            const ch = text[i];
            const code = this.getCode(ch);
            if (this.isASCII(code))
                this.unicodeTextBuilder.addText(ch);
            else
                this.appendUnicodeCompatibleCharCore(code, ch);
        }
        return this.unicodeTextBuilder.getText();
    }
    appendUnicodeCompatibleCharCore(code, ch) {
        const bytes = toUTF8Array(ch);
        this.unicodeTextBuilder.addText(`\\u${code}\\'${RtfBuilder.byteToHexString[bytes[0]]}`);
    }
    writePictureBytes(binString) {
        this.hexMode = true;
        this.rtfContent.addText(RtfExportSR.Space);
        this.rtfContent.addText(binString);
        this.hexMode = false;
    }
    writeByteArrayAsHex(bytes, offset = 0, length = bytes.length) {
        if (this.isPreviousWriteCommand)
            this.rtfContent.addText(RtfExportSR.Space);
        this.hexMode = true;
        const count = offset + length;
        for (let i = offset; i < count; i++) {
            this.rtfContent.addText(byteToHex(bytes[i]));
        }
        this.isPreviousWriteCommand = true;
        this.hexMode = false;
    }
    writeShapeColorProperty(propertyName, propertyValue) {
        this.writeShapeProperty(propertyName, this.getIntColorValue(propertyValue).toString());
    }
    getIntColorValue(color) {
        return ColorUtils.getRed(color) | (ColorUtils.getGreen(color) << 8) | (ColorUtils.getBlue(color) << 16);
    }
    writeShapeProperty(propertyName, propertyValue) {
        this.openGroup();
        this.writeCommand(RtfExportSR.ShapeProperty);
        this.writeShapePropertyName(propertyName);
        this.writeShapePropertyValue(propertyValue);
        this.closeGroup();
    }
    writePCDATAShapeProperty(propertyName, propertyValue) {
        this.writeShapeProperty(propertyName, () => this.writePCData(propertyValue));
    }
    writePCData(text) {
        this.writeText(text, RtfBuilder.specialPCDataMarks);
    }
    writeShapePropertyName(propertyName) {
        this.openGroup();
        this.writeCommand(RtfExportSR.ShapePropertyName);
        this.writeTextDirect(propertyName);
        this.closeGroup();
    }
    writeShapePropertyValue(propertyValue) {
        this.openGroup();
        this.writeCommand(RtfExportSR.ShapePropertyValue);
        if (typeof propertyValue == "string")
            this.writeTextDirect(propertyValue, true);
        else
            propertyValue();
        this.closeGroup();
    }
    writeShapePropertyWithOptionalGroup(propertyName, propertyValue, optionalPropertyName, optionalPropertyValue) {
        this.openGroup();
        this.writeCommand(RtfExportSR.ShapeProperty);
        this.writeShapePropertyName(propertyName);
        this.writeShapePropertyValue(propertyValue);
        this.openGroup();
        this.writeCommand(this.createOptionalKeyword(optionalPropertyName) + " ");
        this.writeCommand(optionalPropertyValue);
        this.closeGroup();
        this.closeGroup();
    }
    writeShapeIntegerProperty(propertyName, propertyValue) {
        this.writeShapeProperty(propertyName, Math.round(propertyValue).toString());
    }
    writeShapeBoolProperty(propertyName, propertyValue) {
        this.writeShapeProperty(propertyName, boolToString(propertyValue));
    }
    increaseRowLength(delta) {
        this.rowLength += delta;
        if (this.rowLength >= this.rowLengthBound && this.hexMode) {
            this.rtfContent.addText(RtfExportSR.CLRF);
            this.isPreviousWriteCommand = false;
            this.rowLength = 0;
        }
    }
    getCode(ch) {
        const charCode = ch.charCodeAt(0);
        return charCode > 32767 ? charCode - 65536 : charCode;
    }
    writeDescription(nonVisualDrawingObjectInfo) {
        let result = '';
        if (!StringUtils.isNullOrEmpty(nonVisualDrawingObjectInfo.title)) {
            result += "Title: " + nonVisualDrawingObjectInfo.title;
            if (!StringUtils.isNullOrEmpty(nonVisualDrawingObjectInfo.description))
                result += " - Description: " + nonVisualDrawingObjectInfo.description;
        }
        else if (!StringUtils.isNullOrEmpty(nonVisualDrawingObjectInfo.description))
            result = nonVisualDrawingObjectInfo.description;
        if (!StringUtils.isNullOrEmpty(result))
            this.writeShapeProperty("wzDescription", result);
    }
}
RtfBuilder.specialMarks = CreateSpecialMarksTable();
RtfBuilder.byteToHexString = CreateByteToHexString();
RtfBuilder.specialPCDataMarks = CreateSpecialPCDataMarksTable(RtfBuilder.byteToHexString);
export function CreateSpecialMarksTable() {
    const result = new MapCreator()
        .add(Characters.EmSpace, "\\u8195\\'3f")
        .add(Characters.EnSpace, "\\u8194\\'3f")
        .add(Characters.Hyphen, "")
        .add(Characters.LineBreak, "\\line ")
        .add(Characters.PageBreak, "\\page ")
        .add(Characters.ColumnBreak, "\\column ")
        .add(Characters.QmSpace, "\\u8197\\'3f")
        .add(Characters.TabMark, "\\tab ")
        .get();
    return result;
}
export function CreateSpecialPCDataMarksTable(byteToHexString) {
    const result = new MapCreator().get();
    for (let i = 0; i < 31; i++) {
        AddHexToMarkTable(result, i.toString(), byteToHexString);
    }
    AddHexToMarkTable(result, '\\', byteToHexString);
    AddHexToMarkTable(result, '{', byteToHexString);
    AddHexToMarkTable(result, '}', byteToHexString);
    return result;
}
export function AddHexToMarkTable(result, ch, byteToHexString) {
    result[ch] = "\'" + byteToHexString[ch];
}
export function CreateByteToHexString() {
    const byteToHexString = [];
    for (var i = 0; i < 256; i++)
        byteToHexString[i] = i.toString(16);
    return byteToHexString;
}
export function toUTF8Array(str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80)
            utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        else {
            i++;
            charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}
