create table SubmissionUser
(
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id),
    SubmissionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Submission](Id),
    CONSTRAINT PK_SubmissionUser PRIMARY KEY (UserId, SubmissionId)
)