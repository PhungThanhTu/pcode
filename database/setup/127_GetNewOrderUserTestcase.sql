create procedure GetNewOrderUserTestcase
    @ExerciseId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER
    AS
        select COALESCE(Max(TestOrder), 0) as TestOrder from [dbo].[UserTestcase]
        where ExerciseId = @ExerciseId
        and UserId = @UserId