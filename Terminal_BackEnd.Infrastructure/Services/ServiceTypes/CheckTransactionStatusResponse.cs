using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.ServiceTypes {
    [DataContract]
    public class CheckTransactionStatusResponse {
        /// <summary>
        /// long: transaction reference number of initial transaction
        /// </summary>
        [DataMember(Name = "ref-num")]
        public required long RefNum { get; set; }
        
        /// <summary>
        /// service_key of initial transaction
        /// </summary>
        [DataMember(Name = "service")]
        public required string Service { get; set; }

        /// <summary>
        /// msisdn | phone number of initial transaction
        /// </summary>
        [DataMember(Name = "destination")]
        public required string Destination { get; set; }

        /// <summary>
        /// amount of initial transaction
        /// </summary>
        [DataMember(Name = "amount")]
        public int Amount { get; set; }

        /// <summary>
        ///  state of initial transaction
        /// </summary>
        [DataMember(Name = "state")]
        public required string State { get; set; }

        // <summary>
        /// update ts in unix time
        /// </summary>
        [DataMember(Name = "update-ts")]
        public long UpdateTs { get; set; }

        // <summary>
        /// unix time when txn was received
        /// </summary>
        [DataMember(Name = "received-ts")]
        public long ReceivedTs { get; set; }

        // <summary>
        /// Unix time sent by client
        /// </summary>
        [DataMember(Name = "txn-ts")]
        public long TxnTs { get; set; }
    }
}
