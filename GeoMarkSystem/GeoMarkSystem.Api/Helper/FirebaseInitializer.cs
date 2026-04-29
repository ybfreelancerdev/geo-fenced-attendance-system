using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

namespace GeoMarkSystem.Api.Helper
{
    public static class FirebaseInitializer
    {
        public static void Initialize()
        {
            if (FirebaseApp.DefaultInstance == null)
            {
                var path = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "geotrackr-firebase.json"
                );

                FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromFile(path)
                });
            }
        }
    }
}
