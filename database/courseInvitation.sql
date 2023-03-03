create table CourseInvitation
(
    CourseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
    PlpRoleId int FOREIGN KEY REFERENCES [dbo].[PlpCourseRole](Id),
    Code varchar(5),
    Expiry datetime2,
    CONSTRAINT PK_CourseInvitation PRIMARY KEY (CourseId, PlpRoleId)
)
GO

create procedure CreateInvitation
    @CourseId UNIQUEIDENTIFIER,
    @PlpRoleId int,
    @Code varchar(5),
    @Expiry DATETIME2
    AS
        MERGE INTO [dbo].[CourseInvitation] Destination
            USING(
                VALUES(
                    @CourseId, @PlpRoleId, @Code, @Expiry
                ) 
            ) AS Source ( CourseId, PlpRoleId, Code, Expiry )
            ON Source.CourseId = Destination.CourseId AND Source.PlpRoleId = Destination.PlpRoleId
            WHEN MATCHED THEN
                UPDATE SET Destination.Code = Source.Code,
                           Destination.Expiry = Source.Expiry
            WHEN NOT MATCHED THEN
                INSERT ( CourseId, PlpRoleId, Code, Expiry )
                VALUES (Source.CourseId, Source.PlpRoleId, Source.Code, Source.Expiry);
GO

create procedure GetCourseStudentInvitationByCourseId
    @CourseId UNIQUEIDENTIFIER
    AS
        select Id as PlpRoleId, PlpRoleName  from [dbo].[CourseInvitation] JOIN [dbo].[PlpCourseRole]
                on CourseInvitation.PlpRoleId = PlpCourseRole.Id
        WHERE CourseId = @CourseId
GO
            

           