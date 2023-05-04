create procedure CheckOwnerSubmission
    @UserId UNIQUEIDENTIFIER,
    @SubmissionId UNIQUEIDENTIFIER
    as
        select 1 as IsOwner from [dbo].[SubmissionUser]
            where UserId = @UserId
            and SubmissionId = @SubmissionId