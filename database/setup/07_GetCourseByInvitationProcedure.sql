create procedure GetCourseIdByInvitationCode
    @code varchar(5)
    as
        select CourseId, PlpRoleId from [dbo].[CourseInvitation]
        where Code = @code
go