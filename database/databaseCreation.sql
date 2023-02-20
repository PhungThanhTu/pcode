drop database if exists  plp
go
create database plp
go
use plp
GO
-- TABLES
-- setup PlpUser
create table PlpUser
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    username varchar(20),
    hashedPassword varchar(max),
    email varchar(max),
    fullName nvarchar(max),
    refreshToken varchar(max),
    expiryDate datetime,
    avatar nvarchar(max)
);
GO
-- JUDGE DATABASE
create table Course
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    title nvarchar(max)
);
go

create table Exercise
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    runtimeLimit int,
    memoryLimit int,
    scoreWeight int,
    timeCreated smalldatetime
);
go

create table CourseExercise
(
    courseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
    exerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id),
    title nvarchar(max),
    document nvarchar(max)
);
go

create table ProgrammingLanguage
(
    id int PRIMARY KEY,
    languageName varchar(20),
    fileExtension varchar(10),

);
go

insert into [dbo].[ProgrammingLanguage] 
(id,languageName)
VALUES 
(1,'c','c'),
(2,'cpp','cpp'),

create table SampleSourceCode
(
    exerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    programmingLanguageId int FOREIGN KEY REFERENCES [dbo].[ProgrammingLanguage](id) NOT NULL,
    sourceCode nvarchar(max),
    CONSTRAINT PK_SampleSourceCode PRIMARY KEY (exerciseId,programmingLanguageId)
);
go

create table MetaTestCase
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    exercise UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    input nvarchar(max),
    expectedOutput nvarchar(max),
    scoreWeight int,
);
go

create table JudgeStatus (
    id int primary key,
    statusDescription nvarchar(50)
)


create table Submission
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    exerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    score float,
    averageTime float,
    averageMemory float,
    timeCreated smalldatetime 
);
go

create table SubmissionSourceCode
(
    submissionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Submission](id) NOT NULL,
    programmingLanguageId int FOREIGN KEY REFERENCES [dbo].[ProgrammingLanguage](id) NOT NULL,
    sourceCode nvarchar(max)
);
go



create table RunStatus (
    id int primary key,
    statusDescription nvarchar(50)
);
go

insert into [dbo].[RunStatus]
(id,statusDescription)
VALUES
(0,'Pending'),
(1,'Accepted'),
(2,'Wrong'),
(3,'Compliation Error'),
(4,'Runtime Error'),
(5,'Memory Limit Exceeded'),
(6,'Time Limit Exceeded'),
(7,'Others')

create table SubmissionTestResult
(
    submissionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Submission](id) NOT NULL,
    testId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[MetaTestCase](id) NOT NULL,
    programmingLanguageId int FOREIGN KEY REFERENCES [dbo].[ProgrammingLanguage](id) NOT NULL,
    runTime float,
    memoryUsage float,
    runStatus int FOREIGN KEY REFERENCES [dbo].[RunStatus](id),
    exitCode int,
    actualStdout nvarchar(max),
    stdErr nvarchar(max),
    CONSTRAINT PK_SubmissionTestResult PRIMARY KEY(submissionId,testId,programmingLanguageId)
);
go





drop table SubmissionTestResult
drop table SubmissionSourceCode
drop table Submission
drop table RunStatus
drop table JudgeStatus
drop table MetaTestCase
drop table SampleSourceCode
drop table ProgrammingLanguage
drop table Exercise
drop table course 
go

-- PROCEDURES
---- AUTHENTICATION
-- created
create procedure RegisterPlpUser 
    @id UNIQUEIDENTIFIER, 
    @username varchar(20), 
    @hashedPassword varchar(max), 
    @email varchar(max),
    @fullName nvarchar(max)
    AS
        begin
            insert into PlpUser 
            (id,username,hashedPassword,email,fullName) values (
                @id,
                @username,
                @hashedPassword,
                @email,
                @fullName
            )
        end
    go

-- created
create procedure GetUserByUsername
    @username varchar(20)
    AS
        select id,username,hashedPassword,email,fullName,refreshToken,expiryDate,avatar
        from [dbo].[PlpUser]
        where username = @username
    go
-- created
create procedure GetUserById
    @id UNIQUEIDENTIFIER
    AS
        select id,username,hashedPassword,email,fullName,refreshToken,expiryDate,avatar
        from [dbo].[PlpUser]
        where id= @id
    go

-- created
create procedure UpdateRefreshToken
    @id UNIQUEIDENTIFIER,
    @refreshToken varchar(max),
    @expiryDate DATETIME
    AS
    BEGIN
        update PlpUser
            set refreshToken = @refreshToken,
                expiryDate = @expiryDate
            where id = @id
            
    END
    go


create procedure UpdateUser
    @id UNIQUEIDENTIFIER,
    @fullName nvarchar(max),
    @email nvarchar(max)
    as
        update [dbo].[PlpUser]
            set fullName = @fullName,
                email = @email
            where id = @id
    GO

create procedure UpdatePassword
    @id UNIQUEIDENTIFIER,
    @hashedPassword NVARCHAR(max)
    AS
        update [dbo].[PlpUser]
            set hashedPassword = @hashedPassword
            where id = @id
    GO

create procedure UpdateAvatar
    @id UNIQUEIDENTIFIER,
    @avatar NVARCHAR(max)
    AS
        update [dbo].[PlpUser]
            set hashedPassword = @hashedPassword
            where id = @id
    GO
go
---- JUDGE DATABASE
create procedure CreateCourse
as
go

create procedure CreateExercise
AS
go

create procedure CreateTestCase
AS
GO

create procedure CreateSubmission
AS
GO

create procedure UpsertSubmissionTestResult
AS
go

create procedure DeleteSubmissionTestResult
AS
go

create procedure DeleteSubmission
AS
go

create procedure DeleteExercise
AS
go

-- cleanup procedures
drop procedure RegisterPlpUser
drop procedure UpdateRefreshToken
drop procedure GetUserByUsername
drop procedure UpdateUser
drop procedure UpdatePassword
drop procedure UpdateAvatar
drop procedure GetUserById

    
select * from [dbo].[PlpUser]
TRUNCATE table [PlpUser]