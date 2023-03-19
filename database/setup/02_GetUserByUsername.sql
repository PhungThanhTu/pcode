-- created
create procedure GetUserByUsername
    @username varchar(20)
    AS
        select id,username,hashedPassword,email,fullName,refreshToken,expiryDate,avatar
        from [dbo].[PlpUser]
        where username = @username