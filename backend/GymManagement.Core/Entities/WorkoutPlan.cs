using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymManagement.Core.Entities;

public class WorkoutPlan
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string PlanName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // FK to GymMember (from Member 2)
    [Required]
    public int GymMemberId { get; set; }

    [JsonIgnore]
    public GymMember? GymMember { get; set; }

    // One plan has many tasks
    public ICollection<WorkoutTask> WorkoutTasks { get; set; } = new List<WorkoutTask>();
}