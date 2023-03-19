

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
)
create table Course
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    title nvarchar(max),
    courseSubject nvarchar(max),
    courseTheme nvarchar(max)
)
create table Exercise
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    runtimeLimit int,
    memoryLimit int,
    scoreWeight int,
    timeCreated smalldatetime
)
create table CourseExercise
(
    courseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
    exerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id),
    title nvarchar(max),
    document nvarchar(max)
)
create table ProgrammingLanguage
(
    id int PRIMARY KEY,
    languageName varchar(20),
    fileExtension varchar(10),

)
insert into [dbo].[ProgrammingLanguage] 
(id,languageName,fileExtension)
VALUES 
(1,'c','c'),
(2,'cpp','cpp')

create table SampleSourceCode
(
    exerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    programmingLanguageId int FOREIGN KEY REFERENCES [dbo].[ProgrammingLanguage](id) NOT NULL,
    sourceCode nvarchar(max),
    CONSTRAINT PK_SampleSourceCode PRIMARY KEY (exerciseId,programmingLanguageId)
)
create table MetaTestCase
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    exercise UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    input nvarchar(max),
    expectedOutput nvarchar(max),
    scoreWeight int,
)
create table Submission
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    exerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    score float,
    averageTime float,
    averageMemory float,
    timeCreated smalldatetime 
)
create table SubmissionSourceCode
(
    submissionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Submission](id) NOT NULL,
    programmingLanguageId int FOREIGN KEY REFERENCES [dbo].[ProgrammingLanguage](id) NOT NULL,
    sourceCode nvarchar(max)
)
create table RunStatus (
    id int primary key,
    statusDescription nvarchar(50)
)
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
)