using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Models.Entities
{
    public class ErrorLogs
    {
        public int Id { get; set; }
        public System.DateTime? CreatedTime { get; set; }
        public long? CreatedBy { get; set; }
        public string Message { get; set; }
        public string Source { get; set; }
        public string StackTrace { get; set; }
        public string? TargetSite { get; set; }
        public string? InnerException { get; set; }
    }
}
