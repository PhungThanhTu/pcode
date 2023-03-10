create procedure RenameCourse
    @courseId UNIQUEIDENTIFIER,
    @newTitle nvarchar(max)
    AS
    UPDATE [dbo].[Course]  
        SET title = @newTitle
        where id = @courseId
go

