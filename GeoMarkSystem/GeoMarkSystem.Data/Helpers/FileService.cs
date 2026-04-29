using Microsoft.AspNetCore.Http;

namespace GeoMarkSystem.Data.Helpers
{
    public class FileService : IFileService
    {
        public async Task<string> SaveFile(
        IFormFile file,
        string folderName,
        string[] allowedExtensions,
        string[] allowedMimeTypes,
        int maxFileSizeMB = 10
    )
        {
            if (file == null || file.Length == 0)
                return null;

            var extension = Path.GetExtension(file.FileName).ToLower();

            // ✅ Extension validation
            if (!allowedExtensions.Contains(extension))
                throw new Exception($"Invalid file extension. Allowed: {string.Join(", ", allowedExtensions)}");

            // ✅ MIME validation
            if (!allowedMimeTypes.Contains(file.ContentType))
                throw new Exception("Invalid file type.");

            // ✅ Size validation
            if (file.Length > maxFileSizeMB * 1024 * 1024)
                throw new Exception($"File size exceeds {maxFileSizeMB} MB.");

            // ✅ Path
            var rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);

            if (!Directory.Exists(rootPath))
                Directory.CreateDirectory(rootPath);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(rootPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{folderName}/{fileName}";
        }
    }
    public interface IFileService
    {
        Task<string> SaveFile(
            IFormFile file,
            string folderName,
            string[] allowedExtensions,
            string[] allowedMimeTypes,
            int maxFileSizeMB = 20
        );
    }

    public static class FileUploadConfig
    {
        public static readonly string[] ImageExtensions = { ".jpg", ".jpeg", ".png" };
        public static readonly string[] ImageMimeTypes = { "image/jpeg", "image/png" };

        public static readonly string[] PdfExtensions = { ".pdf" };
        public static readonly string[] PdfMimeTypes = { "application/pdf" };

        public static readonly string[] ExcelExtensions = { ".xls", ".xlsx" };
        public static readonly string[] ExcelMimeTypes =
        {
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
    }
}
