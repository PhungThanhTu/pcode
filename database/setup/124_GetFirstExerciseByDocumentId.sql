CREATE PROCEDURE GetFirstExerciseByDocumentId
@DocumentId UNIQUEIDENTIFIER
    AS
    select * from [dbo].[DocumentExercise]
        where DocumentId = @DocumentId