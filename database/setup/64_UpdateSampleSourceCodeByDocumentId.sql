create procedure UpdateSampleSourceCodeByDocumentId
    @DocumentId UNIQUEIDENTIFIER,
    @ProgrammingLanguageId INT,
    @SourceCode NVARCHAR(MAX)
    AS
        DECLARE @ExerciseId UNIQUEIDENTIFIER
        SELECT @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
            where DocumentId = @DocumentId
        UPDATE [dbo].[SampleSourceCode]
            SET sourceCode = @SourceCode
        WHERE programmingLanguageId = @ProgrammingLanguageId
            and exerciseId = @ExerciseId