create procedure CreateTestCaseInDocument
    @Id INT,
    @DocumentId UNIQUEIDENTIFIER,
    @Input nvarchar(max),
    @ExpectedOutput nvarchar(max),
    @ScoreWeight int,
    @Visibility bit,
    @TestOrder INT
    AS
        declare @ExerciseId UNIQUEIDENTIFIER
        select @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
            where DocumentId = @DocumentId
        INSERT INTO [dbo].[TestCase]
        (
            Id,
            ExerciseId,
            [Input],
            ExpectedOutput,
            ScoreWeight,
            Visibility,
            TestOrder
        )
        VALUESi
        (
            @Id,
            @ExerciseId,
            @Input,
            @ExpectedOutput,
            @ScoreWeight,
            @Visibility,
            @TestOrder
        )        