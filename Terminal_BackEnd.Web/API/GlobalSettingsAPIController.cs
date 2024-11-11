using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services;

namespace Terminal_BackEnd.Web.API {
    public class SettingsModel {
        public int Id { get; set; }
        public string Value { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class GlobalSettingsAPIController : ControllerBase {
        private readonly ISettingsService _settingsService;
        public GlobalSettingsAPIController(ISettingsService settingsService) {
            _settingsService = settingsService;

        }
        [HttpPost("UpdateSettingsBatch")]
        public IActionResult UpdateSettingsBatch([FromBody] List<SettingsModel> models) {
            foreach(var model in models) {
                _settingsService.UpdateGlobalSetting(model.Id, model.Value);
            }
            return Ok();
        }
    }
}
