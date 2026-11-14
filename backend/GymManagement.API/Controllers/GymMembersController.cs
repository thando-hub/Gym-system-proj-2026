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
public class GymMembersController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/gymmembers
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] string? memberNumber, [FromQuery] string? name, [FromQuery] string? surname)
    {
        var query = context.GymMembers.Include(m => m.PersonalTrainer).AsQueryable();

        if (!string.IsNullOrWhiteSpace(memberNumber))
            query = query.Where(m => m.MemberNumber.Contains(memberNumber));
        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(m => m.Name.Contains(name));
        if (!string.IsNullOrWhiteSpace(surname))
            query = query.Where(m => m.Surname.Contains(surname));

        return Ok(await query.ToListAsync());
    }

    // GET: api/gymmembers/my-profile
    [HttpGet("my-profile")]
    [Authorize(Roles = "GymMember")]
    public async Task<IActionResult> GetMyProfile()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value
                 ?? User.FindFirst("email")?.Value;

        if (string.IsNullOrEmpty(email))
            return Unauthorized(new { Message = "Email claim not found in token." });

        var member = await context.GymMembers
            .Include(m => m.PersonalTrainer)
            .FirstOrDefaultAsync(m => m.Email == email);

        if (member == null)
            return NotFound(new { Message = "No member record found for this user." });

        return Ok(member);
    }

    // GET: api/gymmembers/{id}
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var member = await context.GymMembers.Include(m => m.PersonalTrainer).FirstOrDefaultAsync(m => m.Id == id);
        if (member == null) return NotFound();
        return Ok(member);
    }

    // GET: api/gymmembers/trainer/{trainerId}
    [HttpGet("trainer/{trainerId}")]
    [Authorize(Roles = "PersonalTrainer,Admin")]
    public async Task<IActionResult> GetMembersForTrainer(int trainerId)
    {
        var members = await context.GymMembers
            .Where(m => m.PersonalTrainerId == trainerId)
            .Include(m => m.PersonalTrainer)
            .ToListAsync();

        return Ok(members);
    }

    // POST: api/gymmembers
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(AddGymMemberDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var exists = await context.GymMembers.AnyAsync(m => m.MemberNumber == dto.MemberNumber);
        if (exists) return Conflict(new { Message = "MemberNumber already exists" });

        var member = new GymMember
        {
            MemberNumber = dto.MemberNumber,
            Name = dto.Name,
            Surname = dto.Surname,
            Gender = dto.Gender,
            DateOfBirth = dto.DateOfBirth,
            HomeAddress = dto.HomeAddress,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            MembershipType = dto.MembershipType,
            PersonalTrainerId = dto.PersonalTrainerId
        };

        context.GymMembers.Add(member);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = member.Id }, member);
    }

    // PUT: api/gymmembers
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(UpdateGymMemberDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var member = await context.GymMembers.FindAsync(dto.Id);
        if (member == null) return NotFound();

        if (await context.GymMembers.AnyAsync(m => m.MemberNumber == dto.MemberNumber && m.Id != dto.Id))
            return Conflict(new { Message = "MemberNumber already in use" });

        member.MemberNumber = dto.MemberNumber;
        member.Name = dto.Name;
        member.Surname = dto.Surname;
        member.Gender = dto.Gender;
        member.DateOfBirth = dto.DateOfBirth;
        member.HomeAddress = dto.HomeAddress;
        member.Email = dto.Email;
        member.PhoneNumber = dto.PhoneNumber;
        member.MembershipType = dto.MembershipType;
        member.PersonalTrainerId = dto.PersonalTrainerId;

        await context.SaveChangesAsync();
        return Ok(member);
    }

    // DELETE: api/gymmembers/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var member = await context.GymMembers.FindAsync(id);
        if (member == null) return NotFound();

        var workoutPlans = await context.WorkoutPlans.Where(wp => wp.GymMemberId == id).ToListAsync();
        context.WorkoutPlans.RemoveRange(workoutPlans);

        context.GymMembers.Remove(member);
        await context.SaveChangesAsync();
        return NoContent();
    }
}