using Microsoft.AspNetCore.Mvc;

namespace Terminal_BackEnd.Web.Controllers {
    public class ReportsController : Controller {
        public IActionResult Index() {
            return View();
        }
    }
}
