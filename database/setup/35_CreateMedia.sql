create procedure CreateMedia
    @Id UNIQUEIDENTIFIER,
    @MediaBlobName NVARCHAR(50),
    @Extension VARCHAR(20),
    @MimeType VARCHAR(40),
    @FileSize float,
    @Download bit
    AS
        INSERT INTO [dbo].[MediaStorage]
        (
            Id,
<<<<<<< Updated upstream
            MediaBlogName,
=======
            MediaBlobName,
>>>>>>> Stashed changes
            Extension,
            MimeType,
            FileSize,
            Download
        )
        VALUES
        (
            @Id,
            @MediaBlobName,
            @Extension,
            @MimeType,
            @FileSize,
            @Download
        )