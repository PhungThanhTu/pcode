CREATE TABLE PlpCourseAuthorization
    (
        UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id),
        CourseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
        PlpRole INT FOREIGN KEY REFERENCES [dbo].[PlpCourseRole](id),
        CONSTRAINT PK_CourseAuthorization PRIMARY KEY (UserId, CourseId)
    )