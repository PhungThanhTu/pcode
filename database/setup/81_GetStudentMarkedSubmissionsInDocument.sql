create procedure GetStudentMarkedSubmissionsInDocument
    @DocumentId UNIQUEIDENTIFIER
    AS
    DECLARE @ExerciseId UNIQUEIDENTIFIER
    DECLARE @CourseId UNIQUEIDENTIFIER
    SELECT @ExerciseId = ExerciseId from [dbo].[DocumentExercise]
        where DocumentId = @DocumentId
    SELECT @CourseId = CourseId from [dbo].[DocumentCourse]
        where DocumentId = @DocumentId
    SELECT 
        PU.id as UserId,
        PU.fullName as [FullName],
        PU.username as UserName,
        PU.avatar as Avatar,
        S.Id as SubmissionId,
        S.AutomatedScore as AutomatecScore,
        S.ManualScore as ManualScore,
        S.ProgrammingLanguageId as ProgrammingLanguageId,
        S.SourceCode as SourceCode,
        S.Pending as Pending,
        S.Score as Score,
        S.TimeCreated as TimeCreated
    from 
    (
        select * from [dbo].[Submission]
        where Choice = 1
        and ExerciseId = @ExerciseId
    ) S
    JOIN [dbo].[SubmissionUser] SU 
    on S.Id = SU.SubmissionId
    RIGHT JOIN
    (
        select * from [dbo].[PlpCourseAuthorization] PCA
        where CourseId = @CourseId
        and PlpRole != 0
    ) PCA
    on PCA.UserId = SU.UserId
    LEFT JOIN [dbo].[PlpUser] PU
    on PCA.UserId = PU.id

