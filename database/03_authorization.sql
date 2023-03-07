CREATE TABLE PlpCourseRole (
    Id int PRIMARY key,
    PlpRoleName varchar(10)
);
GO

INSERT INTO [dbo].[PlpCourseRole]
(id, PlpRoleName)
VALUES
(0, 'lecturer'),
(1, 'student')
GO

CREATE TABLE PlpCourseAuthorization
    (
        UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id),
        CourseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
        PlpRole INT FOREIGN KEY REFERENCES [dbo].[PlpCourseRole](id),
        CONSTRAINT PK_CourseAuthorization PRIMARY KEY (UserId, CourseId)
    );
GO


CREATE PROCEDURE GrantUserRoleToCourse
    @userId UNIQUEIDENTIFIER,
    @courseId UNIQUEIDENTIFIER,
    @plpRole int
    AS
        MERGE INTO [dbo].[PlpCourseAuthorization] Destination
        USING(
            VALUES(
                @userId, @courseId, @plpRole
            ) 
        ) AS Source ( UserId, CourseId, PlpRole)
        ON Source.UserId = Destination.UserId AND Source.CourseId = Destination.CourseId
        WHEN MATCHED THEN
            UPDATE SET Destination.PlpRole = Source.PlpRole
        WHEN NOT MATCHED THEN
            INSERT (UserId, CourseId, PlpRole)
            VALUES (Source.UserId, Source.CourseId, Source.PlpRole);
GO

CREATE PROCEDURE GetRoleOfAUserInCourse
    @userId UNIQUEIDENTIFIER,
    @courseId UNIQUEIDENTIFIER
    AS
    SELECT PlpRole as [Role] from [dbo].[PlpCourseAuthorization]
        where UserId = @userId
        and CourseId = @courseId
GO
