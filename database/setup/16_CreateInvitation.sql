create procedure CreateInvitation
    @courseId UNIQUEIDENTIFIER,
    @plpRoleId int,
    @code varchar(5)
    AS
        MERGE INTO [dbo].[CourseInvitation] Destination
            USING(
                VALUES(
                    @courseId, @plpRoleId, @code
                ) 
            ) AS Source ( CourseId, PlpRoleId, Code )
            ON Source.CourseId = Destination.CourseId AND Source.PlpRoleId = Destination.PlpRoleId
            WHEN MATCHED THEN
                UPDATE SET Destination.Code = Source.Code         
            WHEN NOT MATCHED THEN
                INSERT ( CourseId, PlpRoleId, Code)
                VALUES (Source.CourseId, Source.PlpRoleId, Source.Code );
