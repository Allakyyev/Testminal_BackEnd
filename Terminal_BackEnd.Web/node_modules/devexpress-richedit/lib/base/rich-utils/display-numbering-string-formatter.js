export class DisplayNumberingStringFormatter {
    static format(str, items) {
        return str.replace(/{(\d+)}/g, (_match, index) => items[index] || '');
    }
}
