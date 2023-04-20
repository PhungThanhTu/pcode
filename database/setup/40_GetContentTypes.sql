create procedure GetContentTypes
    as 
        select Id, MetaDescription from [dbo].[ContentType]