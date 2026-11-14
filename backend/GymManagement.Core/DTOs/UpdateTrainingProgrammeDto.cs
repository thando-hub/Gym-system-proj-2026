using System;
using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.DTOs
{
    public class UpdateTrainingProgrammeDto
    {
        [Required]
        public Guid ProgrammeId { get; set; }

        [Required(ErrorMessage = "Programme name is required")]
        [StringLength(100, ErrorMessage = "Programme name cannot exceed 100 characters")]
        public string ProgrammeName { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required(ErrorMessage = "Duration is required")]
        [Range(1, 104, ErrorMessage = "Duration must be between 1 and 104 weeks")]
        public int Duration { get; set; }

        [Required(ErrorMessage = "Fitness goal is required")]
        [AllowedValues("Weight Loss", "Muscle Building", "General Fitness", "Strength", "Endurance",
            ErrorMessage = "Fitness goal must be Weight Loss, Muscle Building, General Fitness, Strength, or Endurance")]
        public string FitnessGoal { get; set; } = string.Empty;
    }
}
