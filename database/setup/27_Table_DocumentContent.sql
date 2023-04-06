create table DocumentContent (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    ContentTypeId int FOREIGN KEY REFERENCES [dbo].[ContentType](Id),
    DocumentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Document](Id),
    ContentBody nvarchar(max)
)