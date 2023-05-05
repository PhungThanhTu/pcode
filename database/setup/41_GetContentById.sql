create procedure GetContentById
    @Id UNIQUEIDENTIFIER
    AS
    select Id, ContentTypeId, DocumentId, ContentBody from [dbo].[DocumentContent]
    where Id = @Id