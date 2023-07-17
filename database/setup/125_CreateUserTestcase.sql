create procedure CreateUserTestcase
    @Id INT,
    @UserId UNIQUEIDENTIFIER,
    @ExerciseId UNIQUEIDENTIFIER,
    @Input nvarchar(max),
    @ExpectedOutput nvarchar(max),
    @TestOrder INT
    AS
        INSERT INTO [dbo].[UserTestcase]
        (
            Id,
            UserId,
            ExerciseId,
            [Input],
            ExpectedOutput,
            TestOrder
        )
        VALUES
        (
            @Id,
            @UserId,
            @ExerciseId,
            @Input,
            @ExpectedOutput,
            @TestOrder
        )