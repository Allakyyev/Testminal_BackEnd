import { MapCreator } from '../../base-utils/map-creator';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectTextWrapSide, AnchorObjectTextWrapType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType, RelativeHeightType, RelativeWidthType } from '../../core/model/floating-objects/enums';
export class RtfDrawingKeywords {
    static createDrawingObjectTextWrapTypeTable() {
        return new MapCreator()
            .add(AnchorObjectTextWrapType.TopAndBottom, 1)
            .add(AnchorObjectTextWrapType.Square, 2)
            .add(AnchorObjectTextWrapType.None, 3)
            .add(AnchorObjectTextWrapType.Tight, 4)
            .add(AnchorObjectTextWrapType.Through, 5)
            .get();
    }
    static createDrawingObjectTextWrapSideTable() {
        return new MapCreator()
            .add(AnchorObjectTextWrapSide.Both, 0)
            .add(AnchorObjectTextWrapSide.Left, 1)
            .add(AnchorObjectTextWrapSide.Right, 2)
            .add(AnchorObjectTextWrapSide.Largest, 3)
            .get();
    }
    static createFloatingObjectHorizontalPositionAlignmentTable() {
        return new MapCreator()
            .add(AnchorObjectHorizontalPositionAlignment.None, 0)
            .add(AnchorObjectHorizontalPositionAlignment.Left, 1)
            .add(AnchorObjectHorizontalPositionAlignment.Center, 2)
            .add(AnchorObjectHorizontalPositionAlignment.Right, 3)
            .add(AnchorObjectHorizontalPositionAlignment.Inside, 4)
            .add(AnchorObjectHorizontalPositionAlignment.Outside, 5)
            .get();
    }
    static createFloatingObjectHorizontalPositionTypeTable() {
        return new MapCreator()
            .add(AnchorObjectHorizontalPositionType.Margin, 0)
            .add(AnchorObjectHorizontalPositionType.Page, 1)
            .add(AnchorObjectHorizontalPositionType.Column, 2)
            .add(AnchorObjectHorizontalPositionType.Character, 3)
            .add(AnchorObjectHorizontalPositionType.LeftMargin, 4)
            .add(AnchorObjectHorizontalPositionType.RightMargin, 5)
            .add(AnchorObjectHorizontalPositionType.InsideMargin, 6)
            .add(AnchorObjectHorizontalPositionType.OutsideMargin, 7)
            .get();
    }
    static createFloatingObjectVerticalPositionAlignment() {
        return new MapCreator()
            .add(AnchorObjectVerticalPositionAlignment.None, 0)
            .add(AnchorObjectVerticalPositionAlignment.Top, 1)
            .add(AnchorObjectVerticalPositionAlignment.Center, 2)
            .add(AnchorObjectVerticalPositionAlignment.Bottom, 3)
            .add(AnchorObjectVerticalPositionAlignment.Inside, 4)
            .add(AnchorObjectVerticalPositionAlignment.Outside, 5)
            .get();
    }
    static createFloatingObjectVerticalPositionType() {
        return new MapCreator()
            .add(AnchorObjectVerticalPositionType.Margin, 0)
            .add(AnchorObjectVerticalPositionType.Page, 1)
            .add(AnchorObjectVerticalPositionType.Paragraph, 2)
            .add(AnchorObjectVerticalPositionType.Line, 3)
            .add(AnchorObjectVerticalPositionType.TopMargin, 4)
            .add(AnchorObjectVerticalPositionType.BottomMargin, 5)
            .add(AnchorObjectVerticalPositionType.InsideMargin, 6)
            .add(AnchorObjectVerticalPositionType.OutsideMargin, 7)
            .get();
    }
    static createFloatingObjectRelativeWidthType() {
        return new MapCreator()
            .add(RelativeWidthType.Margin, 0)
            .add(RelativeWidthType.Page, 1)
            .add(RelativeWidthType.LeftMargin, 2)
            .add(RelativeWidthType.RightMargin, 3)
            .add(RelativeWidthType.InsideMargin, 4)
            .add(RelativeWidthType.OutsideMargin, 5)
            .get();
    }
    static createFloatingObjectRelativeHeightType() {
        return new MapCreator()
            .add(RelativeHeightType.Margin, 0)
            .add(RelativeHeightType.Page, 1)
            .add(RelativeHeightType.TopMargin, 2)
            .add(RelativeHeightType.BottomMargin, 3)
            .add(RelativeHeightType.InsideMargin, 4)
            .add(RelativeHeightType.OutsideMargin, 5)
            .get();
    }
}
RtfDrawingKeywords.DXInternalLegacyHorizontalPositionAlignment = "_dxInternalLegacyHorizontalPositionAlignment";
RtfDrawingKeywords.DXInternalLegacyVerticalPositionAlignment = "_dxInternalLegacyVerticalPositionAlignment";
RtfDrawingKeywords.DXInternalIsShape = "_dxInternalIsShape";
RtfDrawingKeywords.Shape = "shp";
RtfDrawingKeywords.ShapeInstance = "shpinst";
RtfDrawingKeywords.ShapeGroup = "shpgrp";
RtfDrawingKeywords.ShapeText = "shptxt";
RtfDrawingKeywords.ShapeLid = "shplid";
RtfDrawingKeywords.ShapeLeft = "shpleft";
RtfDrawingKeywords.ShapeRight = "shpright";
RtfDrawingKeywords.ShapeTop = "shptop";
RtfDrawingKeywords.ShapeBottom = "shpbottom";
RtfDrawingKeywords.ShapeZOrder = "shpz";
RtfDrawingKeywords.ShapeLegacyHorizontalPositionTypePage = "shpbxpage";
RtfDrawingKeywords.ShapeLegacyHorizontalPositionTypeMargin = "shpbxmargin";
RtfDrawingKeywords.ShapeLegacyHorizontalPositionTypeColumn = "shpbxcolumn";
RtfDrawingKeywords.ShapeIgnoreLegacyHorizontalPositionType = "shpbxignore";
RtfDrawingKeywords.ShapeLegacyVerticalPositionTypePage = "shpbypage";
RtfDrawingKeywords.ShapeLegacyVerticalPositionTypeMargin = "shpbymargin";
RtfDrawingKeywords.ShapeLegacyVerticalPositionTypeParagraph = "shpbypara";
RtfDrawingKeywords.ShapeIgnoreLegacyVerticalPositionType = "shpbyignore";
RtfDrawingKeywords.ShapeWrapTextType = "shpwr";
RtfDrawingKeywords.ShapeWrapTextTypeZOrder = "shpfblwtxt";
RtfDrawingKeywords.ShapeWrapTextSide = "shpwrk";
RtfDrawingKeywords.ShapeLocked = "shplockanchor";
RtfDrawingKeywords.Name = "wzName";
RtfDrawingKeywords.LockAspectRatio = "fLockAspectRatio";
RtfDrawingKeywords.Rotation = "rotation";
RtfDrawingKeywords.Filled = "fFilled";
RtfDrawingKeywords.FillColor = "fillColor";
RtfDrawingKeywords.LineWidth = "lineWidth";
RtfDrawingKeywords.Line = "fLine";
RtfDrawingKeywords.LineColor = "lineColor";
RtfDrawingKeywords.CropFromTop = "cropFromTop";
RtfDrawingKeywords.CropFromBottom = "cropFromBottom";
RtfDrawingKeywords.CropFromLeft = "cropFromLeft";
RtfDrawingKeywords.CropFromRight = "cropFromRight";
RtfDrawingKeywords.FitShapeToText = "fFitShapeToText";
RtfDrawingKeywords.WrapText = "WrapText";
RtfDrawingKeywords.LayoutInCell = "fLayoutInCell";
RtfDrawingKeywords.HorizontalPositionAlignment = "posh";
RtfDrawingKeywords.HorizontalPositionType = "posrelh";
RtfDrawingKeywords.VerticalPositionAlignment = "posv";
RtfDrawingKeywords.VerticalPositionType = "posrelv";
RtfDrawingKeywords.RelativeHorizontalSizeWidth = "pctHoriz";
RtfDrawingKeywords.RelativeHorizontalSizeFrom = "sizerelh";
RtfDrawingKeywords.RelativeVerticalSizeHeight = "pctVert";
RtfDrawingKeywords.RelativeVerticalSizeFrom = "sizerelv";
RtfDrawingKeywords.PictureBinaryData = "pib";
RtfDrawingKeywords.ExternalPictureName = "pibName";
RtfDrawingKeywords.WrapDistLeft = "dxWrapDistLeft";
RtfDrawingKeywords.WrapDistRight = "dxWrapDistRight";
RtfDrawingKeywords.WrapDistTop = "dyWrapDistTop";
RtfDrawingKeywords.WrapDistBottom = "dyWrapDistBottom";
RtfDrawingKeywords.Hidden = "fHidden";
RtfDrawingKeywords.AllowOverlap = "fAllowOverlap";
RtfDrawingKeywords.BehindDocument = "fBehindDocument";
RtfDrawingKeywords.TextLeft = "dxTextLeft";
RtfDrawingKeywords.TextTop = "dyTextTop";
RtfDrawingKeywords.TextRight = "dxTextRight";
RtfDrawingKeywords.TextBottom = "dyTextBottom";
RtfDrawingKeywords.FlipH = "fFlipH";
RtfDrawingKeywords.FlipV = "fFlipV";
RtfDrawingKeywords.PctHorizPos = "pctHorizPos";
RtfDrawingKeywords.PctVertPos = "pctVertPos";
RtfDrawingKeywords.PseudoInline = "fPseudoInline";
RtfDrawingKeywords.ShapeType = "shapeType";
RtfDrawingKeywords.BWMode = "bWMode";
RtfDrawingKeywords.GeoLeft = "geoLeft";
RtfDrawingKeywords.GeoTop = "geoTop";
RtfDrawingKeywords.GeoRight = "geoRight";
RtfDrawingKeywords.GeoBottom = "geoBottom";
RtfDrawingKeywords.ShapePath = "shapePath";
RtfDrawingKeywords.Verticies = "pVerticies";
RtfDrawingKeywords.SegmentInfo = "pSegmentInfo";
RtfDrawingKeywords.ConnectionSites = "pConnectionSites";
RtfDrawingKeywords.ConnectionSitesDir = "pConnectionSitesDir";
RtfDrawingKeywords.ShadowType = "shadowType";
RtfDrawingKeywords.ShadowColor = "shadowColor";
RtfDrawingKeywords.ShadowOpacity = "shadowOpacity";
RtfDrawingKeywords.ShadowOffsetX = "shadowOffsetX";
RtfDrawingKeywords.ShadowOffsetY = "shadowOffsetY";
RtfDrawingKeywords.ShadowScaleXToX = "shadowScaleXToX";
RtfDrawingKeywords.ShadowScaleYToY = "shadowScaleYToY";
RtfDrawingKeywords.ShadowScaleYToX = "shadowScaleYToX";
RtfDrawingKeywords.ShadowScaleXToY = "shadowScaleXToY";
RtfDrawingKeywords.ShadowOriginX = "shadowOriginX";
RtfDrawingKeywords.ShadowOriginY = "shadowOriginY";
RtfDrawingKeywords.Shadow = "fShadow";
RtfDrawingKeywords.ShadowSoftness = "shadowSoftness";
RtfDrawingKeywords.PictureBrightness = "pictureBrightness";
RtfDrawingKeywords.PictureContrast = "pictureContrast";
RtfDrawingKeywords.PictureGray = "pictureGray";
RtfDrawingKeywords.PictureTransparent = "pictureTransparent";
RtfDrawingKeywords.AdjustValue = "adjustValue";
RtfDrawingKeywords.AdjustFormatStringValue = "adjust{0}Value";
RtfDrawingKeywords.FillType = "fillType";
RtfDrawingKeywords.Hsv = "hsv";
RtfDrawingKeywords.Accent1 = "caccentone";
RtfDrawingKeywords.Accent2 = "caccenttwo";
RtfDrawingKeywords.Accent3 = "caccentthree";
RtfDrawingKeywords.Accent4 = "caccentfour";
RtfDrawingKeywords.Accent5 = "caccentfive";
RtfDrawingKeywords.Accent6 = "caccentsix";
RtfDrawingKeywords.Tint = "ctint";
RtfDrawingKeywords.Shade = "cshade";
RtfDrawingKeywords.FillOpacity = "fillOpacity";
RtfDrawingKeywords.FillBackColor = "fillBackColor";
RtfDrawingKeywords.FillBackOpacity = "fillBackOpacity";
RtfDrawingKeywords.FillAngle = "fillAngle";
RtfDrawingKeywords.FillFocus = "fillFocus";
RtfDrawingKeywords.FillToBottom = "fillToBottom";
RtfDrawingKeywords.FillToTop = "fillToTop";
RtfDrawingKeywords.FillToLeft = "fillToLeft";
RtfDrawingKeywords.FillToRight = "fillToRight";
RtfDrawingKeywords.LineMiterLimit = "lineMiterLimit";
RtfDrawingKeywords.LineStyle = "lineStyle";
RtfDrawingKeywords.LineDashing = "lineDashing";
RtfDrawingKeywords.LineStartArrowhead = "lineStartArrowhead";
RtfDrawingKeywords.LineEndArrowhead = "lineEndArrowhead";
RtfDrawingKeywords.LineStartArrowWidth = "lineStartArrowWidth";
RtfDrawingKeywords.LineEndArrowWidth = "lineEndArrowWidth";
RtfDrawingKeywords.LineStartArrowLength = "lineStartArrowLength";
RtfDrawingKeywords.LineEndArrowLength = "lineEndArrowLength";
RtfDrawingKeywords.LineJoinStyle = "lineJoinStyle";
RtfDrawingKeywords.LineEndCapStyle = "lineEndCapStyle";
RtfDrawingKeywords.LineType = "lineType";
RtfDrawingKeywords.LockAgainstGrouping = "fLockAgainstGrouping";
RtfDrawingKeywords.LockAgainstSelect = "fLockAgainstSelect";
RtfDrawingKeywords.LockPosition = "fLockPosition";
RtfDrawingKeywords.LockRotation = "fLockRotation";
RtfDrawingKeywords.LockVerticies = "fLockVerticies";
RtfDrawingKeywords.LockAdjustHandles = "fLockAdjustHandles";
RtfDrawingKeywords.LockShapeType = "fLockShapeType";
RtfDrawingKeywords.LockText = "fLockText";
RtfDrawingKeywords.LockAgainstUngrouping = "fLockAgainstUngrouping";
RtfDrawingKeywords.LockCropping = "fLockCropping";
RtfDrawingKeywords.FillShadeColors = "fillShadeColors";
RtfDrawingKeywords.FillBlip = "fillBlip";
RtfDrawingKeywords.LineFillBlip = "lineFillBlip";
RtfDrawingKeywords.Description = "wzDescription";
RtfDrawingKeywords.PihlShape = "pihlShape";
RtfDrawingKeywords.Tooltip = "wzTooltip";
RtfDrawingKeywords.ShapeHyperlink = "hl";
RtfDrawingKeywords.ShapeHyperlinkFrame = "hlfr";
RtfDrawingKeywords.ShapeHyperlinkSource = "hlsrc";
RtfDrawingKeywords.ShapeHyperlinkLocation = "hlloc";
RtfDrawingKeywords.AnchorText = "anchorText";
RtfDrawingKeywords.TxflTextFlow = "txflTextFlow";
RtfDrawingKeywords.GroupLeft = "groupLeft";
RtfDrawingKeywords.GroupRight = "groupRight";
RtfDrawingKeywords.GroupTop = "groupTop";
RtfDrawingKeywords.GroupBottom = "groupBottom";
RtfDrawingKeywords.Dhgt = "dhgt";
RtfDrawingKeywords.RelLeft = "relLeft";
RtfDrawingKeywords.RelRight = "relRight";
RtfDrawingKeywords.RelTop = "relTop";
RtfDrawingKeywords.RelBottom = "relBottom";
RtfDrawingKeywords.RelFlipH = "fRelFlipH";
RtfDrawingKeywords.RelFlipV = "fRelFlipV";
RtfDrawingKeywords.WrapPolygonVertices = "pWrapPolygonVertices";
RtfDrawingKeywords.EditedWrap = "fEditedWrap";
RtfDrawingKeywords.Dgmt = "dgmt";
RtfDrawingKeywords.PreferRelativeResize = "fPreferRelativeResize";
RtfDrawingKeywords.XLimo = "xLimo";
RtfDrawingKeywords.YLimo = "yLimo";
RtfDrawingKeywords.LineOpacity = "lineOpacity";
RtfDrawingKeywords.LineBackColor = "lineBackColor";
RtfDrawingKeywords.PInscribe = "pInscribe";
RtfDrawingKeywords.IsButton = "fIsButton";
RtfDrawingKeywords.PatternFillFormatString = "{{\\pict\\picscalex-1\\picscaley-1\\piccropl0\\piccropr0\\piccropt0\\piccropb0\\picw212\\pich212\\picwgoal120\\pichgoal120\\wmetafile8\\bliptag{0}\\blipupi96}}";
RtfDrawingKeywords.DrawingObjectTextWrapTypeTable = RtfDrawingKeywords.createDrawingObjectTextWrapTypeTable();
RtfDrawingKeywords.DrawingObjectTextWrapSideTable = RtfDrawingKeywords.createDrawingObjectTextWrapSideTable();
RtfDrawingKeywords.DrawingObjectHorizontalPositionAlignmentTable = RtfDrawingKeywords.createFloatingObjectHorizontalPositionAlignmentTable();
RtfDrawingKeywords.DrawingObjectHorizontalPositionTypeTable = RtfDrawingKeywords.createFloatingObjectHorizontalPositionTypeTable();
RtfDrawingKeywords.DrawingObjectVerticalPositionAlignmentTable = RtfDrawingKeywords.createFloatingObjectVerticalPositionAlignment();
RtfDrawingKeywords.DrawingObjectVerticalPositionTypeTable = RtfDrawingKeywords.createFloatingObjectVerticalPositionType();
RtfDrawingKeywords.DrawingObjectRelativeWidthTypeTable = RtfDrawingKeywords.createFloatingObjectRelativeWidthType();
RtfDrawingKeywords.DrawingObjectRelativeHeightTypeTable = RtfDrawingKeywords.createFloatingObjectRelativeHeightType();
