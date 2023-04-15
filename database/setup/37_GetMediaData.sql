create PROCEDURE GetMediaData
    @Id UNIQUEIDENTIFIER
    AS
    SELECT Id, MediaBlobName, Extension, MimeType, FileSize, Download 
    FROM [dbo].[MediaStorage]
    WHERE Id = @Id