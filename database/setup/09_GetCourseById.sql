create procedure GetCourseById
    @courseId UNIQUEIDENTIFIER
    AS
    select * from [dbo].[Course]
    where id = @courseId
GO

select * from [dbo].[Course]