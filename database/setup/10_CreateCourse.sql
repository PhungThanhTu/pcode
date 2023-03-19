
create procedure CreateCourse
    @id UNIQUEIDENTIFIER,
    @title nvarchar(max),
    @courseSubject nvarchar(max) = 'General',
    @courseTheme nvarchar(max) = NULL
    AS
    INSERT INTO [dbo].[Course]
    (id, title, courseSubject, courseTheme)
    VALUES
    (@id, @title, @courseSubject, @courseTheme)

