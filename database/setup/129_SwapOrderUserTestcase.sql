create procedure SwapOrderUserTestcase
    @ExerciseId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER,
    @TestOrder1 INT,
    @TestOrder2 INT
    AS
        declare @Id1 INT
        declare @Id2 INT
        select @Id1 = Id from [dbo].[UserTestcase] 
            where ExerciseId = @ExerciseId
            and UserId = @UserId 
            and TestOrder = @TestOrder1
        select @Id2 = Id from [dbo].[UserTestcase]
            where ExerciseId = @ExerciseId
            and UserId = @UserId
            and TestOrder = @TestOrder2
        update [dbo].[UserTestcase]
        SET
            TestOrder = @TestOrder1
        WHERE Id = @Id2
        update [dbo].[UserTestcase]
        SET
            TestOrder = @TestOrder2
        where Id = @Id1