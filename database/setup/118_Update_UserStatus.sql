ALTER TABLE [dbo].[PlpUser]
add userStatus INT FOREIGN KEY REFERENCES [dbo].[UserStatus](Id)
