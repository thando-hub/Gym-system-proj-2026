using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.DTOs
{
    public class AssignTrainerDto
    {
        [Required(ErrorMessage = "MemberId is required")]
        public int MemberId { get; set; }

        [Required(ErrorMessage = "TrainerId is required")]
        public int TrainerId { get; set; }
    }
}
