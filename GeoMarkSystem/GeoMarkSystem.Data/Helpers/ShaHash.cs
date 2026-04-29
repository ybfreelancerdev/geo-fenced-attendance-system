using System;
using System.Security.Cryptography;
using System.Text;

namespace GeoMarkSystem.Data.Helpers
{
    public class ShaHash
    {
        // Use a fixed key/IV (store securely, e.g. in appsettings or Key Vault)
        private static readonly byte[] Key = Convert.FromBase64String("TByRgv3hCe0bUcnqEyIkuK8wlNNbh+AQ8ftHY9W0Y8w="); // 32 bytes
        private static readonly byte[] IV = Convert.FromBase64String("CkQ1mAHqQf0ajq9aKQ0R5Q=="); // 16 bytes

        public static string Encrypt(string plainText)
        {
            using var aes = Aes.Create();
            aes.Key = Key;
            aes.IV = IV;

            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
            byte[] encrypted = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

            return Convert.ToBase64String(encrypted);
        }

        public static string Decrypt(string cipherText)
        {
            using var aes = Aes.Create();
            aes.Key = Key;
            aes.IV = IV;

            using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            byte[] decrypted = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);

            return Encoding.UTF8.GetString(decrypted);
        }
    }
}