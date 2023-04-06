-- published auto set to false
create procedure CreateDocument
    @Id UNIQUEIDENTIFIER,
    @Title nvarchar(320),
    @Description nvarchar(640),
    @CreatorId UNIQUEIDENTIFIER,
    @HasExercise BIT
    AS
        insert into [dbo].[Document]
        (Id, Title, DocumentDescription, CreatorId, HasExercise)
        VALUES
        (@Id, @Title, @Description, @CreatorId, @HasExercise)