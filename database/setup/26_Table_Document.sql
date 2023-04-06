create table Document (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Title nvarchar(320),
    DocumentDescription nvarchar(640),
    CreatorId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id),
    HasExercise bit
)