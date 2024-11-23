using DevExpress.XtraReports.Web.WebDocumentViewer;

namespace Terminal_BackEnd.Web.Models {
    public class ReportViewerModel {
        public string ReportUrl { get; set; }
        //public IEnumerable<SelectListItem> ReportList { get; set; }
        public float Zoom { get; set; }
        public bool ShowMultipagePreview { get; set; }
        public WebDocumentViewerModel ViewerModelToBind { get; set; }
        public bool PreviewClickTest { get; set; }
        public bool FullCircleOfFocusTest { get; set; }
        public bool CustomizeActions { get; set; }
        public bool AIIntegrationEnabled { get; set; }
    }
}
