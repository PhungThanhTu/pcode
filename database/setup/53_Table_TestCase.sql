-- remove legacy table MetaTestCase
-- drop table MetaTestCase
create table TestCase
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    exercise UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Exercise](id) NOT NULL,
    input nvarchar(max),
    expectedOutput nvarchar(max),
    scoreWeight int,
    visibility bit
)