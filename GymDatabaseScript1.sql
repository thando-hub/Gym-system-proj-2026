IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [FirstName] nvarchar(50) NOT NULL,
    [LastName] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260921184712_InitialCreate', N'10.0.12');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [PersonalTrainers] (
    [Id] int NOT NULL IDENTITY,
    [StaffNumber] nvarchar(50) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Surname] nvarchar(100) NOT NULL,
    [Gender] nvarchar(10) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Specialization] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_PersonalTrainers] PRIMARY KEY ([Id])
);

CREATE TABLE [GymMembers] (
    [Id] int NOT NULL IDENTITY,
    [MemberNumber] nvarchar(50) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Surname] nvarchar(100) NOT NULL,
    [Gender] nvarchar(10) NOT NULL,
    [DateOfBirth] datetime2 NOT NULL,
    [HomeAddress] nvarchar(250) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [PhoneNumber] nvarchar(20) NULL,
    [MembershipType] nvarchar(20) NOT NULL,
    [PersonalTrainerId] int NULL,
    CONSTRAINT [PK_GymMembers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GymMembers_PersonalTrainers_PersonalTrainerId] FOREIGN KEY ([PersonalTrainerId]) REFERENCES [PersonalTrainers] ([Id]) ON DELETE SET NULL
);

CREATE UNIQUE INDEX [IX_GymMembers_MemberNumber] ON [GymMembers] ([MemberNumber]);

CREATE INDEX [IX_GymMembers_PersonalTrainerId] ON [GymMembers] ([PersonalTrainerId]);

CREATE UNIQUE INDEX [IX_PersonalTrainers_StaffNumber] ON [PersonalTrainers] ([StaffNumber]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261007214323_AddMembersAndTrainers', N'10.0.12');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [TrainingProgramme] (
    [ProgrammeId] uniqueidentifier NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Duration] int NOT NULL,
    [FitnessGoal] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_TrainingProgramme] PRIMARY KEY ([ProgrammeId])
);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261008104116_AddTrainingProgrammes', N'10.0.12');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [GymMembers] ADD [TrainingProgrammeId] uniqueidentifier NULL;

CREATE INDEX [IX_GymMembers_TrainingProgrammeId] ON [GymMembers] ([TrainingProgrammeId]);

ALTER TABLE [GymMembers] ADD CONSTRAINT [FK_GymMembers_TrainingProgramme_TrainingProgrammeId] FOREIGN KEY ([TrainingProgrammeId]) REFERENCES [TrainingProgramme] ([ProgrammeId]) ON DELETE SET NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261008111249_AddProgrammeAssignments', N'10.0.12');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [WorkoutPlans] (
    [Id] int NOT NULL IDENTITY,
    [PlanName] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [GymMemberId] int NOT NULL,
    CONSTRAINT [PK_WorkoutPlans] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_WorkoutPlans_GymMembers_GymMemberId] FOREIGN KEY ([GymMemberId]) REFERENCES [GymMembers] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [WorkoutTasks] (
    [Id] int NOT NULL IDENTITY,
    [ExerciseName] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Sets] int NOT NULL,
    [Reps] int NOT NULL,
    [DueDate] datetime2 NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [WorkoutPlanId] int NOT NULL,
    CONSTRAINT [PK_WorkoutTasks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_WorkoutTasks_WorkoutPlans_WorkoutPlanId] FOREIGN KEY ([WorkoutPlanId]) REFERENCES [WorkoutPlans] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_WorkoutPlans_GymMemberId] ON [WorkoutPlans] ([GymMemberId]);

CREATE INDEX [IX_WorkoutTasks_WorkoutPlanId] ON [WorkoutTasks] ([WorkoutPlanId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261008114144_AddWorkoutPlansAndTasks', N'10.0.12');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261009221411_SyncTrainingProgrammeSchema', N'10.0.12');

COMMIT;
GO

BEGIN TRANSACTION;

                IF NOT EXISTS (SELECT 1 FROM PersonalTrainers WHERE StaffNumber = 'T002')
                BEGIN
                    INSERT INTO PersonalTrainers (StaffNumber, Name, Surname, Gender, Email, PhoneNumber, Specialization)
                    VALUES ('T002', 'Sarah', 'Miller', 'Female', 'sarah.miller@fitcore.com', '0821234567', 'CrossFit & HIIT')
                END
            


                IF NOT EXISTS (SELECT 1 FROM PersonalTrainers WHERE StaffNumber = 'T003')
                BEGIN
                    INSERT INTO PersonalTrainers (StaffNumber, Name, Surname, Gender, Email, PhoneNumber, Specialization)
                    VALUES ('T003', 'Michael', 'Chen', 'Male', 'michael.chen@fitcore.com', '0822345678', 'Yoga & Flexibility')
                END
            


                IF NOT EXISTS (SELECT 1 FROM PersonalTrainers WHERE StaffNumber = 'T004')
                BEGIN
                    INSERT INTO PersonalTrainers (StaffNumber, Name, Surname, Gender, Email, PhoneNumber, Specialization)
                    VALUES ('T004', 'Emma', 'Wilson', 'Female', 'emma.wilson@fitcore.com', '0823456789', 'Cardio & Endurance')
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M002')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M002', 'David', 'Smith', 'Male', '1990-05-15', '123 Main St, Johannesburg', 'david.smith@email.com', '0834567890', 'Monthly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T002'))
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M003')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M003', 'Lisa', 'Johnson', 'Female', '1992-08-22', '456 Oak Ave, Cape Town', 'lisa.johnson@email.com', '0835678901', 'Quarterly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T003'))
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M004')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M004', 'Robert', 'Brown', 'Male', '1988-03-10', '789 Pine Rd, Durban', 'robert.brown@email.com', '0836789012', 'Annual',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T004'))
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M005')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M005', 'Amanda', 'Davis', 'Female', '1995-11-30', '321 Elm St, Pretoria', 'amanda.davis@email.com', '0837890123', 'Monthly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T001'))
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M006')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M006', 'James', 'Wilson', 'Male', '1987-07-18', '654 Maple Dr, Johannesburg', 'james.wilson@email.com', '0838901234', 'Quarterly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T002'))
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M007')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M007', 'Jennifer', 'Taylor', 'Female', '1993-02-14', '987 Cedar Ln, Cape Town', 'jennifer.taylor@email.com', '0839012345', 'Annual',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T003'))
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M008')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M008', 'Mark', 'Anderson', 'Male', '1991-09-25', '159 Birch Ave, Durban', 'mark.anderson@email.com', '0840123456', 'Monthly',
                        (SELECT Id FROM PersonalTrainers WHERE StaffNumber = 'T004'))
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M009')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M009', 'Emily', 'Martinez', 'Female', '1994-04-05', '753 Spruce St, Pretoria', 'emily.martinez@email.com', '0841234567', 'Quarterly', NULL)
                END
            


                IF NOT EXISTS (SELECT 1 FROM GymMembers WHERE MemberNumber = 'M010')
                BEGIN
                    INSERT INTO GymMembers (MemberNumber, Name, Surname, Gender, DateOfBirth, HomeAddress, Email, PhoneNumber, MembershipType, PersonalTrainerId)
                    VALUES ('M010', 'Chris', 'Garcia', 'Male', '1989-12-20', '357 Willow Way, Johannesburg', 'chris.garcia@email.com', '0842345678', 'Annual', NULL)
                END
            

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261011115310_AddDummyData', N'10.0.12');

COMMIT;
GO

