using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Web.Services;

namespace Terminal_BackEnd.Web.Controllers {    
    [Authorize]
    public class TransactionController : Controller {
        readonly ITransactionControllerService _transactionControllerService;
        public TransactionController(ITransactionControllerService transactionControllerService)
        {
            this._transactionControllerService = transactionControllerService;
        }
        public IActionResult Index() {
            return View();
        }

        public IActionResult TransactionDetails([FromQuery] long id) {
            var transactionViewModel = _transactionControllerService.GetTransactionViewModel(id);
            return View(transactionViewModel);
        }
    }
}
