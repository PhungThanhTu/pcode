create procedure LinkDocumentWithCourse
    @DocumentId UNIQUEIDENTIFIER,
    @CourseId UNIQUEIDENTIFIER
    AS
        INSERT INTO [dbo].[DocumentCourse]
        (CourseId, DocumentId, IsPublic)
        VALUES
        (@CourseId, @DocumentId, 0)