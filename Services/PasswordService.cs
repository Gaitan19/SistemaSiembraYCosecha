using BCrypt.Net;

namespace ReactVentas.Services
{
    public interface IPasswordService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }

    public class PasswordService : IPasswordService
    {
        public string HashPassword(string password)
        {
            // Verify that the BCrypt.Net package is correctly installed in your project
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}