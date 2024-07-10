using DevExpress.XtraReports.Native;
using DevExpress.XtraReports.Services;
using System.Reflection;
using DevExpress.XtraReports.UI;
using DevExpress.XtraReports.Web.Extensions;

namespace Terminal_BackEnd.Web.Services {
    public static class ReportsFactory {
        public static Dictionary<string, Func<XtraReport>> Reports = new Dictionary<string, Func<XtraReport>>() {
            ["NewReport"] = () => new XtraReport()            
        };
    }

    public class CustomReportProvider : IReportProvider {
        public const string DocumentPrefix = "[LoadDocument]=>";
        readonly ReportStorageWebExtension reportStorageWebExtension;
        readonly string DocumentsRootPath;


        public CustomReportProvider(ReportStorageWebExtension reportStorageWebExtension) {
            this.reportStorageWebExtension = reportStorageWebExtension;
            var outputDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            DocumentsRootPath = Path.Combine(outputDir, "StaticDocuments");
        }
        public XtraReport GetReport(string id, ReportProviderContext context) {
            if(id.StartsWith(DocumentPrefix)) {
                var documentPrnxPath = Path.Combine(DocumentsRootPath, id.Substring(DocumentPrefix.Length) + ".prnx");
                if(!File.Exists(documentPrnxPath))
                    return null;
                var report = new XtraReport();
                report.PrintingSystem.LoadDocument(documentPrnxPath);
                return report;
            }

            var layout = reportStorageWebExtension.GetData(id);
            using(var ms = new MemoryStream(layout)) {
                var report = XtraReport.FromXmlStream(ms);
                ((IReportStorageTool2)reportStorageWebExtension).AfterGetData(id, report);
                return report;
            }
        }
    }

    public class CustomReportStorageWebExtension : ReportStorageWebExtension {
        public const string RepxExtension = ".repx";
        public const string PrnxExtension = ".prnx";
        public string ReportsRootPath { get; }
        public string DocumentsRootPath { get; }

        public CustomReportStorageWebExtension(IWebHostEnvironment env) {
            DocumentsRootPath = Path.Combine(env.ContentRootPath, "StaticDocuments");
            ReportsRootPath = Path.Combine(env.ContentRootPath, "StaticReports");

            if(!Directory.Exists(ReportsRootPath))
                Directory.CreateDirectory(ReportsRootPath);
        }
        public override bool IsValidUrl(string url) {
            return true;
        }

        public override string SetNewData(XtraReport report, string defaultUrl) {
            return SetDataInternal(report, defaultUrl);
        }

        public override byte[] GetData(string url) {
            var parts = new string[0];
            XtraReport report = null;
            if(string.IsNullOrEmpty(url))
                report = new XtraReport();
            else {
                parts = url.Split(';');
                url = parts[0];
            }

            var fileName = FixUrl(url);
            var filePath = Path.Combine(ReportsRootPath, fileName);
            if(!File.Exists(filePath))
                filePath = Directory.GetFiles(ReportsRootPath, fileName, SearchOption.AllDirectories).FirstOrDefault() ?? filePath;

            if(File.Exists(filePath)) {
                report = XtraReport.FromFile(filePath, true);
            } else {
                if(url != null && ReportsFactory.Reports.ContainsKey(url)) {
                    report = ReportsFactory.Reports[url]();
                }
            }
            if(report == null)
                throw new ArgumentException("Wrong report url");

            using(var ms = new MemoryStream()) {
                if(parts.Count() > 1) {
                    report.ExportOptions.PrintPreview.DefaultFileName = parts[1];
                }
                report.SaveLayoutToXml(ms);
                return ms.ToArray();
            }
        }

        public override Dictionary<string, string> GetUrls() {
            var dictionary = new Dictionary<string, string>();

            var repxFiles = Directory.GetFiles(ReportsRootPath, "*", SearchOption.AllDirectories);
            foreach(var item in repxFiles.Where(x => x.Contains(RepxExtension))) {
                var repxFileName = item.Split(Path.DirectorySeparatorChar).Last();
                if(dictionary.ContainsKey(repxFileName)) {
                    repxFileName = item.Substring(ReportsRootPath.Length);
                }
                repxFileName = repxFileName.Substring(0, repxFileName.Length - RepxExtension.Length);
                dictionary.Add(repxFileName, repxFileName);
            }

            var prnxFiles = Directory.GetFiles(DocumentsRootPath, "*", SearchOption.AllDirectories);
            foreach(var item in prnxFiles.Where(x => x.Contains(PrnxExtension))) {
                var prnxFileName = item.Split(Path.DirectorySeparatorChar).Last();
                if(dictionary.ContainsKey(prnxFileName)) {
                    prnxFileName = item.Substring(DocumentsRootPath.Length);
                }
                prnxFileName = CustomReportProvider.DocumentPrefix + prnxFileName.Substring(0, prnxFileName.Length - PrnxExtension.Length);
                dictionary.Add(prnxFileName, prnxFileName);
            }

            ReportsFactory.Reports.All(x => {
                dictionary.Add(x.Key, x.Key);
                return true;
            });
            return dictionary;
        }

        public override void SetData(XtraReport report, string url) {
            SetDataInternal(report, url);
        }

        string SetDataInternal(XtraReport report, string url) {
            url = FixUrl(url);
            report.SaveLayoutToXml(Path.Combine(ReportsRootPath, url));
            return url;
        }

        public override bool CanSetData(string url) {
            return true;
        }

        string FixUrl(string url) {
            if(!url?.EndsWith(RepxExtension) ?? false)
                url += RepxExtension;
            return url ?? "_.repx";
        }
    }
}