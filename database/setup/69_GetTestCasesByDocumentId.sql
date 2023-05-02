create procedure GetTestCasesByDocumentId
    @DocumentId UNIQUEIDENTIFIER
    AS
        select TestOrder, TC.Id, [input], ExpectedOutput as [output], scoreWeight, visibility
        from [dbo].[TestCase] TC
        join [dbo].[DocumentExercise] DE
        on TC.ExerciseId = DE.ExerciseId
        where DE.DocumentId = @DocumentId
        ORDER BY TestOrder ASC

