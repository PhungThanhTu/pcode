create procedure GetAllCourses
    @userId UNIQUEIDENTIFIER
    AS
        select A.CourseId as id, Creator.UserId as CreatorId, U.username as CreatorName, title, courseSubject, courseTheme, Code, A.PlpRole
            from [dbo].[PlpCourseAuthorization] A 
            join [dbo].[Course] C on A.CourseId = C.id 
            left join [dbo].[CourseInvitation] I on C.id = I.CourseId
            left join [dbo].[PlpCourseAuthorization] Creator on A.CourseId = Creator.CourseId
            join [dbo].[PlpUser] U on Creator.UserId = U.id
        where A.UserId = @userId and Creator.PlpRole = 0
