using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Services.TerminalService.Models;
using Terminal_BackEnd.Web.Services;
using Terminal_BackEnd.Web.Services.Model;

namespace Terminal_BackEnd.Web.Controllers {
    [Authorize]
    public class EncashmentsController : Controller {
        readonly ITransactionControllerService _transactionControllerService;
        public EncashmentsController(ITransactionControllerService transactionControllerService) {
            this._transactionControllerService = transactionControllerService;
        }
        public IActionResult Index() {
            return View();
        }

        public IActionResult EncashmentDetails(long id) {
            var encashment = this._transactionControllerService.GetEncashmentById(id);
            var terminal = encashment.Terminal;
            EncashmentViewModel enchargementViewModel = new EncashmentViewModel() {
                Id = encashment.Id,
                EncashmentDate = encashment.EncashmentDate,
                EncashmentSum = encashment.EncashmentSum,
                TerminalId = encashment.TerminalId,
                TerminalName = terminal?.Name ?? String.Empty,
                TerminalOwner = $"{terminal.ApplicationUser?.FamilyName ?? String.Empty} {terminal.ApplicationUser?.CompanyName ?? String.Empty}",
                EncashmentSumFromTerminal = encashment.EncashmentSumFromTerminal,
                BalanceDifference = encashment.EncashmentSum - encashment.EncashmentSumFromTerminal,
                Status = encashment.Status
            };
            return View(enchargementViewModel);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult Create() {
            return View(new CreateEncashmentModel());
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateEncashmentModel model) {
            if(ModelState.IsValid) {
                var result = await _transactionControllerService.CreateEncashment(model.TerminalId, model.TotalSum, model.EncashmentDate, model.Status);
            }
            return RedirectToAction("Index");
        }
    }
}
