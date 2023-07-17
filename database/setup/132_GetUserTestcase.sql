create procedure GetUserTestcase
    @ExerciseId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER,
    @Id INT
    as
        select TestOrder, Id, [Input], ExpectedOutput as [Output]
        from [dbo].[UserTestcase]
        where ExerciseId = @ExerciseId 
        and UserId = @UserId
        and Id = @Id