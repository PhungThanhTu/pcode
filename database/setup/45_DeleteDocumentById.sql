create procedure DeleteDocument
    @Id UNIQUEIDENTIFIER
    AS
        delete from [dbo].[DocumentCourse] where DocumentId = @Id
        delete from [dbo].[Document] where Id = @Id
