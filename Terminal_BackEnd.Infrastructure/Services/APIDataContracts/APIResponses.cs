using System.Runtime.Serialization;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;

namespace Terminal_BackEnd.Infrastructure.Services.DataContracts {
    [DataContract]
    public class CheckDestinationAPIResponse : APIResponseBase {}

    [DataContract]
    public class ForceAddAPIResponse : APIResponseBase { }

    [DataContract]
    public class AddEnchargementAPIResponse : APIResponseBase { }
}
