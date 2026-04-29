
namespace GeoMarkSystem.Data.Common
{
    public class OperationResult<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        public OperationResult() { }

        public OperationResult(bool success, string? message = null, T? data = default)
        {
            Success = success;
            Message = message;
            Data = data;
        }

        // 🔹 Success response
        public static OperationResult<T> Ok(T data, string? message = null)
        {
            return new OperationResult<T>(true, message, data);
        }

        // 🔹 Error response
        public static OperationResult<T> Fail(string message)
        {
            return new OperationResult<T>(false, message, default);
        }
    }
}