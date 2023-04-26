create procedure GetSampleSourceCode
    @ExerciseId UNIQUEIDENTIFIER,
    @ProgrammingLanguageId INT
    as
        select exerciseId, programmingLanguageId, sourceCode
        from [dbo].[SampleSourceCode]
    where
        exerciseId = @ExerciseId 
        and programmingLanguageId = @ProgrammingLanguageId

select * from [dbo].[Document]