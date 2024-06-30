using DevExpress.DashboardWeb;
using System.Xml.Linq;

namespace Terminal_BackEnd.Web.Services {
    public class FileRepositoryBase {
        string folder;

        public FileRepositoryBase(string folder) {
            this.folder = folder;
        }

        public ICollection<string> GetFileNameList() {
            var query = from file in Directory.EnumerateFiles(folder, "*.xml")
                        select Path.GetFileNameWithoutExtension(file);
            return query.ToList();
        }

        public XDocument GetFile(string id) {
            using(StreamReader reader = new StreamReader(new FileStream(Path.Combine(folder, id + ".xml"), FileMode.Open, FileAccess.Read, FileShare.Read))) {
                string text = reader.ReadToEnd();
                return XDocument.Parse(text);
            }
        }

        public void WriteFile(string id, XDocument document) {
            using(var writer = new StreamWriter(new FileStream(Path.Combine(folder, id + ".xml"), FileMode.Create))) {
                writer.Write(document.ToString());
            }
        }
    }
    public class DashboardFileRepository : FileRepositoryBase, IEditableDashboardStorage {

        public DashboardFileRepository(string folder) : base(folder) {

        }
        public IEnumerable<DashboardInfo> GetAvailableDashboardsInfo() {
            return GetFileNameList().Select(fileName => {
                return new DashboardInfo {
                    ID = fileName,
                    Name = fileName
                };
            });
        }
        public XDocument LoadDashboard(string dashboardID) {
            if(dashboardID == null) { dashboardID = "dashboard1"; }
            return GetFile(dashboardID);
        }
        public void SaveDashboard(string dashboardID, XDocument dashboard) {
            WriteFile(dashboardID, dashboard);
        }
        public string AddDashboard(XDocument dashboard, string dashboardName) {
            string dashboardID = null;
            string dashboardNamePrefix = "NewDashboard";
            int i = 1;
            var existingDashboards = GetFileNameList();
            do {
                dashboardID = dashboardNamePrefix + i++;
            } while(existingDashboards.Contains(dashboardID));
            WriteFile(dashboardID, dashboard);
            return dashboardID;
        }
    }
}
