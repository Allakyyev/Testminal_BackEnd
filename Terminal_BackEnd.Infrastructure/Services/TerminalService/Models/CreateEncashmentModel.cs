using System.ComponentModel.DataAnnotations;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.TerminalService.Models {
    public class CreateEncashmentModel {
        [Required]
        public long TerminalId { get; set; }
        [Required]
        public int TotalSum { get; set; }
        [Required]
        public EncashmentStatus Status { get; set; }
    }
}
