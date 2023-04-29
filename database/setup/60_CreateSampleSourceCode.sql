create procedure CreateSampleSourceCode
    @ExerciseId UNIQUEIDENTIFIER,
    @ProgrammingLanguageId INT,
    @SourceCode NVARCHAR(MAX)
    as
    INSERT INTO [dbo].[SampleSourceCode]
    (exerciseId, programmingLanguageId, sourceCode)
    VALUES
    (@ExerciseId, @ProgrammingLanguageId, @SourceCode)