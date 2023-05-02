create table TestCase
(
    Id int,
    ExerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    Input nvarchar(max),
    ExpectedOutput nvarchar(max),
    ScoreWeight int,
    Visibility bit,
    TestOrder int
)
