using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services;

namespace Terminal_BackEnd.Web.Services {
    public interface ISecurityService {
        bool TryValidateTerminalId(string terminalIdEncrypted, out Terminal terminal);
        bool TryValidateMsisdn(string msisdnEncrypted, string terminalPassword, out string msisdn);
        public bool ValidateCheckSum(string checksum, string checkSumEncrypted, string terminalPassword);
    }

    public class SecurityService : ISecurityService {
        readonly AppDbContext dbContext;
        public SecurityService(AppDbContext dbContext) {
            this.dbContext = dbContext;
        }
        public bool TryValidateTerminalId(string terminalIdEncrypted, out Terminal terminal) {
            var tId = AesEncryptionHelper.DecryptString(terminalIdEncrypted);
            var tr = dbContext.Terminals.FirstOrDefault(t => t.TerminalId == tId);
            if(tr != null) {
                terminal = tr;
                return true;
            }
            terminal = null;
            return false;
            
        }

        public bool TryValidateMsisdn(string msisdnEncrypted, string terminalPassword, out string msisdn) {
            string terminalPasswordDecrypted = AesEncryptionHelper.DecryptString(terminalPassword);
            string decryptedmsisdn = AesEncryptionHelper.DecryptString(msisdnEncrypted, terminalPasswordDecrypted);
            bool correctPattern = decryptedmsisdn.StartsWith("9936") && decryptedmsisdn.Length == "99365000000".Length;
            bool allNumbers = true;
            foreach(var item in decryptedmsisdn) {
                allNumbers = Char.IsDigit(item);
            }
            if(correctPattern && allNumbers) {
                msisdn = decryptedmsisdn;
                return true;
            }else {
                msisdn = String.Empty;
                return false;
            }
        }

        public bool ValidateCheckSum(string checksum, string checkSumEncrypted, string terminalPassword) {
            string terminalPasswordDecrypted = AesEncryptionHelper.DecryptString(terminalPassword);
            string newcheckSum = AesEncryptionHelper.DecryptString(checkSumEncrypted, terminalPasswordDecrypted);
            return newcheckSum.Equals(checksum);
        }
    }
}
