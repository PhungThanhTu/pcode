create procedure GetTestCaseNewOrderByDocumentId
    @DocumentId UNIQUEIDENTIFIER
    AS
        select COALESCE(Max(TestOrder), 1) as TestOrder from [dbo].[TestCase] T
            join [dbo].[DocumentExercise] DE
            on T.ExerciseId = DE.ExerciseId
            where DE.DocumentId = @DocumentId