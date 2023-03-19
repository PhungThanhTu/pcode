
create procedure GetCourseInvitationByCourseId
    @courseId UNIQUEIDENTIFIER,
    @roleId int
    AS
        select Id as PlpRoleId, PlpRoleName  from [dbo].[CourseInvitation] JOIN [dbo].[PlpCourseRole]
                on CourseInvitation.PlpRoleId = PlpCourseRole.Id
        WHERE CourseId = @courseId and Id = @roleId