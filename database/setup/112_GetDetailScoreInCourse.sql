create procedure GetAllDetailScoreInCourse
    @CourseId UNIQUEIDENTIFIER
as
    select
        Document.Id, Score, ScoreWeight, Title, UserId
    from [dbo].[DocumentScore] 
        join Document on Document.Id = DocumentScore.DocumentId
        join DocumentExercise on Document.Id = DocumentExercise.DocumentId
        join Exercise on DocumentExercise.ExerciseId = Exercise.Id
        join DocumentCourse on DocumentCourse.DocumentId = Document.Id 
    where 
        DocumentCourse.CourseId = @CourseId

