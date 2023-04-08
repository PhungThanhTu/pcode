create procedure GetPublishedDocumentsInCourse
    @CourseId UNIQUEIDENTIFIER
    AS
    select Id, Title, DocumentDescription, HasExercise from [dbo].[DocumentCourse] dc join [dbo].[Document] d 
        on dc.DocumentId = d.Id
        where CourseId = @CourseId
        and IsPublic = 1