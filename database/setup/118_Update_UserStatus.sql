ALTER TABLE [dbo].[PlpUser]
add userStatus INT FOREIGN KEY REFERENCES [dbo].[UserStatus](Id)

-- update user status to all user
UPDATE [dbo].[PlpUser]
SET userStatus = 0
