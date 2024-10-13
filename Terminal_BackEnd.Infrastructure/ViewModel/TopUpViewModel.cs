using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.ViewModel {
    public class TopUpViewModel : Topup {
        public long CurrentTotal { get; set; }
    }
}
