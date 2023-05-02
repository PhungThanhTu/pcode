create procedure GetTestCaseMaxIdByDocumentId
    @DocumentId UNIQUEIDENTIFIER
    AS
        select COALESCE(Max(Id), 0) as Id from [dbo].[TestCase] T
            join [dbo].[DocumentExercise] DE
            on T.ExerciseId = DE.ExerciseId
            where DE.DocumentId = @DocumentId