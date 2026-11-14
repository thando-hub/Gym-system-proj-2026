using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymManagement.Core.Entities;

public class WorkoutTask
{
    [Key]
    public int Id { get; set; }

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
    [MaxLength(20)]
    public string Status { get; set; } = "Not Started";

    // FK to WorkoutPlan
    [Required]
    public int WorkoutPlanId { get; set; }

    [JsonIgnore]
    public WorkoutPlan? WorkoutPlan { get; set; }
}
