export var DocumentLayoutDetailsLevel;
(function (DocumentLayoutDetailsLevel) {
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["None"] = -1] = "None";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["Page"] = 0] = "Page";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["PageArea"] = 1] = "PageArea";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["Column"] = 2] = "Column";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["TableRow"] = 3] = "TableRow";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["TableCell"] = 4] = "TableCell";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["Row"] = 5] = "Row";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["Box"] = 6] = "Box";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["Character"] = 7] = "Character";
    DocumentLayoutDetailsLevel[DocumentLayoutDetailsLevel["Max"] = 255] = "Max";
})(DocumentLayoutDetailsLevel || (DocumentLayoutDetailsLevel = {}));
