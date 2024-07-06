using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.ServiceTypes {
    [DataContract]
    public class AddTransactionResponse {
        /// <summary>
        /// 'DUPLICATE' || 'SUCCESS'
        /// </summary>
        [DataMember(Name = "status")]
        public required string Status { get; set; }

        /// <summary>
        /// long: transaction reference number of initial transaction
        /// </summary>
        [DataMember(Name = "ref-num")]
        public required long RefNum { get; set; }

        /// <summary>
        /// service_key of initial transaction
        /// </summary>
        [DataMember(Name = "service")]
        public string? Service { get; set; }

        /// <summary>
        /// msisdn | phone number of initial transaction
        /// </summary>
        [DataMember(Name = "destination")]
        public string? Destination { get; set; }

        /// <summary>
        /// amount of initial transaction
        /// </summary>
        [DataMember(Name = "amount")]
        public int? Amount { get; set; }

        /// <summary>
        ///  state of initial transaction
        ///  NEW - transaction is accepted, not yet processed,
        ///PENDING - txn amount reflected to account, waiting to be processed
        ///PROCESSING - transaction is being processed
        ///WAITING - waiting for result from service provider
        ///SUCCESS - txn was successful
        ///UNKNOWN - state for ASTU services
        ///FAILED - txn has some errors which needs user interaction(correct, change status or reject)
        ///ERROR - temporary error, will be retried automatically 5 times with increasing interval.
        ///REJECTING - reject task added, will be REJECTED after task is processed
        ///REJECTED - transaction was not accepted by a service provider, money should be refunded to account.
        /// </summary>
        [DataMember(Name = "state")]
        public string? State { get; set; }

        // <summary>
        /// DECLINED-BY-[SERVICE|BALANCE]
        /// </summary>
        [DataMember(Name = "reason")]
        public string? Reason { get; set; }

        public bool ConnectionError { get;set; }
        public string? Message { get; set; }
        public IEnumerable<KeyValuePair<string, string>>? FormData { get; set; }
    }
}