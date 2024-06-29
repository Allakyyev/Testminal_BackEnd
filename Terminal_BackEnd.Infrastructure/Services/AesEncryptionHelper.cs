using System.Security.Cryptography;
using System.Text;

namespace Terminal_BackEnd.Infrastructure.Services {
    public static class AesEncryptionHelper {
        static string keyString = "ydWrBMNlIId//Vtgg5QTLxxui+rQyEvTjXPVRe+Ij0I=";
        static string ivString = "GzXbLE8myHcZSXqtyHsYrQ==";
        public static string EncryptString(string plainText) {
            // Convert key and IV from strings to byte arrays
            byte[] key = Encoding.UTF8.GetBytes(keyString);
            byte[] iv = Encoding.UTF8.GetBytes(ivString);

            // Ensure the key and IV are the correct size
            Array.Resize(ref key, 32); // AES-256 requires a 32-byte key
            Array.Resize(ref iv, 16); // AES requires a 16-byte IV

            // Create an AES object with the specified key and IV
            using(Aes aes = Aes.Create()) {
                aes.Key = key;
                aes.IV = iv;

                // Create an encryptor
                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                // Create a memory stream to hold the encrypted data
                using(MemoryStream ms = new MemoryStream()) {
                    // Create a CryptoStream using the memory stream and encryptor
                    using(CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write)) {
                        using(StreamWriter sw = new StreamWriter(cs)) {
                            // Write the plain text to the crypto stream, which encrypts it and writes it to the memory stream
                            sw.Write(plainText);
                        }
                        // Convert the encrypted data from the memory stream to a byte array
                        byte[] encrypted = ms.ToArray();
                        // Convert the byte array to a base64 string and return it
                        return Convert.ToBase64String(encrypted);
                    }
                }
            }
        }

        public static string DecryptString(string cipherText) {
            // Convert key and IV from strings to byte arrays
            byte[] key = Encoding.UTF8.GetBytes(keyString);
            byte[] iv = Encoding.UTF8.GetBytes(ivString);

            // Ensure the key and IV are the correct size
            Array.Resize(ref key, 32); // AES-256 requires a 32-byte key
            Array.Resize(ref iv, 16); // AES requires a 16-byte IV

            // Convert the encrypted text (base64 string) back to a byte array
            byte[] buffer = Convert.FromBase64String(cipherText);

            // Create an AES object with the specified key and IV
            using(Aes aes = Aes.Create()) {
                aes.Key = key;
                aes.IV = iv;

                // Create a decryptor
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                // Create a memory stream to hold the decrypted data
                using(MemoryStream ms = new MemoryStream(buffer)) {
                    // Create a CryptoStream using the memory stream and decryptor
                    using(CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read)) {
                        using(StreamReader sr = new StreamReader(cs)) {
                            // Read the decrypted data from the crypto stream
                            return sr.ReadToEnd();
                        }
                    }
                }
            }
        }
    }
}
