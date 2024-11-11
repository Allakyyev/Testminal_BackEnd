using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Services;

namespace Terminal_BackEnd.Web.Controllers {
    public class GlobalSettingsController : Controller {
        private readonly ISettingsService _settingsService;
        public GlobalSettingsController(ISettingsService settingsService) {
            _settingsService = settingsService;
        }
        public IActionResult Index() {
            return View(_settingsService.GetGlobalSettings());
        }
    }
}
