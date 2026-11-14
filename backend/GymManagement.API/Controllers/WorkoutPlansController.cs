using GymManagement.Core.DTOs;
using GymManagement.Core.Entities;
using GymManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkoutPlansController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WorkoutPlansController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET /api/workoutplans
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var plans = await _context.WorkoutPlans
            .Include(p => p.WorkoutTasks)
            .ToListAsync();
        return Ok(plans);
    }

    // GET /api/workoutplans/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var plan = await _context.WorkoutPlans
            .Include(p => p.WorkoutTasks)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (plan == null) return NotFound();
        return Ok(plan);
    }

    // GET /api/workoutplans/member/{memberId}
    [HttpGet("member/{memberId:int}")]
    public async Task<IActionResult> GetByMember(int memberId)
    {
        var plans = await _context.WorkoutPlans
            .Where(p => p.GymMemberId == memberId)
            .Include(p => p.WorkoutTasks)
            .ToListAsync();

        return Ok(plans);
    }

    // POST /api/workoutplans
    [HttpPost]
    [Authorize(Roles = "Admin,PersonalTrainer")]
    public async Task<IActionResult> Create([FromBody] AddWorkoutPlanDto dto)
    {
        var plan = new WorkoutPlan
        {
            PlanName = dto.PlanName,
            Description = dto.Description,
            GymMemberId = dto.GymMemberId
        };

        _context.WorkoutPlans.Add(plan);
        await _context.SaveChangesAsync();
        return Ok(plan);
    }

    // PUT /api/workoutplans/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,PersonalTrainer")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkoutPlanDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var plan = await _context.WorkoutPlans.FindAsync(id);
        if (plan == null) return NotFound();

        plan.PlanName = dto.PlanName;
        plan.Description = dto.Description;
        if (dto.GymMemberId.HasValue)
        {
            plan.GymMemberId = dto.GymMemberId.Value;
        }
        await _context.SaveChangesAsync();
        return Ok(plan);
    }

    // DELETE /api/workoutplans/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,PersonalTrainer")]
    public async Task<IActionResult> Delete(int id)
    {
        var plan = await _context.WorkoutPlans.FindAsync(id);
        if (plan == null) return NotFound();

        _context.WorkoutPlans.Remove(plan);
        await _context.SaveChangesAsync();
        return Ok(plan);
    }
}
