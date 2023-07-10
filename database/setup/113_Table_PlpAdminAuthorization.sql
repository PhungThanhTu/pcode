CREATE TABLE PlpAdminAuthorization
(
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[PlpUser](id)
)