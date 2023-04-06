create procedure SetDocumentPublicity
    @DocumentId UNIQUEIDENTIFIER,
    @CourseId UNIQUEIDENTIFIER,
    @Publicity BIT
    AS
    UPDATE [dbo].[DocumentCourse]
        SET IsPublic = @Publicity
        WHERE DocumentId = @DocumentId
        AND CourseId = @CourseId
