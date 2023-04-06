create table ContentType
(
    Id int primary key,
    MetaDescription nvarchar(max)
)

insert into [dbo].[ContentType]
(Id, MetaDescription)
VALUES
(0, 'markdown'),
(1, 'pdf')