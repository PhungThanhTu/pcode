create procedure GetAllCourses
    @userId UNIQUEIDENTIFIER
    AS
        select A.CourseId as id, title, Code, PlpRole
            from [dbo].[PlpCourseAuthorization] A 
            join [dbo].[Course] C on A.CourseId = C.id 
            left join [dbo].[CourseInvitation] I on C.id = I.CourseId
        where A.UserId = @userId
GO
