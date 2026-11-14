using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.DTOs;

public class UpdateTaskStatusDto
{
    [Required]
    [RegularExpression("^(Not Started|In Progress|Complete)$",
        ErrorMessage = "Status must be 'Not Started', 'In Progress', or 'Complete'")]
    public string Status { get; set; } = string.Empty;
}