CREATE PROCEDURE GetAllUserTestcase
@UserId UNIQUEIDENTIFIER,
@ExerciseId UNIQUEIDENTIFIER
    as
        select
            Id,
            UserId,
            ExerciseId,
            [Input],
            ExpectedOutput,
            TestOrder
        from [dbo].[UserTestcase]
        where UserId = @UserId
        and ExerciseId = @ExerciseId
        ORDER BY TestOrder ASC