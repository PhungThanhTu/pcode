create procedure GetDocumentById
    @Id UNIQUEIDENTIFIER
    AS
    select Id, Title, DocumentDescription, CreatorId, HasExercise from [dbo].[Document]
    where Id = @Id