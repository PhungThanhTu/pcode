create procedure DeleteDocument
    @Id UNIQUEIDENTIFIER
    AS
        delete from [dbo].[DocumentCourse] where DocumentId = @Id
        delete from [dbo].[DocumentExercise] where DocumentId = @Id
        delete from [dbo].[DocumentScore] where DocumentId = @Id
        delete from [dbo].[Document] where Id = @Id
