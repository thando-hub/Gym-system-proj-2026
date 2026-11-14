using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.DTOs;

public class AddWorkoutPlanDto
{
    [Required]
    [MaxLength(100)]
    public string PlanName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public int GymMemberId { get; set; }
}