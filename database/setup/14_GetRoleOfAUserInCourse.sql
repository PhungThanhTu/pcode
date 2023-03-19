CREATE PROCEDURE GetRoleOfAUserInCourse
    @userId UNIQUEIDENTIFIER,
    @courseId UNIQUEIDENTIFIER
    AS
    SELECT PlpRole as [Role] from [dbo].[PlpCourseAuthorization]
        where UserId = @userId
        and CourseId = @courseId