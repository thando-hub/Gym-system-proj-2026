using System;
using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.Entities
{
    public class TrainingProgramme
    {
        [Key]
        public Guid ProgrammeId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public int Duration { get; set; }

        [Required]
        [AllowedValues("Weight Loss", "Muscle Building", "General Fitness", "Strength", "Endurance",
            ErrorMessage = "Fitness goal must be Weight Loss, Muscle Building, General Fitness, Strength, or Endurance")]
        public string FitnessGoal { get; set; } = string.Empty;

        // Navigation property for assigned members
        public ICollection<GymMember> GymMembers { get; set; } = new List<GymMember>();
    }
}
