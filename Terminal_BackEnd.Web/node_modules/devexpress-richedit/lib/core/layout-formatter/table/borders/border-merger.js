export class BorderMerger {
    static getFinalReducedVerticalBorders(vertBorders) {
        const resultBorders = [];
        const allVerticalBorders = [];
        for (let rowBorders of vertBorders)
            for (let cellBorders of rowBorders)
                for (let border of cellBorders)
                    allVerticalBorders.push(border);
        allVerticalBorders.sort((a, b) => {
            const xPosDiff = a.xPos - b.xPos;
            if (Math.abs(xPosDiff) > 1)
                return xPosDiff;
            const yPosDiff = a.yPos - b.yPos;
            if (yPosDiff != 0)
                return yPosDiff;
            return 0;
        });
        let prevBorder = allVerticalBorders[0];
        resultBorders.push(prevBorder);
        for (let brdIndex = 1, border; border = allVerticalBorders[brdIndex]; brdIndex++) {
            if (prevBorder.canCombineVertical(border))
                prevBorder.length = border.yPos + border.length - prevBorder.yPos;
            else {
                prevBorder = border;
                resultBorders.push(prevBorder);
            }
        }
        return resultBorders;
    }
    static getFinalReducedHorizontalBorders(horBorders) {
        const resultBorders = [];
        for (let horLines of horBorders) {
            for (let line of horLines) {
                const borders = line.borders;
                let prevBorder = borders[0].getLayoutTableBorder(line);
                resultBorders.push(prevBorder);
                for (let brdIndex = 1, border; border = borders[brdIndex]; brdIndex++) {
                    if (Math.abs(prevBorder.xPos + prevBorder.length - border.xPosition) < 2 && prevBorder.borderInfo.equals(border.borderInfo))
                        prevBorder.length = border.xPosition + border.length - prevBorder.xPos;
                    else {
                        prevBorder = border.getLayoutTableBorder(line);
                        resultBorders.push(prevBorder);
                    }
                }
            }
        }
        return resultBorders;
    }
}
