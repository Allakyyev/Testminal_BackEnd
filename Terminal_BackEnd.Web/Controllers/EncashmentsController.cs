using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Web.Services;
using Terminal_BackEnd.Web.Services.Model;

namespace Terminal_BackEnd.Web.Controllers {
    public class EncashmentsController : Controller {
        readonly ITransactionControllerService _transactionControllerService;
        public EncashmentsController(ITransactionControllerService transactionControllerService)
        {
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
                TerminalOwner = $"{terminal.ApplicationUser?.FamilyName ?? String.Empty} {terminal.ApplicationUser?.CompanyName ?? String.Empty}"
            };
            return View(enchargementViewModel);
        }
    }
}
