create procedure GetStudentScoreInCourse
    @CourseId UNIQUEIDENTIFIER
    AS
    select
    U.id as UserId,
    U.username as Username,
    U.fullName as FullName,
    U.email as Email,
    CS.Score as Score
    from [dbo].[PlpCourseAuthorization] CU
    join [dbo].[PlpUser] U 
        on CU.UserId = U.id
    join [dbo].[CourseScore] CS
        on CS.UserId = U.id
        and CS.CourseId = CU.CourseId
    where CU.CourseId = @CourseId
