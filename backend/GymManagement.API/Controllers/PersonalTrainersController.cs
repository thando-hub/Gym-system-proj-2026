using System.Security.Claims;
using System;
using GymManagement.Core.DTOs;
using GymManagement.Core.Entities;
using GymManagement.Infrastructure;
using GymManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonalTrainersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PersonalTrainersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/personaltrainers
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] string? staffNumber, [FromQuery] string? name, [FromQuery] string? surname)
    {
        var query = _context.PersonalTrainers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(staffNumber))
            query = query.Where(t => t.StaffNumber.Contains(staffNumber));
        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(t => t.Name.Contains(name));
        if (!string.IsNullOrWhiteSpace(surname))
            query = query.Where(t => t.Surname.Contains(surname));

        return Ok(await query.ToListAsync());
    }

    // GET: api/personaltrainers/my-profile
    [HttpGet("my-profile")]
    [Authorize(Roles = "PersonalTrainer")]
    public async Task<IActionResult> GetMyProfile()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value
                 ?? User.FindFirst("email")?.Value;

        if (string.IsNullOrEmpty(email))
            return Unauthorized(new { Message = "Email claim not found in token." });

        var trainer = await _context.PersonalTrainers
            .FirstOrDefaultAsync(t => t.Email == email);

        if (trainer == null)
            return NotFound(new { Message = "No trainer record found for this user." });

        return Ok(trainer);
    }

    // GET: api/personaltrainers/{id}
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var trainer = await _context.PersonalTrainers.FindAsync(id);
        if (trainer == null) return NotFound();
        return Ok(trainer);
    }

    // POST: api/personaltrainers
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(AddPersonalTrainerDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var exists = await _context.PersonalTrainers.AnyAsync(t => t.StaffNumber == dto.StaffNumber);
        if (exists) return Conflict(new { Message = "StaffNumber already exists" });

        var trainer = new PersonalTrainer
        {
            StaffNumber = dto.StaffNumber,
            Name = dto.Name,
            Surname = dto.Surname,
            Gender = dto.Gender,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Specialization = dto.Specialization
        };

        _context.PersonalTrainers.Add(trainer);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = trainer.Id }, trainer);
    }

    // PUT: api/personaltrainers
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(UpdatePersonalTrainerDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var trainer = await _context.PersonalTrainers.FindAsync(dto.Id);
        if (trainer == null) return NotFound();

        if (await _context.PersonalTrainers.AnyAsync(t => t.StaffNumber == dto.StaffNumber && t.Id != dto.Id))
            return Conflict(new { Message = "StaffNumber already in use" });

        trainer.StaffNumber = dto.StaffNumber;
        trainer.Name = dto.Name;
        trainer.Surname = dto.Surname;
        trainer.Gender = dto.Gender;
        trainer.Email = dto.Email;
        trainer.PhoneNumber = dto.PhoneNumber;
        trainer.Specialization = dto.Specialization;

        await _context.SaveChangesAsync();
        return Ok(trainer);
    }

    // DELETE: api/personaltrainers/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var trainer = await _context.PersonalTrainers.FindAsync(id);
        if (trainer == null) return NotFound();
        _context.PersonalTrainers.Remove(trainer);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
