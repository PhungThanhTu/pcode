create procedure GetCourseUsingStudentInvitationCode
    @code varchar(5)
    as 
        select id, title, courseTheme, courseSubject 
        from [dbo].[CourseInvitation] A 
        join [dbo].[Course] B 
        on A.CourseId = B.id
            where A.Code = @code
