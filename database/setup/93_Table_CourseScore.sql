create table CourseScore
(
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id),
    CourseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
    Score float
)