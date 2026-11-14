using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDummyData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Insert Personal Trainers
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM PersonalTrainers WHERE StaffNumber = 'T002')
                BEGIN
                    INSERT INTO PersonalTrainers (StaffNumber, Name, Surname, Gender, Email, PhoneNumber, Specialization)
                    VALUES ('T002', 'Sarah', 'Miller', 'Female', 'sarah.miller@fitcore.com', '0821234567', 'CrossFit & HIIT')
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM PersonalTrainers WHERE StaffNumber = 'T003')
                BEGIN
                    INSERT INTO PersonalTrainers (StaffNumber, Name, Surname, Gender, Email, PhoneNumber, Specialization)
                    VALUES ('T003', 'Michael', 'Chen', 'Male', 'michael.chen@fitcore.com', '0822345678', 'Yoga & Flexibility')
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM PersonalTrainers WHERE StaffNumber = 'T004')
                BEGIN
                    INSERT INTO PersonalTrainers (StaffNumber, Name, Surname, Gender, Email, PhoneNumber, Specialization)
                    VALUES ('T004', 'Emma', 'Wilson', 'Female', 'emma.wilson@fitcore.com', '0823456789', 'Cardio & Endurance')
                END
            ");

            // Insert Gym Members
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M002')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M002', 'David', 'Smith', 'Male', '1990-05-15', '123 Main St, Johannesburg', 'david.smith@email.com', '0834567890', 'Monthly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T002'))
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M003')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M003', 'Lisa', 'Johnson', 'Female', '1992-08-22', '456 Oak Ave, Cape Town', 'lisa.johnson@email.com', '0835678901', 'Quarterly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T003'))
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M004')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M004', 'Robert', 'Brown', 'Male', '1988-03-10', '789 Pine Rd, Durban', 'robert.brown@email.com', '0836789012', 'Annual',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T004'))
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M005')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M005', 'Amanda', 'Davis', 'Female', '1995-11-30', '321 Elm St, Pretoria', 'amanda.davis@email.com', '0837890123', 'Monthly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T001'))
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M006')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M006', 'James', 'Wilson', 'Male', '1987-07-18', '654 Maple Dr, Johannesburg', 'james.wilson@email.com', '0838901234', 'Quarterly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T002'))
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M007')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M007', 'Jennifer', 'Taylor', 'Female', '1993-02-14', '987 Cedar Ln, Cape Town', 'jennifer.taylor@email.com', '0839012345', 'Annual',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T003'))
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M008')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M008', 'Mark', 'Anderson', 'Male', '1991-09-25', '159 Birch Ave, Durban', 'mark.anderson@email.com', '0840123456', 'Monthly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T004'))
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M009')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M009', 'Emily', 'Martinez', 'Female', '1994-04-05', '753 Spruce St, Pretoria', 'emily.martinez@email.com', '0841234567', 'Quarterly', NULL)
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M010')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M010', 'Chris', 'Garcia', 'Male', '1989-12-20', '357 Willow Way, Johannesburg', 'chris.garcia@email.com', '0842345678', 'Annual', NULL)
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove Gym Members (in reverse order of insertion)
            migrationBuilder.Sql("DELETE FROM GymMembers WHERE MemberNumber IN ('M010', 'M009', 'M008', 'M007', 'M006', 'M005', 'M004', 'M003', 'M002')");

            // Remove Personal Trainers
            migrationBuilder.Sql("DELETE FROM PersonalTrainers WHERE StaffNumber IN ('T004', 'T003', 'T002')");
        }
    }
}
