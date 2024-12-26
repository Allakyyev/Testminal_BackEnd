using System.Security.Claims;
using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.TerminalService;
using Terminal_BackEnd.Infrastructure.Services.TerminalService.Models;
using Terminal_BackEnd.Web.SignalR;

namespace Terminal_BackEnd.Web.API {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TerminalAPIController : ControllerBase {
        private readonly ITerminalService terminalService;
        private readonly IHubContext<CommandHub> hubContext;
        public TerminalAPIController(ITerminalService terminalService, IHubContext<CommandHub> hubContext) {
            this.terminalService = terminalService;
            this.hubContext = hubContext;
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

        [HttpGet("Logs/{terminalId}")]
        public object Logs(DataSourceLoadOptions loadOptions, long terminalId) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                return DataSourceLoader.Load<TerminalLogViewModel>(terminalService.TerminalLogs(terminalId), loadOptions);
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
                var terminalLogs = terminal.TerminalLogs;
                LogType logType = LogType.Repaired;
                if(terminalLogs != null && terminalLogs.Count() > 0) {
                    var lastLog = terminalLogs.OrderByDescending(t => t.LogDate).First();
                    logType = lastLog.Type;
                    if(terminal.Transactions?.Count() > 0) {
                        var lastTransaction = terminal.Transactions.OrderByDescending(t => t.TransactionDate).First();
                        if(lastTransaction.TransactionDate > lastLog.LogDate)
                            logType = LogType.Repaired;
                    }
                }
                string healthMessage = logType == LogType.Error ? "В ошибочном состоянии. " : "В рабочем состоянии. ";
                if(terminal.LastPing.AddMinutes(30) < DateTime.Now) {
                    healthMessage += "Нет сигнала от Терминала";
                }
                var terminalViewModel = new TerminalViewModel() {
                    Id = terminal.Id,
                    TerminalNumber = terminal.Id.ToString("D4"),
                    Name = terminal.Name,
                    TerminalId = terminal.TerminalId,
                    Status = terminal.Status == TerminalStatus.Active ? "Active" : "Inactive",
                    Owner = $"{terminal.ApplicationUser?.CompanyName}  {terminal.ApplicationUser?.FamilyName} {terminal.ApplicationUser?.FirstName}",
                    CurrentTotal = terminalService.GetTerminalCurrenTotal(terminal.Id),
                    DeviceCPUId = terminal.DeviceCPUId,
                    DeviceMotherBoardId = terminal.DeviceMotherBoardId,
                    Healthy = healthMessage,
                    LogType = logType
                };
                terminalsViewModel.Add(terminalViewModel);
            }
            return terminalsViewModel;
        }

        [HttpGet("restart/{terminalId}")]
        public IActionResult RestartTerminal(long terminalId) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                var terminal = terminalService.GetTerminalById(terminalId);
                if(terminal != null && terminal.UserId == User.FindFirst(ClaimTypes.NameIdentifier)?.Value || User.IsInRole(ConstantsCommon.Role.Admin)) {
                    this.hubContext.Clients.All.SendAsync("Restart", terminal?.TerminalId);
                    return Ok();
                } else {
                    return Forbid();
                }
            } else {
                return Unauthorized();
            }
        }

        [HttpGet("restartOS/{terminalId}")]
        public IActionResult RestartOS(long terminalId) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                var terminal = terminalService.GetTerminalById(terminalId);
                if(terminal != null && terminal.UserId == User.FindFirst(ClaimTypes.NameIdentifier)?.Value || User.IsInRole(ConstantsCommon.Role.Admin)) {
                    this.hubContext.Clients.All.SendAsync("RestartOS", terminal?.TerminalId);
                    return Ok();
                } else {
                    return Forbid();
                }
            } else {
                return Unauthorized();
            }
        }
    }
}
