using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.ViewModels {
    public class ApplicationUserViewModel : ApplicationUser {
        public string? Role { get; set; }
        public long CurrentTotal { get; set; }
    }
}
