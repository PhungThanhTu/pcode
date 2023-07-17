create procedure DeleteUserTestcase
    @ExerciseId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER,
    @Id INT
    as
        declare @CurrOrder INT
        select @CurrOrder = TestOrder from [dbo].[UserTestcase]
            where ExerciseId = @ExerciseId
            and UserId = @UserId
            and Id = @Id
        delete from [dbo].[UserTestcase]
            where ExerciseId = @ExerciseId
            and UserId = @UserId
            and Id = @Id
        update [dbo].[UserTestcase]
            set TestOrder = TestOrder - 1
            where ExerciseId = @ExerciseId
            and UserId = @UserId
            and TestOrder > @CurrOrder