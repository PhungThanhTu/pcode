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