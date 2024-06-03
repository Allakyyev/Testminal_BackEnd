using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Services.ServiceTypes;

namespace Terminal_BackEnd.Infrastructure.Services
{
    public class ServiceProviderAPIService : IServiceProviderAPIService {
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
            var content = new FormUrlEncodedContent(formData);
            HttpResponseMessage response = await _httpClient.PostAsync(url, content);
            string responseBody = await response.Content.ReadAsStringAsync();            
            RequestResponse requestResponse = JsonSerializer.Deserialize<RequestResponse>(responseBody) ?? new RequestResponse();
            requestResponse.HttpResponseMessage= response;
            return requestResponse;
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

        public async Task<RequestResponse> RequestEpochAsync() {
            Func<Task<RequestResponse>> request = async () => await PostFormAsync(this._endPoints.RequestEpochTimeUrl, new Dictionary<string, string>());
            return await PostWithRentryAsync(request, RetryCount);
        }

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
