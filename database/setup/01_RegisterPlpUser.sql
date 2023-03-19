-- PROCEDURES
---- AUTHENTICATION
-- created
create procedure RegisterPlpUser 
    @id UNIQUEIDENTIFIER, 
    @username varchar(20), 
    @hashedPassword varchar(max), 
    @email varchar(max),
    @fullName nvarchar(max)
    AS
        begin
            insert into PlpUser 
            (id,username,hashedPassword,email,fullName) values (
                @id,
                @username,
                @hashedPassword,
                @email,
                @fullName
            )
        end

    
