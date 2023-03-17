
---- PROCEDURES 
create procedure CreateCourse
    @id UNIQUEIDENTIFIER,
    @title nvarchar(max),
    @courseSubject nvarchar(max) = 'General',
    @courseTheme nvarchar(max) = NULL
    AS
    INSERT INTO [dbo].[Course]
    (id, title)
    VALUES
    (@id, @title)
GO

create table Course
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    title nvarchar(max),
    courseSubject nvarchar(max),
    courseTheme nvarchar(max)
);