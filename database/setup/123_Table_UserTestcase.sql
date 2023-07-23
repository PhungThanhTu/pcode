create table UserTestcase
(
    Id int,
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id),
    ExerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    Input nvarchar(max),
    ExpectedOutput nvarchar(max),
    TestOrder int
)
