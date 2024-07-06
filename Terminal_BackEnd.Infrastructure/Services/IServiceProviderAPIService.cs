using Terminal_BackEnd.Infrastructure.Services.ServiceTypes;

namespace Terminal_BackEnd.Infrastructure.Services
{
    public interface IServiceProviderAPIService {
        /// <summary>
        ///  Server Epoch Time
        /// </summary>
        /// <returns>Number of seconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970, not counting leap seconds.</returns>
        Task<RequestResponse> RequestEpochAsync();

        /// <summary>
        /// Get the Dealer service list
        /// </summary>
        /// <param name="key">Dealer password or key </param>        
        /// <returns>'result': { 'services': [<list of enabled service keys>]}</returns>
        Task<RequestResponse> RequestGetServicesAsync(string key);

        /// <summary>
        /// Add Transaction
        /// </summary>
        /// <param name="key"></param>
        /// <param name="localTransactionId">client id of transaction (max 30 chars)</param>
        /// <param name="serviceKey">service key (can be received from 0.3. Services Request)</param>
        /// <param name="amount">transaction amount in cents (100 for 1 manat)</param>
        /// <param name="msisdn">msisdn (no country code for mts and tmcell)</param>
        /// <param name="localTransactionEpoch">epoch time at client</param>
        /// <returns></returns>
        Task<RequestResponse> RequestAddTransactionAsync(string key, string localTransactionId, string serviceKey, int amount, string msisdn);

        /// <summary>
        /// Status Check of Accepted Transaction
        /// </summary>
        /// <param name="key">Dealer password or key</param>
        /// <param name="localTransactionId">client id of transaction (max 30 chars)</param>
        /// <returns>
        /// 'result': {
        ///'ref-num': <long: transaction reference number of initial transaction>,
        ///'service': service_key of initial transaction,
        ///'destination': destination of initial transaction,
        ///'amount': amount of initial transaction,
        ///'state': state of initial transaction,
        ///'update-ts': update ts in unix time,
        ///'received-ts': unix time when txn was received,
        ///'txn-ts': unix time sent by client
        ///}
        /// </returns>
        Task<RequestResponse> RequestCheckStatusTransactionAsync(string key, string localTransactionId);

        /// <summary>
        /// Dealer can resend transactions, which were declined for example when he had no balance or limit.
        /// </summary>
        /// <param name="key">Dealer password or key</param>
        /// <param name="localTransactionId">client id of transaction (max 30 chars)</param>
        /// <returns>
        /// 'result': {
        ///'status': 'SUCCESS',
        ///'ref-num': <long: transaction reference number of initial transaction>,
        ///'service': service_key of initial transaction,
        ///'destination': destination of initial transaction,
        ///'amount': amount of initial transaction,
        ///'state': state of initial transaction,
        ///'update-ts': update ts in unix time,
        ///'received-ts': unix time when txn was received,
        ///'txn-ts': unix time sent by client
        ///}
        /// </returns>
        Task<RequestResponse> RequestResendDeclinedTransactionAsync(string key, string localTransactionId);

        /// <summary>
        /// Dealer can change service of declined by service transaction to correct one.
        /// </summary>
        /// <param name="key">Dealer password or key</param>
        /// <param name="localTransactionId">client id of transaction (max 30 chars)</param>
        /// <param name="serviceKey">new service key</param>
        /// <returns>
        /// 'result': {
        ///'status': 'SUCCESS',
        ///'ref-num': <long: transaction reference number of initial transaction>,
        ///'service': service_key of updated transaction,
        ///'destination': destination of initial transaction,
        ///'amount': amount of initial transaction,
        ///'state': state of initial transaction,
        ///'update-ts': update ts in unix time,
        ///'received-ts': unix time when txn was received,
        ///'txn-ts': unix time sent by client
        ///}</returns>
        Task<RequestResponse> RequestChangeServiceTransactionAsync(string key, string localTransactionId, string serviceKey);

