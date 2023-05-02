create procedure GetTestCaseInDocument
    @DocumentId UNIQUEIDENTIFIER,
    @Id INT
    as
        declare @ExerciseId UNIQUEIDENTIFIER
        select @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
            where DocumentId = @DocumentId
        select TestOrder, Id, [input], ExpectedOutput as [output], scoreWeight, visibility
        from [dbo].[TestCase]
        where ExerciseId = @ExerciseId 
        and Id = @Id