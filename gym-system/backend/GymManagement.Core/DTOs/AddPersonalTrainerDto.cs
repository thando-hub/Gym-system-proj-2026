using System;
using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.DTOs;

public class AddPersonalTrainerDto
{
    [Required]
    public string StaffNumber { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Surname { get; set; } = string.Empty;

    [Required]
    public string Gender { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string Specialization { get; set; } = string.Empty;
}

