create procedure GetRoleOnDocument
    @Id UNIQUEIDENTIFIER
    as
    select PlpRole from [dbo].[Document] d
        join [dbo].[DocumentCourse] dc on d.Id = dc.DocumentId
        join [dbo].[PlpCourseAuthorization] ca on dc.CourseId = ca.CourseId
        where d.DocumentId = @Id