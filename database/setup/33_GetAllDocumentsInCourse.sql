create procedure GetAllDocumentsInCourse
    @CourseId UNIQUEIDENTIFIER
    AS
    select Id, Title, DocumentDescription, HasExercise from [dbo].[DocumentCourse] dc join [dbo].[Document] d 
        on dc.DocumentId = d.Id
        where CourseId = @CourseId
