create procedure UpdateTestCaseUsingDocumentId
    @DocumentId UNIQUEIDENTIFIER,
    @Id INT,
    @Input nvarchar(max) = NULL,
    @ExpectedOutput nvarchar(max) = NULL,
    @ScoreWeight int = NULL,
    @Visibility bit = NULL,
    @TestOrder INT = NULL
    AS
        declare @ExerciseId UNIQUEIDENTIFIER
        select @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
            where DocumentId = @DocumentId
        update [dbo].[TestCase]
        SET
            [Input] = COALESCE(@Input, [Input]),
            ExpectedOutput = COALESCE(@ExpectedOutput, ExpectedOutput),
            ScoreWeight = COALESCE(@ScoreWeight, ScoreWeight),
            Visibility = COALESCE(@Visibility, Visibility),
            TestOrder = COALESCE(@TestOrder, TestOrder)
        WHERE ExerciseId = @ExerciseId
        AND Id = @Id
