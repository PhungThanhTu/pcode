create table MediaStorage 
(
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    MediaBlobName NVARCHAR(50),
    Extension VARCHAR(20),
    MimeType VARCHAR(40),
    FileSize float,
    Download bit
)

---- SERVER
    -- DATABASE
        -- SCHEMA
            -- TABLE
-- use TARGET
-- Source - ADVENTUREWORK2019 as SOURCE
-- insert into TARGET.dbo.DimProduct
-- select from SOURCE.dbo.Production.Product
-- Target - DWK260406_101 as TARGET