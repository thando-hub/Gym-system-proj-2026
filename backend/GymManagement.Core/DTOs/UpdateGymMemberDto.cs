using System;
using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.DTOs;

public class UpdateGymMemberDto
{
    public int Id { get; set; }

    [Required]
    public string MemberNumber { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Surname { get; set; } = string.Empty;

    [Required]
    public string Gender { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    public string HomeAddress { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    [Required]
    public string MembershipType { get; set; } = string.Empty;

    public int? PersonalTrainerId { get; set; }
}
