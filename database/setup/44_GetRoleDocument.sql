create procedure GetRoleOnDocument
    @DocumentId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER
    as
    select * from [dbo].[Document] d
        join [dbo].[DocumentCourse] dc on d.Id = dc.DocumentId
        join [dbo].[PlpCourseAuthorization] ca on dc.CourseId = ca.CourseId
        where d.Id = @DocumentId
        and ca.UserId = @UserId