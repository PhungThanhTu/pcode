create table MediaStorage 
(
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    MediaBlobName NVARCHAR(50),
    Extension VARCHAR(20),
    MimeType VARCHAR(40),
    FileSize float,
    Download bit
)