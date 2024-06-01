using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Terminal_BackEnd.Infrastructure.Constants;

namespace Terminal_BackEnd.Infrastructure.Services {
    public class ServiceProviderAPIService {
        private readonly HttpClient _httpClient;
        private readonly Endpoints _endPoints;

        public const int RetryCount = 2;

        public ServiceProviderAPIService(Endpoints endpoints) {
            _httpClient = new HttpClient();
            this._endPoints = endpoints;
        }

        private long GetCurrentEpochTime() {
            DateTimeOffset now = DateTimeOffset.UtcNow;
            return now.ToUnixTimeSeconds();
        }

        private static string ComputeHMACSHA1(string key, string message) {
            // Convert the key and message into byte arrays
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] messageBytes = Encoding.UTF8.GetBytes(message);

            // Initialize the HMACSHA1 with the key
            using(HMACSHA1 hmacsha1 = new HMACSHA1(keyBytes)) {
                // Compute the hash
                byte[] hashBytes = hmacsha1.ComputeHash(messageBytes);

                // Convert the hash to a hexadecimal string
                StringBuilder sb = new StringBuilder();
                for(int i = 0; i < hashBytes.Length; i++) {
                    sb.Append(hashBytes[i].ToString("x2"));
                }

                return sb.ToString();
            }
        }


        private async Task<RequestResponse> PostFormAsync(string url, Dictionary<string, string> formData) {
            //try {
            var content = new FormUrlEncodedContent(formData);
            HttpResponseMessage response = await _httpClient.PostAsync(url, content);
            //response.EnsureSuccessStatusCode(); // Throws if not 200-299
            string responseBody = await response.Content.ReadAsStringAsync();
            RequestResponse requestResponse = JsonSerializer.Deserialize<RequestResponse>(responseBody);
            return requestResponse;
            /*} catch(HttpRequestException e) {
                // Handle exception (log it, rethrow it, return an error message, etc.)
                Console.WriteLine($"Request error: {e.Message}");
                int statusCode = StateConstants.HttpErrorCode.BADREQUEST;
                if(e.StatusCode != null) {
                    statusCode = (int)e.StatusCode.Value;
                }
                return new RequestResponse() {
                    ErrorMessage = e.Message,
                    ErrorCode = statusCode,
                    Result = null,
                    Status = null
                };
            }
            */
        }

        private async Task<RequestResponse> PostWithRentryAsync(Func<Task<RequestResponse>> request, int retryCount) {
            RequestResponse result;
            try {
                result = await request();
            } catch(HttpRequestException e) {
                int statusCode = StateConstants.HttpErrorCode.BADREQUEST;
                if(e.StatusCode != null) {
                    statusCode = (int)e.StatusCode.Value;
                }
                return new RequestResponse() {
                    ErrorMessage = e.Message,
                    ErrorCode = statusCode,
                    Result = null,
                    Status = null
                };
            }
            if(result.Status == null || result.Status != "SUCCESS") {
                if(retryCount == retryCount)
                    return result;
                else
                    return await PostWithRentryAsync(request, retryCount + 1);
            }
            return result;
        }
        /// <summary>
        /// Get Server Epoch Time
        /// </summary>        
        /// <returns>Number of seconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970, not counting leap seconds.</returns>
        public async Task<RequestResponse> RequestEpochAsync() {
            Func<Task<RequestResponse>> request = async () => await PostFormAsync(this._endPoints.RequestEpochTimeUrl, new Dictionary<string, string>());
            return await PostWithRentryAsync(request, RetryCount);
        }

