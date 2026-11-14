using GymManagement.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        //The DbSets for the gym entities mustgo in here
        public DbSet<GymMember> GymMembers { get; set; }
        public DbSet<PersonalTrainer> PersonalTrainers { get; set; }
        public DbSet<TrainingProgramme> trainingProgrammes { get; set; }

        // Workout DbSets
        public DbSet<WorkoutPlan> WorkoutPlans { get; set; }
        public DbSet<WorkoutTask> WorkoutTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Unique constraints
            builder.Entity<GymMember>()
                .HasIndex(m => m.MemberNumber)
                .IsUnique();

            builder.Entity<PersonalTrainer>()
                .HasIndex(t => t.StaffNumber)
                .IsUnique();

            // Relationship: Many Members → One Trainer
            builder.Entity<GymMember>()
                .HasOne(m => m.PersonalTrainer)
                .WithMany(t => t.AssignedMembers)
                .HasForeignKey(m => m.PersonalTrainerId)
                .OnDelete(DeleteBehavior.SetNull);


            // Relationship: Many Members → One Training Programme
            builder.Entity<GymMember>()
                .HasOne(m => m.TrainingProgramme)
                .WithMany(p => p.GymMembers)
                .HasForeignKey(m => m.TrainingProgrammeId)
                .OnDelete(DeleteBehavior.SetNull);

            // WorkoutPlan → GymMember
            builder.Entity<WorkoutPlan>()
                .HasOne(p => p.GymMember)
                .WithMany()
                .HasForeignKey(p => p.GymMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            // WorkoutTask → WorkoutPlan
            builder.Entity<WorkoutTask>()
                .HasOne(t => t.WorkoutPlan)
                .WithMany(p => p.WorkoutTasks)
                .HasForeignKey(t => t.WorkoutPlanId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}