CREATE PROCEDURE CreateContent
    @Id UNIQUEIDENTIFIER,
    @ContentTypeId int,
    @DocumentId UNIQUEIDENTIFIER,
    @ContentBody NVARCHAR(max)
    AS
    INSERT INTO [dbo].[DocumentContent]
    (
        Id,
        ContentTypeId,
        DocumentId,
        ContentBody
    )
    VALUES
    (
        @Id,
        @ContentTypeId,
        @DocumentId,
        @ContentBody
    )
