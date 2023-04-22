create procedure SetDocumentPublicityAllCourse
    @DocumentId UNIQUEIDENTIFIER,
    @Publicity BIT
    AS
    UPDATE [dbo].[DocumentCourse]
        SET IsPublic = @Publicity
        WHERE DocumentId = @DocumentId
