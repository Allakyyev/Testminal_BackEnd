using DevExpress.AspNetCore.Reporting.WebDocumentViewer;
using DevExpress.XtraReports.Web.Extensions;
using DevExpress.XtraReports.Web.WebDocumentViewer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Terminal_BackEnd.Web.Models;

namespace Terminal_BackEnd.Web.Controllers {
    public class ReportsController : Controller {
        public IActionResult Index() {
            return View();
        }
        public IActionResult Viewer([FromQuery] string ReportUrl,
            [FromServices] IWebDocumentViewerReportResolver reportResolver,
            [FromServices] IWebDocumentViewerClientSideModelGenerator clientSideModelGenerator,
            [FromServices] ReportStorageWebExtension reportStorageWebExtension) {
            ViewBag.ReportList = reportStorageWebExtension.GetUrls().Select(x => new SelectListItem(x.Key, x.Value));
            ViewBag.ReportSourceList = new List<SelectListItem>() {
                new SelectListItem("TerminalTransactionsReport", "Отчет по продажам и инкассации")
            };
            var reportNameToOpen = ReportUrl ?? "Report.repx";
            WebDocumentViewerModel viewerModel;
            viewerModel = clientSideModelGenerator.GetModel(reportNameToOpen, WebDocumentViewerController.DefaultUri);
            var model = new ReportViewerModel {
                ReportUrl = reportNameToOpen,
                ViewerModelToBind = viewerModel
            };
            return View(model);
        }
    }
}
