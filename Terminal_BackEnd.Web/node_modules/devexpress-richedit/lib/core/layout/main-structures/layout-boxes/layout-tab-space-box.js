import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { MeasureInfoNonText } from '../../../measurer/measure-info';
import { LayoutCharacterPropertiesColorInfo } from '../../../model/character/layout-character-properties-color-info';
import { RichUtils } from '../../../model/rich-utils';
import { LayoutBox, LayoutBoxType, LayoutRenderCharacterProperties } from './layout-box';
export var TabLeaderType;
(function (TabLeaderType) {
    TabLeaderType[TabLeaderType["None"] = 0] = "None";
    TabLeaderType[TabLeaderType["Dots"] = 1] = "Dots";
    TabLeaderType[TabLeaderType["MiddleDots"] = 2] = "MiddleDots";
    TabLeaderType[TabLeaderType["Hyphens"] = 3] = "Hyphens";
    TabLeaderType[TabLeaderType["Underline"] = 4] = "Underline";
    TabLeaderType[TabLeaderType["ThickLine"] = 5] = "ThickLine";
    TabLeaderType[TabLeaderType["EqualSign"] = 6] = "EqualSign";
})(TabLeaderType || (TabLeaderType = {}));
export class LayoutTabSpaceBox extends LayoutBox {
    equals(obj) {
        return super.equals(obj) &&
            this.spaceWidth == obj.spaceWidth &&
            this.hiddenTabWidth == obj.hiddenTabWidth &&
            this.tabLeaderSymbol == obj.tabLeaderSymbol;
    }
    clone() {
        const newObj = new LayoutTabSpaceBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.spaceWidth = obj.spaceWidth;
        this.hiddenTabWidth = obj.hiddenTabWidth;
        this.tabLeaderSymbol = obj.tabLeaderSymbol;
    }
    setTabParams(tabLeaderSymbol, spaceWidth, hiddenTabWidth) {
        this.tabLeaderSymbol = tabLeaderSymbol;
        this.spaceWidth = spaceWidth;
        this.hiddenTabWidth = hiddenTabWidth;
    }
    getType() {
        return LayoutBoxType.TabSpace;
    }
    pushInfoForMeasure(_info, _showHiddenSymbols) {
        throw new Error(Errors.InternalException);
    }
    popInfoForMeasure(_info, _showHiddenSymbols) {
        throw new Error(Errors.InternalException);
    }
    isVisible() {
        return true;
    }
    renderGetContent(_renderer) {
        if (this.hiddenTabWidth == 0) {
            var numNbsps = Math.ceil(this.width / Math.max(1, this.spaceWidth));
            return StringUtils.repeat(this.tabLeaderSymbol, numNbsps);
        }
        var nbspsSpace = this.width - this.hiddenTabWidth;
        var nbspsSpaceLeftPart = nbspsSpace < 0 ? 0 : nbspsSpace / 2;
        var numNbspsLeftPart = Math.floor(nbspsSpaceLeftPart / Math.max(1, this.spaceWidth));
        var nbspsSpaceRightPart = this.width - (numNbspsLeftPart * this.spaceWidth + this.hiddenTabWidth);
        var numNbspsRightPart = nbspsSpaceRightPart < 0 ? 0 : Math.ceil(nbspsSpaceRightPart / Math.max(1, this.spaceWidth));
        return StringUtils.repeat(this.tabLeaderSymbol, numNbspsLeftPart) + RichUtils.specialCharacters.HiddenTabSpace +
            StringUtils.repeat(this.tabLeaderSymbol, numNbspsRightPart);
    }
    renderGetCharacterProperties() {
        if (this.characterProperties.fontBold || this.characterProperties.fontItalic || this.colorInfo.textColor) {
            const renderCharProps = this.characterProperties.clone();
            renderCharProps.linkMeasurerSizes(this.characterProperties);
            renderCharProps.fontBold = false;
            renderCharProps.fontItalic = false;
            const colorInfo = new LayoutCharacterPropertiesColorInfo(this.colorInfo.textColor ? 0 : this.colorInfo.textColor, this.colorInfo.foregroundColor, this.colorInfo.textColor && !this.colorInfo.strikeoutColor ? this.colorInfo.textColor : this.colorInfo.strikeoutColor, this.colorInfo.textColor && !this.colorInfo.underlineColor ? this.colorInfo.textColor : this.colorInfo.underlineColor);
            return new LayoutRenderCharacterProperties(renderCharProps, colorInfo);
        }
        else
            return new LayoutRenderCharacterProperties(this.characterProperties, this.colorInfo);
    }
    isWhitespace() {
        return true;
    }
    isLineBreak() {
        return false;
    }
}
export class LayoutTabSpaceBoxJustForBoxIterator extends LayoutTabSpaceBox {
    static getTabLeaderMap() {
        const tabLeaderMap = {
            [TabLeaderType.None]: "&nbsp;",
            [TabLeaderType.Dots]: RichUtils.specialCharacters.Dot,
            [TabLeaderType.EqualSign]: RichUtils.specialCharacters.EqualSign,
            [TabLeaderType.Hyphens]: RichUtils.specialCharacters.Hyphen,
            [TabLeaderType.MiddleDots]: RichUtils.specialCharacters.MiddleDot,
            [TabLeaderType.ThickLine]: RichUtils.specialCharacters.Underscore,
            [TabLeaderType.Underline]: RichUtils.specialCharacters.Underscore,
        };
        LayoutTabSpaceBoxJustForBoxIterator.tabLeaderSymbolList = [];
        LayoutTabSpaceBoxJustForBoxIterator.tabLeaderTypeList = [];
        NumberMapUtils.forEach(tabLeaderMap, (symbol, type) => {
            LayoutTabSpaceBoxJustForBoxIterator.tabLeaderSymbolList.push(symbol);
            LayoutTabSpaceBoxJustForBoxIterator.tabLeaderTypeList.push(type);
        });
        return tabLeaderMap;
    }
    getLayoutTabBox(tabLeaderType) {
        const leaderMeasureInfo = this.leadersMeasureInfo[tabLeaderType];
        const newTabBox = this.clone();
        newTabBox.setTabParams(LayoutTabSpaceBoxJustForBoxIterator.tabLeaderMap[tabLeaderType], leaderMeasureInfo.resultSize.width, this.showHiddenSymbols ? this.hiddenTabMeasureInfo.resultSize.width : 0);
        newTabBox.height = leaderMeasureInfo.resultSize.height;
        return newTabBox;
    }
    pushInfoForMeasure(info, _showHiddenSymbols) {
        const props = this.renderGetCharacterProperties();
        const charProps = props.initProps;
        ListUtils.forEach(LayoutTabSpaceBoxJustForBoxIterator.tabLeaderSymbolList, (symbol) => info.push(new MeasureInfoNonText(symbol, charProps)));
        info.push(new MeasureInfoNonText(RichUtils.specialCharacters.HiddenTabSpace, charProps));
    }
    popInfoForMeasure(info, showHiddenSymbols) {
        this.leadersMeasureInfo = {};
        this.hiddenTabMeasureInfo = info.pop();
        ListUtils.reverseForEach(LayoutTabSpaceBoxJustForBoxIterator.tabLeaderTypeList, (type) => this.leadersMeasureInfo[type] = info.pop());
        this.showHiddenSymbols = showHiddenSymbols;
    }
}
LayoutTabSpaceBoxJustForBoxIterator.tabLeaderMap = LayoutTabSpaceBoxJustForBoxIterator.getTabLeaderMap();
