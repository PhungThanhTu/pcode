create table Document (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    ContentTypeId int FOREIGN KEY REFERENCES [dbo].[ContentType](Id),
    CreatorId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id),
    Published bit,
    HasExercise bit
)