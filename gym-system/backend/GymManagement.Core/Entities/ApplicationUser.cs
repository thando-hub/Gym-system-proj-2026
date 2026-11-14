using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.Entities
{
    public class ApplicationUser : IdentityUser
    {
        // Lebo please add the [required] validation attributes in RegisterDto
        // when creating the API request model. Don't add here  this is the DB model
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}