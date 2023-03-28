declare @submissionId UNIQUEIDENTIFIER = '40a50118-e207-4672-9a44-7bf0aa51be76'
declare @programmingLanguageId int = 2
declare @jsonJudgeData nvarchar(max)= N'[
    {
        "testId":"8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF",
        "runTime":0.009,
        "memoryUsage":3080,
        "runStatus":1,
        "exitCode":4,
        "actualOutput":"3",
        "expectedOutput":"3",
        "errorOutput":"",
        "memoryLimit":12800,
        "status":
        "RN"
    },
    {
        "testId":"AC3E0E13-2C50-44FC-A274-FB73FB4986FA",
        "runTime":0.007,
        "memoryUsage":3084,
        "runStatus":1,
        "exitCode":4,
        "actualOutput":"-1",
        "expectedOutput":"-1",
        "errorOutput":"",
        "memoryLimit":12800,
        "status":"RN"
    }
]'
EXEC UpdateSubmissionResult @jsonJudgeData, @submissionId, @programmingLanguageId;
EXEC GetTestCasesBySubmissionId @Id = '40a50118-e207-4672-9a44-7bf0aa51be76'


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
('ac3e0e13-2c50-44fc-a274-fb73fb4986fa','c7f5f23d-ebdf-4262-b050-97aa5590aa03','2 -3','-1',1),

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
   return a - b;
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


update [dbo].[Exercise] set memoryLimit = 12800 where id = 'c7f5f23d-ebdf-4262-b050-97aa5590aa03'


select * from SubmissionTestResult
select * from [dbo].[SubmissionSourceCode]

select * from [dbo].[Exercise]

update [dbo].[Exercise] set runtimeLimit = 2000 


select * from PlpUser
select * from Course

EXEC GrantUserRoleToCourse
 @userId = '6fe8fdef-9a77-4fa3-aa69-6f634f8888a7',
 @courseId = '3698ac66-7102-4fb9-8a73-c3dcf418ee03',
 @plpRole = 'lecturer'

select * from PlpCourseAuthorization

select * from Course
select * from PlpCourseRole

declare @CourseId UNIQUEIDENTIFIER = '28bf2eaf-ff27-4d36-a94b-1e1fc28ed775'
declare @PlpRoleId INT = 1
declare @Code VARCHAR(5) = 'a24bc'
declare @Expiry datetime2 = '2023-03-03 22:00:00'

EXEC CreateInvitation 
    @CourseId,
    @PlpRoleId,
    @Code,
    @Expiry

select * from CourseInvitation

declare @CourseId UNIQUEIDENTIFIER = '28bf2eaf-ff27-4d36-a94b-1e1fc28ed775'
EXEC GetCourseStudentInvitationByCourseId
        @CourseId

declare @email varchar(max) = 'updated2@gmail.com'
declare @fullName nvarchar(max) = 'Temp2 Updated Name'
declare @id UNIQUEIDENTIFIER = '8b3a539e-07bc-4fe0-8ef1-fba27841ed35'
exec UpdateProfile @id,@fullName,@email
go