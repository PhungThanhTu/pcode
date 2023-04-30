create procedure CreateSampleSourceCodeByDocumentId
    @DocumentId UNIQUEIDENTIFIER,
    @ProgrammingLanguageId INT,
    @SourceCode NVARCHAR(MAX)
    AS
        DECLARE @ExerciseId UNIQUEIDENTIFIER
        SELECT @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
            where DocumentId = @DocumentId
        INSERT INTO [dbo].[SampleSourceCode]
        (exerciseId, programmingLanguageId, sourceCode)
        VALUES
        (@ExerciseId, @ProgrammingLanguageId, @SourceCode)