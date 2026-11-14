using GymManagement.Core.Entities;
using GymManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

/*
    Team notes : please read before editing this file.

    This file is shared by all 5 of us, so be careful with changes.

    1. JWT settings
       The secret key, issuer, audience, and duration all come from appsettings.json.
       Don't hardcode them here - edit appsettings.json if you need to change them.

    2. Adding a new entity (GymMember, PersonalTrainer, TrainingProgramme, etc.)
        Create the class in GymManagement.Core/Entities
        Add a DbSet<> for it in ApplicationDbContext
        Run the migration commands below

    3. Migration commands
       dotnet ef migrations add <Name> --project backend/GymManagement.Infrastructure --startup-project backend/GymManagement.API
       dotnet ef database update --project backend/GymManagement.Infrastructure --startup-project backend/GymManagement.API

    4. Protecting endpoints
       [Authorize]                                   - any logged-in user
       [Authorize(Roles = "Admin")]                  - Admin only
       [Authorize(Roles = "Admin,PersonalTrainer")]  - multiple roles

    5. Getting a token for testing
       Register and login at http://localhost:5049/swagger
       Then use it like this:
       curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5049/api/...

    6. Roles seeded on startup
       Admin, PersonalTrainer, GymMember

    7. Default users seeded on startup
       Admin: admin@gymnation.com / Admin123!
       Trainer: trainer@gymnation.com / Trainer123! (also creates PersonalTrainer record T001)
       Member: member@gymnation.com / Member123! (also creates GymMember record M001)

    8. Don't reorder these two
       UseAuthentication must come BEFORE UseAuthorization, otherwise [Authorize] won't work.
*/

var builder = WebApplication.CreateBuilder(args);


// Add Controllers

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// CORS - allows the React app (localhost:3000) to call this API

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000" , "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


//Add DbContext (EF Core + SQL Server)

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Add ASP.NET Identity

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;

    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();


// Add JWT Authentication

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
    };
});


// Build the App

var app = builder.Build();


// HTTP Pipeline

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();   // This must come BEFORE UseAuthorization
app.UseAuthorization();
//i used this to see if i wired the api correctly
//app.MapGet("/", () => "GymManagement API is running!");
app.MapControllers()
    ;
await SeedRolesAsync(app);
await SeedUsersAsync(app);

app.Run();



// ROLE SEEDING
// Creates Admin, PersonalTrainer, and GymMember roles
// on startup if they don't already exist.

async Task SeedRolesAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string[] roles = { "Admin", "PersonalTrainer", "GymMember" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

// USER SEEDING
// Creates a default admin user if they don't already exist.

async Task SeedUsersAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Default Admin User
    var adminEmail = "admin@gymnation.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);

    if (adminUser == null)
    {
        adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "Admin",
            LastName = "User",
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(adminUser, "Admin123!");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }

    // Default Trainer User - create both login user and PersonalTrainer record
    var trainerEmail = "trainer@gymnation.com";
    var trainerUser = await userManager.FindByEmailAsync(trainerEmail);

    if (trainerUser == null)
    {
        trainerUser = new ApplicationUser
        {
            UserName = trainerEmail,
            Email = trainerEmail,
            FirstName = "Sarah",
            LastName = "Miller",
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(trainerUser, "Trainer123!");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(trainerUser, "PersonalTrainer");
        }
    }

    // Create/update PersonalTrainer record to match the login user
    var trainerRecord = await dbContext.PersonalTrainers.FirstOrDefaultAsync(t => t.Email == trainerEmail);
    if (trainerRecord == null)
    {
        // Find an unused StaffNumber
        var existingStaffNumbers = await dbContext.PersonalTrainers.Select(t => t.StaffNumber).ToListAsync();
        string newStaffNumber = "T001";
        int counter = 1;
        while (existingStaffNumbers.Contains(newStaffNumber))
        {
            counter++;
            newStaffNumber = $"T{counter:D3}";
        }

        trainerRecord = new PersonalTrainer
        {
            StaffNumber = newStaffNumber,
            Name = "Sarah",
            Surname = "Miller",
            Gender = "Female",
            Email = trainerEmail,
            PhoneNumber = "0820000000",
            Specialization = "General Fitness"
        };
        dbContext.PersonalTrainers.Add(trainerRecord);
        await dbContext.SaveChangesAsync();
    }

    // Default Member User - create both login user and GymMember record
    var memberEmail = "member@gymnation.com";
    var memberUser = await userManager.FindByEmailAsync(memberEmail);

    if (memberUser == null)
    {
        memberUser = new ApplicationUser
        {
            UserName = memberEmail,
            Email = memberEmail,
            FirstName = "David",
            LastName = "Smith",
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(memberUser, "Member123!");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(memberUser, "GymMember");
        }
    }

    // Create/update GymMember record to match the login user
    var memberRecord = await dbContext.GymMembers.FirstOrDefaultAsync(m => m.Email == memberEmail);
    if (memberRecord == null)
    {
        // Find an unused MemberNumber
        var existingMemberNumbers = await dbContext.GymMembers.Select(m => m.MemberNumber).ToListAsync();
        string newMemberNumber = "M001";
        int counter = 1;
        while (existingMemberNumbers.Contains(newMemberNumber))
        {
            counter++;
            newMemberNumber = $"M{counter:D3}";
        }

        memberRecord = new GymMember
        {
            MemberNumber = newMemberNumber,
            Name = "David",
            Surname = "Smith",
            Gender = "Male",
            DateOfBirth = new DateTime(1990, 1, 1),
            HomeAddress = "123 Test Street",
            Email = memberEmail,
            PhoneNumber = "0830000000",
            MembershipType = "Monthly"
        };
        dbContext.GymMembers.Add(memberRecord);
        await dbContext.SaveChangesAsync();
    }

    // Assign the member to the trainer (if not already assigned)
    if (memberRecord != null && memberRecord.PersonalTrainerId == null && trainerRecord != null)
    {
        memberRecord.PersonalTrainerId = trainerRecord.Id;
        await dbContext.SaveChangesAsync();
    }
}