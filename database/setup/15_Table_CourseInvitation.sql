create table CourseInvitation
(
    CourseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
    PlpRoleId int FOREIGN KEY REFERENCES [dbo].[PlpCourseRole](Id),
    Code varchar(5),
    CONSTRAINT PK_CourseInvitation PRIMARY KEY (CourseId, PlpRoleId)
)

