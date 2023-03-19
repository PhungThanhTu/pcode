CREATE TABLE PlpCourseRole (
    Id int PRIMARY key,
    PlpRoleName varchar(10)
)

INSERT INTO [dbo].[PlpCourseRole]
(id, PlpRoleName)
VALUES
(0, 'lecturer'),
(1, 'student')


