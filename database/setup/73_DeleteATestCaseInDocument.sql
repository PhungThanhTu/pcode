create procedure DeleteATestCaseInDocument
    @DocumentId UNIQUEIDENTIFIER,
    @Id INT
    as
        declare @ExerciseId UNIQUEIDENTIFIER
        declare @CurrOrder INT
        select @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
            where DocumentId = @DocumentId
        select @CurrOrder = TestOrder from [dbo].[TestCase]
            where ExerciseId = @ExerciseId
            and Id = @Id
        delete from [dbo].[TestCase]
            where ExerciseId = @ExerciseId
            and Id = @Id
        update [dbo].[TestCase]
            set TestOrder = TestOrder - 1
            where ExerciseId = @ExerciseId
            and TestOrder > @CurrOrder