        /// <summary>
        /// Get the Dealer service list
        /// </summary>
        /// <param name="key">Dealer password or key </param>        
        /// <returns>'result': { 'services': [<list of enabled service keys>]}</returns>
        public async Task<RequestResponse> RequestGetServicesAsync(string key) {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{currentEpochTime}:{_endPoints.userName}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            Func<Task<RequestResponse>> request = async () => await PostFormAsync(this._endPoints.RequestServicesListUrl, formData);
            return await PostWithRentryAsync(request, RetryCount);
        }

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
        public async Task<RequestResponse> RequestAddTransactionAsync(string key, string localTransactionId, string serviceKey, int amount, string msisdn) {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{localTransactionId}:{serviceKey}:{amount}:{msisdn}:{currentEpochTime - 10}:{currentEpochTime}:{_endPoints.userName}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "local-id", $"{localTransactionId}" },
                { "service", $"{serviceKey}" },
                { "amount", $"{amount}" },
                { "destination", $"{msisdn}" },
                { "txn-ts", $"{currentEpochTime-10}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync(this._endPoints.RequestAddTransactionUrl, formData);
        }

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
        public async Task<RequestResponse> RequestCheckStatusTransactionAsync(string key, string localTransactionId) {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{localTransactionId}:{currentEpochTime}:{_endPoints.userName}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "local-id", $"{localTransactionId}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync(this._endPoints.RequestStatusAcceptedTransactionUrl, formData);
        }

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
        //'received-ts': unix time when txn was received,
        ///'txn-ts': unix time sent by client
        ///}
        /// </returns>
        public async Task<RequestResponse> RequestResendDeclinedTransactionAsync(string key, string localTransactionId) {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{localTransactionId}:{currentEpochTime}:{_endPoints.userName}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "local-id", $"{localTransactionId}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync(this._endPoints.RequestResendDeclinedTransactionUrl, formData);
        }

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
        public async Task<RequestResponse> RequestChangeServiceTransactionAsync(string key, string localTransactionId, string serviceKey) {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{localTransactionId}:{serviceKey}:{currentEpochTime}:{_endPoints.userName}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "local-id", $"{localTransactionId}" },
                { "service", $"{serviceKey}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync(this._endPoints.RequestChangeServiceDeclinedTransactionUrl, formData);
        }

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
        public async Task<RequestResponse> RequestForceAddTransactionAsync(string key, string localTransactionId, string serviceKey, int amount, string msisdn) {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{localTransactionId}:{serviceKey}:{amount}:{msisdn}:{currentEpochTime - 10}:{currentEpochTime}:{_endPoints.userName}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "local-id", $"{localTransactionId}" },
                { "service", $"{serviceKey}" },
                { "amount", $"{amount}" },
                { "destination", $"{msisdn}" },
                { "txn-ts", $"{currentEpochTime-10}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync(this._endPoints.RequestForceAddTransactionUrl, formData);
        }

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
        public async Task<RequestResponse> RequestRegisterTransactionStateCallbackAsync(string key, string callBackUrl, string server_label, string localTransactionId, string state, string action = "txn-state") {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{_endPoints.userName}:{server_label}:{action}:{localTransactionId}:{state}:{currentEpochTime}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "username", $"{_endPoints.userName}" },
                { "server-label", $"{server_label}" },
                { "action", $"{action}" },
                { "local-id", $"{localTransactionId}" },
                { "state", $"{state}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync($"{this._endPoints.RequestRegisterTransactionStateCallBackUrl}/{callBackUrl}", formData);
        }

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
        public async Task<RequestResponse> RequestCheckDestinationAsync(string key, string serviceKey, string msisdn) {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{msisdn}:{serviceKey}:{currentEpochTime}:{_endPoints.userName}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "destination", $"{msisdn}" },
                { "service", $"{serviceKey}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync(this._endPoints.RequestCheckDestinationServiceUrl, formData);
        }

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
        public async Task<RequestResponse> RequestPollDestinationAsync(string key, string serviceKey, string msisdn) {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{msisdn}:{serviceKey}:{currentEpochTime}:{_endPoints.userName}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "destination", $"{msisdn}" },
                { "service", $"{serviceKey}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync(this._endPoints.RequestPollCheckDestinationServiceUrl, formData);
        }

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
        public async Task<RequestResponse> RequestRegisterCheckDestinationCallbackAsync(string key, string callBackUrl, string serviceKey, string server_label, string msisdn, string state, string action = "cd-state") {
            long currentEpochTime = GetCurrentEpochTime();
            string message = $"{_endPoints.userName}:{server_label}:{action}:{serviceKey}:{msisdn}:{state}:{currentEpochTime}";
            string hMac = ComputeHMACSHA1(key, message);
            var formData = new Dictionary<string, string>() {
                { "username", $"{_endPoints.userName}" },
                { "server-label", $"{server_label}" },
                { "action", $"{action}" },
                { "service", $"{serviceKey}" },
                { "destination", $"{msisdn}" },
                { "state", $"{state}" },
                { "ts", $"{currentEpochTime}" },
                { "hmac", hMac }
            };
            return await PostFormAsync($"{this._endPoints.RequestRegisterCheckDestinationCallBackUrl}/{callBackUrl}", formData);
        }
    }
}
