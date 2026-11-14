using System.Security.Claims;
using GymManagement.Core.DTOs;
using GymManagement.Core.Entities;
using GymManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingProgrammeController : ControllerBase
    {
        private readonly ApplicationDbContext _DbContext;

        public TrainingProgrammeController(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        // GET /api/TrainingProgramme
        [HttpGet]
        [Authorize]
        public IActionResult GetAllProgrammes()
        {
            var allprogrammes = _DbContext.trainingProgrammes.ToList();
            return Ok(allprogrammes);
        }

        // GET /api/TrainingProgramme/{id}
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetProgrammeById(Guid id)
        {
            var programme = _DbContext.trainingProgrammes.Find(id);

            if (programme == null)
            {
                return NotFound(new { message = "Training programme not found" });
            }

            return Ok(programme);
        }

        // POST /api/TrainingProgramme
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateProgramme([FromBody] AddTrainingProgrammeDto addTrainingProgrammeDto)
        {
            var programmeDomainModel = new TrainingProgramme
            {
                ProgrammeId = Guid.NewGuid(),
                Name = addTrainingProgrammeDto.ProgrammeName,
                Description = addTrainingProgrammeDto.Description ?? string.Empty,
                Duration = addTrainingProgrammeDto.Duration,
                FitnessGoal = addTrainingProgrammeDto.FitnessGoal
            };

            _DbContext.trainingProgrammes.Add(programmeDomainModel);
            _DbContext.SaveChanges();

            return Ok(programmeDomainModel);
        }

        // PUT /api/TrainingProgramme/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateProgramme(Guid id, [FromBody] UpdateTrainingProgrammeDto dto)
        {
            if (id != dto.ProgrammeId)
            {
                return BadRequest(new { message = "ID in URL does not match ID in body" });
            }

            var existing = _DbContext.trainingProgrammes.Find(id);

            if (existing == null)
            {
                return NotFound(new { message = "Training programme not found" });
            }

            existing.Name = dto.ProgrammeName;
            existing.Description = dto.Description ?? string.Empty;
            existing.Duration = dto.Duration;
            existing.FitnessGoal = dto.FitnessGoal;

            _DbContext.Entry(existing).State = EntityState.Modified;
            _DbContext.SaveChanges();

            return NoContent();
        }

        // DELETE /api/TrainingProgramme/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteProgramme(Guid id)
        {
            var programme = _DbContext.trainingProgrammes.Find(id);

            if (programme == null)
            {
                return NotFound(new { message = "Training programme not found" });
            }

            _DbContext.trainingProgrammes.Remove(programme);
            _DbContext.SaveChanges();

            return NoContent();
        }

        // POST /api/TrainingProgramme/assign-trainer
        [HttpPost("assign-trainer")]
        [Authorize(Roles = "Admin")]
        public IActionResult AssignTrainer([FromBody] AssignTrainerDto dto)
        {
            var member = _DbContext.GymMembers.Find(dto.MemberId);
            if (member == null)
            {
                return NotFound(new { message = "Gym member not found" });
            }

            var trainer = _DbContext.PersonalTrainers.Find(dto.TrainerId);
            if (trainer == null)
            {
                return NotFound(new { message = "Personal trainer not found" });
            }

            member.PersonalTrainerId = dto.TrainerId;
            _DbContext.SaveChanges();

            return Ok(new { message = "Trainer assigned to member successfully" });
        }

        // POST /api/TrainingProgramme/assign-programme
        [HttpPost("assign-programme")]
        [Authorize(Roles = "Admin")]
        public IActionResult AssignProgramme([FromBody] AssignProgrammeDto dto)
        {
            var member = _DbContext.GymMembers.Find(dto.MemberId);
            if (member == null)
            {
                return NotFound(new { message = "Gym member not found" });
            }

            var programme = _DbContext.trainingProgrammes.Find(dto.ProgrammeId);
            if (programme == null)
            {
                return NotFound(new { message = "Training programme not found" });
            }

            member.TrainingProgrammeId = dto.ProgrammeId;
            _DbContext.SaveChanges();

            return Ok(new { message = "Training programme assigned to member successfully" });
        }

        // GET /api/trainingprogrammes/trainer/{trainerId}
        [HttpGet("trainer/{trainerId}")]
        [Authorize]
        public IActionResult GetProgrammesForTrainer(int trainerId)
        {
            var trainer = _DbContext.PersonalTrainers.Find(trainerId);
            if (trainer == null)
            {
                return NotFound(new { message = "Personal trainer not found" });
            }

            var programmes = _DbContext.GymMembers
                .Where(m => m.PersonalTrainerId == trainerId && m.TrainingProgrammeId != null)
                .Select(m => m.TrainingProgramme!)
                .Distinct()
                .Select(p => new
                {
                    Id = p.ProgrammeId,
                    ProgrammeName = p.Name,
                    Description = p.Description,
                    Duration = p.Duration,
                    FitnessGoal = p.FitnessGoal
                })
                .ToList();

            return Ok(programmes);
        }

        // GET /api/TrainingProgramme/my-programme
        [HttpGet("my-programme")]
        [Authorize(Roles = "GymMember,Admin")]
        public IActionResult GetMyProgramme()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "User email claim not found" });
            }

            var member = _DbContext.GymMembers
                .Include(m => m.TrainingProgramme)
                .FirstOrDefault(m => m.Email == email);

            if (member == null)
            {
                return NotFound(new { message = "Gym member profile not found" });
            }

            if (member.TrainingProgramme == null)
            {
                return NotFound(new { message = "No training programme assigned to you yet" });
            }

            var p = member.TrainingProgramme;
            return Ok(new
            {
                Id = p.ProgrammeId,
                ProgrammeId = p.ProgrammeId,
                ProgrammeName = p.Name,
                Name = p.Name,
                Description = p.Description,
                Duration = p.Duration,
                FitnessGoal = p.FitnessGoal
            });
        }
    }
}
