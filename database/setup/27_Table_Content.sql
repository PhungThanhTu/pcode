create table DocumentContent (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    DocumentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Document](Id),
    ContentBody nvarchar(max)
)