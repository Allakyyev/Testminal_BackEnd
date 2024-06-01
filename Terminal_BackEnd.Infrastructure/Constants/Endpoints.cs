namespace Terminal_BackEnd.Infrastructure.Constants {
    public class Endpoints {
        public string userName;
        public string serverName;
        string callBackTransaction;
        string callBackCheckDestination;
        public Endpoints(string userName, string serverName, string callBackTransaction, string callBackCheckDestination) {
            this.userName = userName;
            this.serverName = serverName;
            this.callBackTransaction = callBackTransaction;
            this.callBackCheckDestination = callBackCheckDestination;
            RequestEpochTimeUrl = $"{baseUrl}/api/epoch";
            RequestDealerBalanceUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/dealer/balance";
            RequestServicesListUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/dealer/services";
            RequestAddTransactionUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/txn/add";
            RequestStatusAcceptedTransactionUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/txn/info";
            RequestResendDeclinedTransactionUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/txn/retry";
            RequestChangeServiceDeclinedTransactionUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/txn/change-service";
            RequestForceAddTransactionUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/txn/force/add";
            RequestRegisterTransactionStateCallBackUrl = $"{baseUrl}/{this.callBackTransaction}";
            RequestCheckDestinationServiceUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/cd/add";
            RequestPollCheckDestinationServiceUrl = $"{baseUrl}/api/{this.userName}/{this.serverName}/cd/poll";
            RequestRegisterCheckDestinationCallBackUrl = $"{baseUrl}/{this.callBackCheckDestination}";
        }
        public const string baseUrl = "";
        public readonly string RequestEpochTimeUrl;
        public readonly string RequestDealerBalanceUrl;
        public readonly string RequestServicesListUrl;
        // Transaction
        public readonly string RequestAddTransactionUrl;
        public readonly string RequestStatusAcceptedTransactionUrl;
        public readonly string RequestResendDeclinedTransactionUrl;
        public readonly string RequestChangeServiceDeclinedTransactionUrl;
        public readonly string RequestForceAddTransactionUrl;
        public readonly string RequestRegisterTransactionStateCallBackUrl;
        //Check Destination
        public readonly string RequestCheckDestinationServiceUrl;
        public readonly string RequestPollCheckDestinationServiceUrl;
        public readonly string RequestRegisterCheckDestinationCallBackUrl;
    }
}
