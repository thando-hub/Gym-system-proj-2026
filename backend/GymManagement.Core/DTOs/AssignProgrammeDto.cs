using System;
using System.ComponentModel.DataAnnotations;

namespace GymManagement.Core.DTOs
{
    public class AssignProgrammeDto
    {
        [Required(ErrorMessage = "MemberId is required")]
        public int MemberId { get; set; }

        [Required(ErrorMessage = "ProgrammeId is required")]
        public Guid ProgrammeId { get; set; }
    }
}
