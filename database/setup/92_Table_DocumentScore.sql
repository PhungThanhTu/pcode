create table DocumentScore
(
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id),
    DocumentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Document](Id),
    Score float
)