        /// <summary>
        /// Add transaction or resend declined transaction, all in one place. Note that, if transaction is DECLINED, parameters will be used from information already at the gateway.
        /// </summary>
        /// <param name="key">Dealer password or key</param>
        /// <param name="localTransactionId">client id of transaction (max 30 chars)</param>
        /// <param name="serviceKey">service key (can be received from 0.3. Services Request)</param>
        /// <param name="amount">transaction amount in cents (100 for 1 manat)</param>
        /// <param name="msisdn">msisdn (no country code for mts and tmcell)</param>
        /// <returns>'result': {
        ///'status': 'SUCCESS',
        ///'ref-num': <long: transaction reference number>,
        ///'service': service_key,
        ///'destination': destination,
        ///'amount': amount,
        ///'state': state of txn,
        ///'update-ts': update ts in unix time,
        ///'received-ts': unix time when txn was received,
        ///'txn-ts': unix time sent by client
        ///}</returns>
        Task<RequestResponse> RequestForceAddTransactionAsync(string key, string localTransactionId, string serviceKey, int amount, string msisdn, Dictionary<string, string>? _formData);

        /// <summary>
        /// Callback is an address on a dealer's server which will be used to inform a sender of transaction about it's state change in order to make system asynchronous. Dealer no more needs to POLL the processing gateway for transaction state.
        /// </summary>
        /// <param name="key">Dealer password or key</param>
        /// <param name="callBackUrl">Back-End post API address to which state change notification will be made</param>
        /// <param name="server_label">server label</param>
        /// <param name="localTransactionId">client id of transaction</param>
        /// <param name="state">current state of transaction</param>
        /// <param name="action">'txn-state'</param>
        /// <returns></returns>
        Task<RequestResponse> RequestRegisterTransactionStateCallbackAsync(string key, string callBackUrl, string server_label, string localTransactionId, string state, string action = "txn-state");

        /// <summary>
        /// Check Destination
        /// </summary>
        /// <param name="key">Dealers password or key</param>
        /// <param name="serviceKey">service key</param>
        /// <param name="msisdn">msisdn (no country code for mts and tmcell)</param>
        /// <returns>
        /// 'result': {
        ///'status': 'SUCCESS',
        ///'state': 'NOT-AVAILABLE|OK|NOT-ALLOWED|RETRY-LATER|GW-PROCESSING',
        ///'service': service_key of check destinaiton,
        ///'destination': destination
        ///}</returns>
        Task<RequestResponse> RequestCheckDestinationAsync(string key, string serviceKey, string msisdn);

        /// <summary>
        /// Poll Check Destination State
        /// </summary>
        /// <param name="key">Dealers password or key</param>
        /// <param name="serviceKey">service key</param>
        /// <param name="msisdn">msisdn (no country code for mts and tmcell)</param>
        /// <returns>
        /// 'result': {
        ///'status': 'SUCCESS',
        ///'state': 'NOT-AVAILABLE|OK|NOT-ALLOWED|RETRY-LATER|GW-PROCESSING',
        ///'service': service_key of check destinaiton,
        ///'destination': destination
        ///}</returns>
        Task<RequestResponse> RequestPollCheckDestinationAsync(string key, string serviceKey, string msisdn);

        /// <summary>
        /// Callback is an address on a dealer's server which will be used to inform a sender of Check Destination about it's state change in order to make system asynchronous. Dealer no more needs to POLL the processing gateway for Check Destination state.
        /// </summary>
        /// <param name="key">Dealer password or key</param>
        /// <param name="callBackUrl">Back-end url to handle registered Check Destination results</param>
        /// <param name="serviceKey">service_key </param>
        /// <param name="server_label"></param>
        /// <param name="msisdn">destination msisdn</param>
        /// <param name="state">current state of check destination request</param>
        /// <param name="action">'cd-state'</param>
        /// <returns></returns>
        Task<RequestResponse> RequestRegisterCheckDestinationCallbackAsync(string key, string callBackUrl, string serviceKey, string server_label, string msisdn, string state, string action = "cd-state");

    }
}
