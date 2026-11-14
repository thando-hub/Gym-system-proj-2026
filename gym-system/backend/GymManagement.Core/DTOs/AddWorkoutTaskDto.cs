using System;
using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.DTOs;

public class AddWorkoutTaskDto
{
    [Required]
    [MaxLength(100)]
    public string ExerciseName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [Range(1, 100)]
    public int Sets { get; set; }

    [Required]
    [Range(1, 1000)]
    public int Reps { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    public int WorkoutPlanId { get; set; }
}