import { MapCreator } from '../../../base-utils/map-creator';
import { InfoDestination } from '../destination/info/info-destination';
export const documentPropertiesKeywords = new MapCreator()
    .add("category", InfoDestination.onCategoryKeyword)
    .add("creatim", InfoDestination.onCreatedKeyword)
    .add("doccomm", InfoDestination.onDescriptionKeyword)
    .add("author", InfoDestination.onCreatorKeyword)
    .add("keywords", InfoDestination.onKeywordsKeyword)
    .add("operator", InfoDestination.onLastModifiedByKeyword)
    .add("printim", InfoDestination.onLastPrintedKeyword)
    .add("revtim", InfoDestination.onModifiedKeyword)
    .add("version", InfoDestination.onRevisionKeyword)
    .add("subject", InfoDestination.onSubjectKeyword)
    .add("title", InfoDestination.onTitleKeyword)
    .get();
