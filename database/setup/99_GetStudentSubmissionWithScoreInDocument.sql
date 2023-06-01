create procedure GetStudentSubmissionWithScoreInDocument
    @DocumentId UNIQUEIDENTIFIER
    AS
    SELECT
        DE.DocumentId,
        U.id as UserId,
        U.username as Username,
        U.fullName,
        U.email,
        S.Id as SubmissionId,
        S.ManualScore as ManualScore,
        S.AutomatedScore as AutomatecScore,
        DS.Score as Score,
        E.ManualPercentage
    FROM [dbo].[Submission] S
    join [dbo].[SubmissionUser] SU 
        on SU.SubmissionId = S.Id
    join [dbo].[DocumentExercise] DE
        on DE.ExerciseId = S.ExerciseId
    join [dbo].[Exercise] E 
        on E.Id = DE.ExerciseId
    join [dbo].[DocumentScore] DS 
        on DS.DocumentId = DE.DocumentId
        and DS.UserId = SU.UserId
    join [dbo].[PlpUser] U
        on SU.UserId = U.id
    where S.Choice = 1
    and DE.DocumentId = @DocumentId