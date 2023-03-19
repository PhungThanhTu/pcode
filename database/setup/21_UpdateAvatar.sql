create procedure UpdateAvatar
    @id UNIQUEIDENTIFIER,
    @avatar NVARCHAR(max)
    AS
        update [dbo].[PlpUser]
            set avatar = @avatar
            where id = @id