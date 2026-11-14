using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymManagement.Core.Entities;

public class PersonalTrainer
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string StaffNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Surname { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Specialization { get; set; } = string.Empty;

    // Navigation
    [JsonIgnore]
    public ICollection<GymMember> AssignedMembers { get; set; } = new List<GymMember>();
}
