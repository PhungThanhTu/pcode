create procedure ScoreSubmissionManually
    @SubmissionId UNIQUEIDENTIFIER,
    @Score float
    as
    update [dbo].[Submission]
        set ManualScore = @Score
        where Id = @SubmissionId