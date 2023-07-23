create procedure UpdateUserTestcase
    @ExerciseId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER,
    @Id INT,
    @Input nvarchar(max) = NULL,
    @ExpectedOutput nvarchar(max) = NULL,
    @TestOrder INT
    AS

        update [dbo].[UserTestcase]
        SET
            [Input] = COALESCE(@Input, [Input]),
            ExpectedOutput = COALESCE(@ExpectedOutput, ExpectedOutput),
            TestOrder = COALESCE(@TestOrder, TestOrder)
        WHERE ExerciseId = @ExerciseId
        AND UserId = @UserId
        AND Id = @Id
