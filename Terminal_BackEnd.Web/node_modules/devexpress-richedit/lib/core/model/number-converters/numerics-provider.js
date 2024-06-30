export class NumericsProvider {
    constructor(separator, singlesNumeral, singles, teens, tenths, hundreds, thousands, million, billion, trillion, quadrillion, quintillion) {
        this.separator = separator;
        this.singlesNumeral = singlesNumeral;
        this.singles = singles;
        this.teens = teens;
        this.tenths = tenths;
        this.hundreds = hundreds;
        this.thousands = thousands;
        this.million = million;
        this.billion = billion;
        this.trillion = trillion;
        this.quadrillion = quadrillion;
        this.quintillion = quintillion;
    }
}
export class OrdinalEnglishNumericsProvider extends NumericsProvider {
    constructor() {
        super([" ", "-"], ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "zeroth"], ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "zeroth"], ["tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"], ["twentieth", "thirtieth", "fortieth", "fiftieth", "sixtieth", "seventieth", "eightieth", "ninetieth"], ["one hundredth", "two hundredth", "three hundredth", "four hundredth", "five hundredth", "six hundredth", "seven hundredth", "eight hundredth", "nine hundredth"], ["thousandth"], ["millionth"], ["billionth"], ["trillionth"], ["quadrillionth"], ["quintillionth"]);
    }
}
export class CardinalEnglishNumericsProvider extends NumericsProvider {
    constructor() {
        super([" ", "-"], ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "zero"], ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "zero"], ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"], ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"], ["one hundred", "two hundred", "three hundred", "four hundred", "five hundred", "six hundred", "seven hundred", "eight hundred", "nine hundred"], ["thousand"], ["million"], ["billion"], ["trillion"], ["quadrillion"], ["quintillion"]);
    }
}
