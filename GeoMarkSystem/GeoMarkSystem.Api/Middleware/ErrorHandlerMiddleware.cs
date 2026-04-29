using GeoMarkSystem.Data.Services;
using System.Net;
using System.Text.Json;

namespace GeoMarkSystem.Api.Middleware
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IErrorLogsService _errorLogService;
        public ErrorHandlerMiddleware(RequestDelegate next, IErrorLogsService errorLogService)
        {
            _next = next;
            _errorLogService = errorLogService;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {

                _errorLogService.LogExceptionAsync(error);

                var response = context.Response;
                response.ContentType = "application/json";

                switch (error)
                {
                    case AppException e:
                        // custom application error
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        break;
                    case KeyNotFoundException e:
                        // not found error
                        response.StatusCode = (int)HttpStatusCode.NotFound;
                        break;
                    default:
                        // unhandled error
                        response.StatusCode = (error.Source == "Stripe.net") ? (int)HttpStatusCode.OK : (int)HttpStatusCode.InternalServerError;
                        break;
                }
                var result = JsonSerializer.Serialize(new { success = false, message = error?.Message });
                await response.WriteAsync(result);
            }
        }
    }
}
