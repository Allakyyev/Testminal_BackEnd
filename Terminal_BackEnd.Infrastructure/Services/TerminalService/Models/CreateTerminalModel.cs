using System.ComponentModel.DataAnnotations;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.TerminalService.Models {
    public class CreateTerminalModel {
        [Required]
        public string TerminalId { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string UserId { get; set; }
        [Required]
        public TerminalStatus Status { get; set; }
    }
}
