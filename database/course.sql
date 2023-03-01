
---- PROCEDURES 
create procedure CreateCourse
    @id UNIQUEIDENTIFIER,
    @title nvarchar(max)
    AS
    INSERT INTO [dbo].[Course]
    (id, title)
    VALUES
    (@id, @title)
GO
