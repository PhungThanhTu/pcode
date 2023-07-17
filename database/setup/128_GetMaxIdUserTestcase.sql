create procedure GetMaxIdUserTestcase
    @ExerciseId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER
    AS
        select COALESCE(Max(Id), 0) as Id from [dbo].[UserTestcase]
        where ExerciseId = @ExerciseId
        and UserId = @UserId
  
