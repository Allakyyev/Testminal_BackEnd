using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Services.ReportService;
using Terminal_BackEnd.Web.Models;

namespace Terminal_BackEnd.Web.Controllers {
    [Authorize(Roles = "Cashier, Admin")]
    public class AdvReportsController : Controller {
        private readonly AppDbContext _dbContex;
        private readonly IReportService reportService;
        public AdvReportsController(AppDbContext appDbContext, IReportService reportService) {
            this._dbContex = appDbContext;
            this.reportService = reportService;
        }
        // GET: AdvReports
        public ActionResult Index() {
            return View();
        }

        [HttpGet]
        public IActionResult GetAvailableIds() {

            var terminals = this._dbContex.Terminals.ToList();
            var availableIds = new List<ListItem>();
            terminals.ForEach(terminal => {
                availableIds.Add(new ListItem { Id = terminal.Id, Name = terminal.Name });
            });
            return Json(availableIds);
        }

        [HttpGet]
        public object GetReports(DateTime startDate, DateTime endDate, string ids) {
            if(string.IsNullOrEmpty(ids)) return Json(new List<string>());
            var idList = ids.Split(',').Select(long.Parse).ToList();
            var result = reportService.GetTerminalTranactionsByDaysReport(idList, DateOnly.FromDateTime(startDate), DateOnly.FromDateTime(endDate));
            return result;
        }
    }
}
