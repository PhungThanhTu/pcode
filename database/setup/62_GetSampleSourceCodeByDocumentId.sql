create procedure GetSampleSourceCodeByDocumentId
    @DocumentId UNIQUEIDENTIFIER,
    @ProgrammingLanguageId INT
    as
        select
            DE.exerciseId,
            programmingLanguageId,
            sourceCode
        from [dbo].[SampleSourceCode] SSC
        join [dbo].[Exercise] E
            on SSC.exerciseId = E.Id
        join [dbo].[DocumentExercise] DE
            on E.Id = DE.ExerciseId
        where 
            DE.DocumentId = @DocumentId
            and SSC.programmingLanguageId = @ProgrammingLanguageId