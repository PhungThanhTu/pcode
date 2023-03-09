create table CourseInvitation
(
    CourseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
    PlpRoleId int FOREIGN KEY REFERENCES [dbo].[PlpCourseRole](Id),
    Code varchar(5),
    CONSTRAINT PK_CourseInvitation PRIMARY KEY (CourseId, PlpRoleId)
)
GO

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
GO

create procedure GetCourseInvitationByCourseId
    @courseId UNIQUEIDENTIFIER,
    @roleId int
    AS
        select Id as PlpRoleId, PlpRoleName  from [dbo].[CourseInvitation] JOIN [dbo].[PlpCourseRole]
                on CourseInvitation.PlpRoleId = PlpCourseRole.Id
        WHERE CourseId = @courseId and Id = @roleId
GO

