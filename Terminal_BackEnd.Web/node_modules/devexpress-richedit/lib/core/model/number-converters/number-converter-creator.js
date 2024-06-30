import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { BulletNumberConverter } from './bullet-number-converter';
import { DecimalEnclosedParenthesesNumberConverter } from './decimal-enclosed-parentheses-number-converter';
import { DecimalNumberConverter } from './decimal-number-converter';
import { DecimalZeroNumberConverter } from './decimal-zero-number-converter';
import { DescriptiveCardinalEnglishNumberConverter, DescriptiveOrdinalEnglishNumberConverter } from './descriptive-number-converter';
import { HexNumberConverter } from './hex-number-converter';
import { LowerLatinLetterNumberConverter, UpperLatinLetterNumberConverter } from './latin-letter-number-converter';
import { NumberInDashNumberConverter } from './number-in-dash-number-converter';
import { OrdinalEnglishNumberConverter, OrdinalFrenchNumberConverter, OrdinalGermanNumberConverter, OrdinalGreekNumberConverter, OrdinalItalianNumberConverter, OrdinalPortugueseNumberConverter, OrdinalRussianNumberConverter, OrdinalSpanishNumberConverter, OrdinalSwedishNumberConverter, OrdinalTurkishNumberConverter, OrdinalUkrainianNumberConverter } from './ordinal-based-number-converter';
import { LowerRomanNumberConverterClassic, UpperRomanNumberConverterClassic } from './roman-number-converter';
export class NumberConverterCreator {
    static createConverter(type, simpleFormattersManager, langId = "en") {
        switch (type) {
            case NumberingFormat.UpperRoman:
                return new UpperRomanNumberConverterClassic();
            case NumberingFormat.LowerRoman:
                return new LowerRomanNumberConverterClassic();
            case NumberingFormat.Ordinal:
                return NumberConverterCreator.getOrdinalBasedNumberConverter(simpleFormattersManager, langId);
            case NumberingFormat.OrdinalText:
                return new DescriptiveOrdinalEnglishNumberConverter();
            case NumberingFormat.CardinalText:
                return new DescriptiveCardinalEnglishNumberConverter();
            case NumberingFormat.UpperLetter:
                return new UpperLatinLetterNumberConverter();
            case NumberingFormat.LowerLetter:
                return new LowerLatinLetterNumberConverter();
            case NumberingFormat.NumberInDash:
                return new NumberInDashNumberConverter(simpleFormattersManager);
            case NumberingFormat.Bullet:
                return new BulletNumberConverter();
            case NumberingFormat.DecimalZero:
                return new DecimalZeroNumberConverter(simpleFormattersManager);
            case NumberingFormat.DecimalEnclosedParentheses:
                return new DecimalEnclosedParenthesesNumberConverter(simpleFormattersManager);
            case NumberingFormat.Hex:
                return new HexNumberConverter();
            case NumberingFormat.Decimal:
                return new DecimalNumberConverter();
            default:
                return new DecimalNumberConverter();
        }
    }
    static getOrdinalBasedNumberConverter(simpleFormattersManager, langId) {
        const twoLetterISOLanguageName = langId.substring(0, 2).toLowerCase();
        switch (twoLetterISOLanguageName) {
            case "en":
                return new OrdinalEnglishNumberConverter(simpleFormattersManager);
            case "fr":
                return new OrdinalFrenchNumberConverter(simpleFormattersManager);
            case "de":
                return new OrdinalGermanNumberConverter(simpleFormattersManager);
            case "it":
                return new OrdinalItalianNumberConverter(simpleFormattersManager);
            case "ru":
                return new OrdinalRussianNumberConverter(simpleFormattersManager);
            case "sv":
                return new OrdinalSwedishNumberConverter(simpleFormattersManager);
            case "tr":
                return new OrdinalTurkishNumberConverter(simpleFormattersManager);
            case "el":
                return new OrdinalGreekNumberConverter(simpleFormattersManager);
            case "es":
                return new OrdinalSpanishNumberConverter(simpleFormattersManager);
            case "pt":
                return new OrdinalPortugueseNumberConverter(simpleFormattersManager);
            case "uk":
                return new OrdinalUkrainianNumberConverter(simpleFormattersManager);
        }
        return new DecimalNumberConverter();
    }
    static createConverterByTypeName(typeName, simpleFormattersManager) {
        const uppercaseTypeName = typeName.toUpperCase();
        const firstChar = typeName[0];
        switch (uppercaseTypeName) {
            case "ALPHABETIC":
                return firstChar.toUpperCase() == firstChar ? new UpperLatinLetterNumberConverter() : new LowerLatinLetterNumberConverter();
            case "ROMAN":
                return firstChar.toUpperCase() == firstChar ? new UpperRomanNumberConverterClassic() : new LowerRomanNumberConverterClassic();
            case "ARABIC":
                return new DecimalNumberConverter();
            case "ARABICDASH":
                return new NumberInDashNumberConverter(simpleFormattersManager);
            case "CARDTEXT":
                return new DescriptiveCardinalEnglishNumberConverter();
            case "CIRCLENUM":
                return new DecimalEnclosedParenthesesNumberConverter(simpleFormattersManager);
            case "HEX":
                return new HexNumberConverter();
            case "ORDINAL":
                return new OrdinalEnglishNumberConverter(simpleFormattersManager);
            case "ORDTEXT":
                return new DescriptiveOrdinalEnglishNumberConverter();
            default:
                return new DecimalNumberConverter();
        }
    }
}
