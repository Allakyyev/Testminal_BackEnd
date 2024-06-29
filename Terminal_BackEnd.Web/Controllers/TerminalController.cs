using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.TerminalService;
using Terminal_BackEnd.Infrastructure.Services.TerminalService.Models;

namespace Terminal_BackEnd.Web.Controllers {
    [Authorize]
    public class TerminalController : Controller {
        private readonly ITerminalService terminalService;
        private readonly IMapper mapper;
        public TerminalController(ITerminalService terminalService, IMapper mapper) {
            this.terminalService = terminalService;
            this.mapper = mapper;
        }

        public IActionResult Index() {
            return View();
        }

        [HttpGet]
        public IActionResult Create() {
            return View(new CreateTerminalModel() {
                Name = String.Empty,
                TerminalId = Guid.NewGuid().ToString(),
                UserId = String.Empty,
                Status = TerminalStatus.Active
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CreateTerminalModel model) {
            if(ModelState.IsValid) {
                terminalService.CreateTerminal(model);
                return RedirectToAction("Index");
            } else {
                return View(model);
            }
        }

        [HttpGet]
        public IActionResult GetPasswordEncrypt([FromQuery] long id) {
            (byte[] passwordEncrypted, string fileName) = terminalService.GetPasswordEncrypt(id);
            return File(passwordEncrypted, "text/plain", fileName);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult Edit(long id) {
            var terminal = terminalService.GetAllTerminalById(id);
            if(terminal != null) {
                return View(terminal);
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Edit(Terminal terminal) {            
            if(terminal != null) {
                terminalService.UpdateTerminal(terminal);
                return RedirectToAction("Index");
            }
            return RedirectToAction("Index");
        }

        [HttpDelete]
        public IActionResult Delete(string id) {
            return View();
        }

    }
}
