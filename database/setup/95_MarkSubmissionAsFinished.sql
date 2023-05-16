create procedure MarkSubmissionAsFinished
    @SubmissionId UNIQUEIDENTIFIER
    AS
    UPDATE [dbo].[Submission]
        Set Pending = 0
        where Id = @SubmissionId