using System;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManagement.Core.Entities;

public class GymMember
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string MemberNumber { get; set; } = string.Empty;

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
    public DateTime DateOfBirth { get; set; }

    [Required]
    [MaxLength(250)]
    public string HomeAddress { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    [MaxLength(20)]
    public string MembershipType { get; set; } = string.Empty; // Monthly / Quarterly / Annual

    // Foreign Key
    public int? PersonalTrainerId { get; set; }

    [ForeignKey(nameof(PersonalTrainerId))]
    public PersonalTrainer? PersonalTrainer { get; set; }

    // Training Programme Foreign Key
    public Guid? TrainingProgrammeId { get; set; }

    [ForeignKey(nameof(TrainingProgrammeId))]
    public TrainingProgramme? TrainingProgramme { get; set; }
}