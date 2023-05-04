create procedure MarkSubmission
    @Id UNIQUEIDENTIFIER
    AS
    declare @UserId UNIQUEIDENTIFIER
    declare @ExerciseId UNIQUEIDENTIFIER
    select @UserId = UserId from [dbo].[SubmissionUser]
        where SubmissionId = @Id
    select @ExerciseId = ExerciseId from [dbo].[Submission]
        where Id = @Id
    update [dbo].[Submission]
        SET Choice = 0
    from [dbo].[Submission] S JOIN [dbo].[SubmissionUser] SU
        on S.Id = SU.SubmissionId
    where SU.UserId = @UserId and S.ExerciseId = @ExerciseId
    update [dbo].[Submission]
        set Choice = 1
        where Id = @Id