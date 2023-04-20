create procedure DeleteContent
    @Id UNIQUEIDENTIFIER
    AS
    DELETE FROM [dbo].[DocumentContent]
        where Id = @Id