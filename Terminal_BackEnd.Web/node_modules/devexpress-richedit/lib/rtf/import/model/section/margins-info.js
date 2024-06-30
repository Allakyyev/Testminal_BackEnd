export var SectionGutterAlignment;
(function (SectionGutterAlignment) {
    SectionGutterAlignment[SectionGutterAlignment["Left"] = 0] = "Left";
    SectionGutterAlignment[SectionGutterAlignment["Right"] = 1] = "Right";
    SectionGutterAlignment[SectionGutterAlignment["Top"] = 2] = "Top";
    SectionGutterAlignment[SectionGutterAlignment["Bottom"] = 3] = "Bottom";
})(SectionGutterAlignment || (SectionGutterAlignment = {}));
export class RtfMarginsInfo {
    copyFrom(obj) {
        this.gutter = obj.gutter;
        this.gutterAlignment = obj.gutterAlignment;
    }
}
