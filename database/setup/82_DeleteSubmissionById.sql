create procedure DeleteSubmissionById
    @SubmissionId UNIQUEIDENTIFIER
    AS
    DELETE FROM [dbo].[SubmissionUser]
    where SubmissionId = @SubmissionId
    DELETE FROM [dbo].[Submission]
    where Id = @SubmissionId