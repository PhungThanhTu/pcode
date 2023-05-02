create procedure SwapTestCaseOrderInDocument
    @DocumentId UNIQUEIDENTIFIER,
    @TestOrder1 INT,
    @TestOrder2 INT
    AS
        declare @ExerciseId UNIQUEIDENTIFIER
        select @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
            where DocumentId = @DocumentId
        declare @Id1 INT
        declare @Id2 INT
        select @Id1 = Id from [dbo].[TestCase] 
            where ExerciseId = @ExerciseId 
            and TestOrder = @TestOrder1
        select @Id2 = Id from [dbo].[TestCase]
            where ExerciseId = @ExerciseId
            and TestOrder = @TestOrder2
        update [dbo].[TestCase]
        SET
            TestOrder = @TestOrder1
        WHERE Id = @Id2
        update [dbo].[TestCase]
        SET
            TestOrder = @TestOrder2
        where Id = @Id1