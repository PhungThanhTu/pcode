alter PROCEDURE DeleteSubmissionById
    @SubmissionId UNIQUEIDENTIFIER
    AS
    DELETE FROM [dbo].[TestResult]
    where SubmissionId = @SubmissionId
    DELETE FROM [dbo].[SubmissionUser]
    where SubmissionId = @SubmissionId
    DELETE FROM [dbo].[Submission]
    where Id = @SubmissionId