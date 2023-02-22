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
(id,languageName,fileExtension)
VALUES 
(1,'c','c'),
(2,'cpp','cpp')
go
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
create procedure GetTestCasesBySubmissionId 
    @Id UNIQUEIDENTIFIER
    AS
        select m.id as testId, m.input, m.expectedOutput, m.scoreWeight from [dbo].[MetaTestCase] m join [dbo].[Exercise] e on m.exercise = e.id
        join [dbo].[Submission] s on s.exerciseId = e.id
        where s.id = @Id
    GO

EXEC GetTestCasesBySubmissionId @Id = '40a50118-e207-4672-9a44-7bf0aa51be76'
-- cleanup procedures
drop procedure RegisterPlpUser
drop procedure UpdateRefreshToken
drop procedure GetUserByUsername
drop procedure UpdateUser
drop procedure UpdatePassword
drop procedure UpdateAvatar
drop procedure GetUserById

drop procedure GetTestCasesBySubmissionId
    
-- TEST
select * from SubmissionTestResult
select * from SubmissionSourceCode
select * from Submission
select * from RunStatus
select * from MetaTestCase
select * from SampleSourceCode
select * from [dbo].[ProgrammingLanguage]
select * from Exercise
select * from course
-- INSERT JUDGE DATA
    -- insert exercise
insert into [dbo].[Exercise]
(id,runtimeLimit,memoryLimit,scoreWeight,timeCreated)
values
('c7f5f23d-ebdf-4262-b050-97aa5590aa03',2000,2048,1,'2023-02-20 15:00:00')
    -- insert sample source code
insert into [dbo].[SampleSourceCode]
(exerciseId,programmingLanguageId,sourceCode)
values
('c7f5f23d-ebdf-4262-b050-97aa5590aa03',2,N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
   // Write your solution here
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}')
    -- insert meta test cases
insert into [dbo].[MetaTestCase] 
(id,exercise,input,expectedOutput,scoreWeight)
values
('8efa93ad-0dae-4a6d-9e6d-55777a4645bf','c7f5f23d-ebdf-4262-b050-97aa5590aa03','1 2','3',1)

    -- insert Submission
insert into [dbo].[Submission]
(id, exerciseId, score, averageTime, averageMemory, timeCreated)
VALUES
('40a50118-e207-4672-9a44-7bf0aa51be76','c7f5f23d-ebdf-4262-b050-97aa5590aa03',0,0,0,'2023-02-20 15:00:00'),
('137bc48a-fa98-4167-abc4-889f61a2e2db','c7f5f23d-ebdf-4262-b050-97aa5590aa03',0,0,0,'2023-02-20 15:00:00'),
('9f4d8da1-a41a-406e-a7c4-64e4e67f1696','c7f5f23d-ebdf-4262-b050-97aa5590aa03',0,0,0,'2023-02-20 15:00:00')

    -- insert Submission Source code
insert into [dbo].[SubmissionSourceCode]
(submissionId,programmingLanguageId,sourceCode)
VALUES
('40a50118-e207-4672-9a44-7bf0aa51be76',2,N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
   return a + b;
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}'),
('137bc48a-fa98-4167-abc4-889f61a2e2db',2,N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
   return a - b;
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}'),
('9f4d8da1-a41a-406e-a7c4-64e4e67f1696',2,N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
  while(true){}
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}')

    -- insert submission test result
insert into [dbo].[SubmissionTestResult]
(submissionId,testId,programmingLanguageId,runStatus)
values
('40a50118-e207-4672-9a44-7bf0aa51be76','8efa93ad-0dae-4a6d-9e6d-55777a4645bf',2,0),
('137bc48a-fa98-4167-abc4-889f61a2e2db','8efa93ad-0dae-4a6d-9e6d-55777a4645bf',2,0),
('9f4d8da1-a41a-406e-a7c4-64e4e67f1696','8efa93ad-0dae-4a6d-9e6d-55777a4645bf',2,0)
go


