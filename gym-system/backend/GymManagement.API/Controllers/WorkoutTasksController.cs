using GymManagement.Core.DTOs;
using GymManagement.Core.Entities;
using GymManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace GymManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkoutTasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WorkoutTasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET /api/workouttasks
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.WorkoutTasks.ToListAsync());
    }

    // GET /api/workouttasks/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _context.WorkoutTasks.FindAsync(id);
        if (task == null) return NotFound();
        return Ok(task);
    }

    // GET /api/workouttasks/plan/{planId}
    [HttpGet("plan/{planId:int}")]
    public async Task<IActionResult> GetByPlan(int planId)
    {
        var tasks = await _context.WorkoutTasks
            .Where(t => t.WorkoutPlanId == planId)
            .ToListAsync();
        return Ok(tasks);
    }

    // GET /api/workouttasks/filter?status=In Progress
    [HttpGet("filter")]
    public async Task<IActionResult> Filter([FromQuery] string status)
    {
        var tasks = await _context.WorkoutTasks
            .Where(t => t.Status == status)
            .ToListAsync();
        return Ok(tasks);
    }

    // POST /api/workouttasks
    [HttpPost]
    [Authorize(Roles = "Admin,PersonalTrainer")]
    public async Task<IActionResult> Create([FromBody] AddWorkoutTaskDto dto)
    {
        var task = new WorkoutTask
        {
            ExerciseName = dto.ExerciseName,
            Description = dto.Description,
            Sets = dto.Sets,
            Reps = dto.Reps,
            DueDate = dto.DueDate,
            WorkoutPlanId = dto.WorkoutPlanId,
            Status = "Not Started"
        };

        _context.WorkoutTasks.Add(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }

    // PUT /api/workouttasks/{id}/status
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusDto dto)
    {
        var task = await _context.WorkoutTasks.FindAsync(id);
        if (task == null) return NotFound();

        task.Status = dto.Status;
        await _context.SaveChangesAsync();
        return Ok(task);
    }

    // PUT /api/workouttasks/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,PersonalTrainer")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkoutTaskDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var task = await _context.WorkoutTasks.FindAsync(id);
        if (task == null) return NotFound();

        task.ExerciseName = dto.ExerciseName;
        task.Description = dto.Description;
        task.Sets = dto.Sets;
        task.Reps = dto.Reps;
        task.DueDate = dto.DueDate;
        await _context.SaveChangesAsync();
        return Ok(task);
    }

    // DELETE /api/workouttasks/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,PersonalTrainer")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _context.WorkoutTasks.FindAsync(id);
        if (task == null) return NotFound();

        _context.WorkoutTasks.Remove(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }
}
