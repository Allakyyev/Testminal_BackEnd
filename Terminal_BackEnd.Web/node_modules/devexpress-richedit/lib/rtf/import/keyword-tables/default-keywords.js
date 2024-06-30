import { MapCreator } from '../../../base-utils/map-creator';
import { DestinationBase } from '../destination/base/destination';
import { UnicodeDestination } from '../destination/base/unicode-destination';
import { ColorTableDestination } from '../destination/color-table-destination';
import { DestinationRevisionAuthorTable } from '../destination/destination-revision-author-table';
import { FontTableDestination } from '../destination/font-table-destination';
import { UserTableDestination } from '../destination/user-table-destination';
export const keywordHtDefault = new MapCreator()
    .add("bin", DestinationBase.onBinKeyword)
    .add("colortbl", (data) => data.destination = new ColorTableDestination(data))
    .add("fonttbl", (data) => data.destination = new FontTableDestination(data))
    .add("protusertbl", (data) => data.destination = new UserTableDestination(data))
    .add("ansi", DestinationBase.onAnsiKeyword)
    .add("mac", DestinationBase.onMacKeyword)
    .add("pc", DestinationBase.onPcKeyword)
    .add("pca", DestinationBase.onPcaKeyword)
    .add("ansicpg", DestinationBase.onAnsiCodePageKeyword)
    .add("hyphauto", DestinationBase.onHyphAutoKeyword)
    .add("upr", (data) => data.destination = new UnicodeDestination(data, data.destination))
    .add("uc", DestinationBase.onUnicodeCountKeyword)
    .add("revtbl", (data) => data.destination = new DestinationRevisionAuthorTable(data))
    .add("u", DestinationBase.onUnicodeKeyword)
    .get();
