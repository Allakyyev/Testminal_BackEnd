using System.Runtime.Serialization;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;

namespace Terminal_BackEnd.Infrastructure.Services.DataContracts {
    [DataContract]
    public class CheckDestinationAPIResponse : APIResponseBase {
        [DataMember(Name = "dealerTotal")]
        public long DealerTotal { get; set; }
    }

    [DataContract]
    public class ForceAddAPIResponse : APIResponseBase { }

    [DataContract]
    public class AddEnchargementAPIResponse : APIResponseBase { }

    [DataContract]
    public class RegisterTerminalResponse : APIResponseBase { }

    [DataContract]
    public class LogTerminalResponse : APIResponseBase { }

    [DataContract]
    public class PingTerminalResponse : APIResponseBase { }
}
