create table Submission
(
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    ExerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    ProgrammingLanguageId INT FOREIGN KEY REFERENCES [dbo].[ProgrammingLanguage](Id),
    SourceCode NVARCHAR(max),
    AutomatedScore float,
    ManualScore float,
    Score float,
    TimeCreated datetime2,
    Choice bit,
    Pending bit
)