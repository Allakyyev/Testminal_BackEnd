namespace Terminal_BackEnd.Infrastructure.Constants {
    public static class StateConstants {
        public static class HttpErrorCode {
            public const int BADREQUEST = 400;
            public const int UNAUTHORIZED = 401;
            public const int FORBIDDEN = 403;
            public const int NOTFOUND = 404;
            public const int REQUESTTIMEOUT = 408;
            public const int CONFLICT = 409;
            public const int INTERNALSERVERERROR = 500;
        }
        public static class TransactionState {
            /// <summary>
            /// NEW - transaction, not send to gateway
            /// </summary>
            public const string NEW = "NEW";

            /// <summary>
            /// PROCESSING - transaction is being locally processed(trying to send to gateway)
            /// </summary>
            public const string PROCESSING = "PROCESSING";

            /// <summary>
            ///  ERRCONN - connection error, could not send transaction to gateway, retry later
            /// </summary>
            public const string ERRCONN = "ERR-CONN";

            /// <summary>
            /// DECLINED - transaction declined by the gateway, ref_num given.Money should be returned to subscriber
            /// </summary>
            public const string DECLINED = "DECLINED";

            /// <summary>
            /// ACCEPTED - transaction is accepted by the gateway, ref_num given
            /// </summary>
            public const string ACCEPTED = "ACCEPTED";

            /// <summary>
            /// GW-PROCESSING - transaction is being processed by the gateway
            /// </summary>
            public const string GWPROCESSING = "GW-PROCESSING";

            /// <summary>
            /// SUCCESS - transaction successfully processed by the gateway, finish
            /// </summary>
            public const string SUCCESS = "SUCCESS";

            /// <summary>
            /// FAILED - transaction failed at the gateway, needs user interaction
            /// </summary>
            public const string FAILED = "FAILED";

            /// <summary>
            /// REJECTED - transaction rejected at the gateway, finish.Money should be returned to subscriber}
            /// </summary>
            public const string REJECTED = "REJECTED";
        }
        public static class CheckDestinationState {
            /// <summary>
            ///  NOT-AVAILABLE  - check dest is not available for this service
            /// </summary>
            public const string NOTAVAILABLE = "NOT-AVAILABLE";

            /// <summary>
            ///  DECLINED - check dest not accepted, because service of user is not enabled
            /// </summary>
            public const string DECLINED = "DECLINED";

            /// <summary>
            /// NEW - check dest is accepted, not yet processed,
            /// </summary>
            public const string NEW = "NEW";

            /// <summary>
            /// PROCESSING - check dest is being processed
            /// </summary>
            public const string PROCESSING = "PROCESSING";

            public const string GWPROCESSING = "GW-PROCESSING";
            /// <summary>
            /// WAITING - waiting result from service provider
            /// </summary>
            public const string WAITING = "WAITING";

            /// <summary>
            /// OK - check dest was successful, dest allowed to receive payments for service
            /// </summary>
            public const string OK = "OK";

            /// <summary>
            /// NOT-ALLOWED - dest not allowed receiving payments for service
            /// </summary>
            public const string NOTALLOWED = "NOT-ALLOWED";

            /// <summary>
            /// FAILED - check dest is failed, should retry later.
            /// </summary>
            public const string FAILED = "FAILED";

            public const string RETRYLATER = "RETRY-LATER";
        }
    }
}
