create procedure UpdateContentById
    @Id UNIQUEIDENTIFIER,
    @ContentBody NVARCHAR(max)
    as
    UPDATE [dbo].[DocumentContent]
        set ContentBody = @ContentBody
        where Id = @Id
