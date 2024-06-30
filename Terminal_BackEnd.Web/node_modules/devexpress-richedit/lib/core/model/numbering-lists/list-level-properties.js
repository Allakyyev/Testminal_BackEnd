import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RichUtils } from '../rich-utils';
export class ListLevelProperties {
    constructor() {
        this.start = 1;
        this.format = NumberingFormat.Decimal;
        this.alignment = ListNumberAlignment.Left;
        this.convertPreviousLevelNumberingToDecimal = false;
        this.separator = RichUtils.specialCharacters.TabMark;
        this.suppressRestart = false;
        this.suppressBulletResize = false;
        this.displayFormatString = "{0}.";
        this.relativeRestartLevel = 0;
        this.templateCode = 0;
        this.originalLeftIndent = 0;
        this.legacy = false;
        this.legacySpace = 0;
        this.legacyIndent = 0;
    }
    calculateHash() {
        return MathUtils.somePrimes[0] * this.start ^
            MathUtils.somePrimes[1] * this.format ^
            MathUtils.somePrimes[2] * this.alignment ^
            MathUtils.somePrimes[3] * StringUtils.stringHashCode(this.separator) ^
            MathUtils.somePrimes[4] * boolToInt(this.suppressRestart) ^
            MathUtils.somePrimes[5] * this.originalLeftIndent ^
            MathUtils.somePrimes[6] * this.templateCode ^
            MathUtils.somePrimes[7] * StringUtils.stringHashCode(this.displayFormatString);
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    equals(obj) {
        return this.alignment === obj.alignment &&
            this.convertPreviousLevelNumberingToDecimal === obj.convertPreviousLevelNumberingToDecimal &&
            this.displayFormatString === obj.displayFormatString &&
            this.format === obj.format &&
            this.legacy === obj.legacy &&
            this.legacyIndent === obj.legacyIndent &&
            this.legacySpace === obj.legacySpace &&
            this.originalLeftIndent === obj.originalLeftIndent &&
            this.relativeRestartLevel === obj.relativeRestartLevel &&
            this.separator === obj.separator &&
            this.start === obj.start &&
            this.suppressBulletResize === obj.suppressBulletResize &&
            this.suppressRestart === obj.suppressRestart &&
            this.templateCode === obj.templateCode;
    }
    copyFrom(obj) {
        this.alignment = obj.alignment;
        this.convertPreviousLevelNumberingToDecimal = obj.convertPreviousLevelNumberingToDecimal;
        this.displayFormatString = obj.displayFormatString;
        this.format = obj.format;
        this.legacy = obj.legacy;
        this.legacyIndent = obj.legacyIndent;
        this.legacySpace = obj.legacySpace;
        this.originalLeftIndent = obj.originalLeftIndent;
        this.relativeRestartLevel = obj.relativeRestartLevel;
        this.separator = obj.separator;
        this.start = obj.start;
        this.suppressBulletResize = obj.suppressBulletResize;
        this.suppressRestart = obj.suppressRestart;
        this.templateCode = obj.templateCode;
    }
    clone() {
        var clone = new ListLevelProperties();
        clone.copyFrom(this);
        return clone;
    }
}
export var NumberingFormat;
(function (NumberingFormat) {
    NumberingFormat[NumberingFormat["Decimal"] = 0] = "Decimal";
    NumberingFormat[NumberingFormat["AIUEOHiragana"] = 1] = "AIUEOHiragana";
    NumberingFormat[NumberingFormat["AIUEOFullWidthHiragana"] = 2] = "AIUEOFullWidthHiragana";
    NumberingFormat[NumberingFormat["ArabicAbjad"] = 3] = "ArabicAbjad";
    NumberingFormat[NumberingFormat["ArabicAlpha"] = 4] = "ArabicAlpha";
    NumberingFormat[NumberingFormat["Bullet"] = 5] = "Bullet";
    NumberingFormat[NumberingFormat["CardinalText"] = 6] = "CardinalText";
    NumberingFormat[NumberingFormat["Chicago"] = 7] = "Chicago";
    NumberingFormat[NumberingFormat["ChineseCounting"] = 8] = "ChineseCounting";
    NumberingFormat[NumberingFormat["ChineseCountingThousand"] = 9] = "ChineseCountingThousand";
    NumberingFormat[NumberingFormat["ChineseLegalSimplified"] = 10] = "ChineseLegalSimplified";
    NumberingFormat[NumberingFormat["Chosung"] = 11] = "Chosung";
    NumberingFormat[NumberingFormat["DecimalEnclosedCircle"] = 12] = "DecimalEnclosedCircle";
    NumberingFormat[NumberingFormat["DecimalEnclosedCircleChinese"] = 13] = "DecimalEnclosedCircleChinese";
    NumberingFormat[NumberingFormat["DecimalEnclosedFullstop"] = 14] = "DecimalEnclosedFullstop";
    NumberingFormat[NumberingFormat["DecimalEnclosedParentheses"] = 15] = "DecimalEnclosedParentheses";
    NumberingFormat[NumberingFormat["DecimalFullWidth"] = 16] = "DecimalFullWidth";
    NumberingFormat[NumberingFormat["DecimalFullWidth2"] = 17] = "DecimalFullWidth2";
    NumberingFormat[NumberingFormat["DecimalHalfWidth"] = 18] = "DecimalHalfWidth";
    NumberingFormat[NumberingFormat["DecimalZero"] = 19] = "DecimalZero";
    NumberingFormat[NumberingFormat["Ganada"] = 20] = "Ganada";
    NumberingFormat[NumberingFormat["Hebrew1"] = 21] = "Hebrew1";
    NumberingFormat[NumberingFormat["Hebrew2"] = 22] = "Hebrew2";
    NumberingFormat[NumberingFormat["Hex"] = 23] = "Hex";
    NumberingFormat[NumberingFormat["HindiConsonants"] = 24] = "HindiConsonants";
    NumberingFormat[NumberingFormat["HindiDescriptive"] = 25] = "HindiDescriptive";
    NumberingFormat[NumberingFormat["HindiNumbers"] = 26] = "HindiNumbers";
    NumberingFormat[NumberingFormat["HindiVowels"] = 27] = "HindiVowels";
    NumberingFormat[NumberingFormat["IdeographDigital"] = 28] = "IdeographDigital";
    NumberingFormat[NumberingFormat["IdeographEnclosedCircle"] = 29] = "IdeographEnclosedCircle";
    NumberingFormat[NumberingFormat["IdeographLegalTraditional"] = 30] = "IdeographLegalTraditional";
    NumberingFormat[NumberingFormat["IdeographTraditional"] = 31] = "IdeographTraditional";
    NumberingFormat[NumberingFormat["IdeographZodiac"] = 32] = "IdeographZodiac";
    NumberingFormat[NumberingFormat["IdeographZodiacTraditional"] = 33] = "IdeographZodiacTraditional";
    NumberingFormat[NumberingFormat["Iroha"] = 34] = "Iroha";
    NumberingFormat[NumberingFormat["IrohaFullWidth"] = 35] = "IrohaFullWidth";
    NumberingFormat[NumberingFormat["JapaneseCounting"] = 36] = "JapaneseCounting";
    NumberingFormat[NumberingFormat["JapaneseDigitalTenThousand"] = 37] = "JapaneseDigitalTenThousand";
    NumberingFormat[NumberingFormat["JapaneseLegal"] = 38] = "JapaneseLegal";
    NumberingFormat[NumberingFormat["KoreanCounting"] = 39] = "KoreanCounting";
    NumberingFormat[NumberingFormat["KoreanDigital"] = 40] = "KoreanDigital";
    NumberingFormat[NumberingFormat["KoreanDigital2"] = 41] = "KoreanDigital2";
    NumberingFormat[NumberingFormat["KoreanLegal"] = 42] = "KoreanLegal";
    NumberingFormat[NumberingFormat["LowerLetter"] = 43] = "LowerLetter";
    NumberingFormat[NumberingFormat["LowerRoman"] = 44] = "LowerRoman";
    NumberingFormat[NumberingFormat["None"] = 45] = "None";
    NumberingFormat[NumberingFormat["NumberInDash"] = 46] = "NumberInDash";
    NumberingFormat[NumberingFormat["Ordinal"] = 47] = "Ordinal";
    NumberingFormat[NumberingFormat["OrdinalText"] = 48] = "OrdinalText";
    NumberingFormat[NumberingFormat["RussianLower"] = 49] = "RussianLower";
    NumberingFormat[NumberingFormat["RussianUpper"] = 50] = "RussianUpper";
    NumberingFormat[NumberingFormat["TaiwaneseCounting"] = 51] = "TaiwaneseCounting";
    NumberingFormat[NumberingFormat["TaiwaneseCountingThousand"] = 52] = "TaiwaneseCountingThousand";
    NumberingFormat[NumberingFormat["TaiwaneseDigital"] = 53] = "TaiwaneseDigital";
    NumberingFormat[NumberingFormat["ThaiDescriptive"] = 54] = "ThaiDescriptive";
    NumberingFormat[NumberingFormat["ThaiLetters"] = 55] = "ThaiLetters";
    NumberingFormat[NumberingFormat["ThaiNumbers"] = 56] = "ThaiNumbers";
    NumberingFormat[NumberingFormat["UpperLetter"] = 57] = "UpperLetter";
    NumberingFormat[NumberingFormat["UpperRoman"] = 58] = "UpperRoman";
    NumberingFormat[NumberingFormat["VietnameseDescriptive"] = 59] = "VietnameseDescriptive";
})(NumberingFormat || (NumberingFormat = {}));
export var ListNumberAlignment;
(function (ListNumberAlignment) {
    ListNumberAlignment[ListNumberAlignment["Left"] = 0] = "Left";
    ListNumberAlignment[ListNumberAlignment["Center"] = 1] = "Center";
    ListNumberAlignment[ListNumberAlignment["Right"] = 2] = "Right";
})(ListNumberAlignment || (ListNumberAlignment = {}));
