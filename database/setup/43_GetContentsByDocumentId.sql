create procedure GetContentsByDocumentId
    @Id UNIQUEIDENTIFIER
    AS
        select Id, ContentTypeId, DocumentId, ContentBody from [dbo].[DocumentContent]
        where DocumentId = @Id