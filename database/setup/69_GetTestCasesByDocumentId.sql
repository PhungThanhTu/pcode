create procedure GetTestCasesByDocumentId
    @DocumentId UNIQUEIDENTIFIER,
    @IsCreator bit
    AS
        select TestOrder, TC.Id, [input], ExpectedOutput as [output], scoreWeight, visibility
        from [dbo].[TestCase] TC
        join [dbo].[DocumentExercise] DE
        on TC.ExerciseId = DE.ExerciseId
        where DE.DocumentId = @DocumentId
        and (@IsCreator = 1 OR Visibility = 1)
        ORDER BY TestOrder ASC