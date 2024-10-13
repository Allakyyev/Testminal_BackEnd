using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.TerminalService;
using Terminal_BackEnd.Infrastructure.Services.TerminalService.Models;

namespace Terminal_BackEnd.Web.API {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TerminalAPIController : ControllerBase {
        private readonly ITerminalService terminalService;
        public TerminalAPIController(ITerminalService terminalService) {
            this.terminalService = terminalService;
        }
        [HttpGet]
        public async Task<object?> Get(DataSourceLoadOptions loadOptions) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                if(User.IsInRole(ConstantsCommon.Role.Admin)) {
                    return DataSourceLoader.Load<TerminalViewModel>(MapToViewModel(terminalService.GetAllTerminals()), loadOptions);
                } else if(User.IsInRole(ConstantsCommon.Role.Standard)) {
                    return DataSourceLoader.Load<TerminalViewModel>(MapToViewModel(terminalService.GetAllTerminalsByUser(User.Identity.Name)), loadOptions);
                }
            }
            return Unauthorized();
        }

        [HttpDelete()]
        public IActionResult Delete([FromForm] long key) {
            if(!User.IsInRole("Admin")) return BadRequest();
            terminalService.DeleteTerminalById(key);
            return Ok();
        }

        List<TerminalViewModel> MapToViewModel(List<Terminal> terminals) {
            var terminalsViewModel = new List<TerminalViewModel>();
            foreach(var terminal in terminals) {
                var terminalViewModel = new TerminalViewModel() {
                    Id = terminal.Id,
                    Name = terminal.Name,
                    TerminalId = terminal.TerminalId,
                    Status = terminal.Status == TerminalStatus.Active ? "Active" : "Inactive",
                    Owner = $"{terminal.ApplicationUser?.CompanyName}  {terminal.ApplicationUser?.FamilyName} {terminal.ApplicationUser?.FirstName}",
                    CurrentTotal = terminalService.GetTerminalCurrenTotal(terminal.Id),
                    DeviceCPUId = terminal.DeviceCPUId,
                    DeviceMotherBoardId = terminal.DeviceMotherBoardId
                };
                terminalsViewModel.Add(terminalViewModel);
            }
            return terminalsViewModel;
        }

    }
}
