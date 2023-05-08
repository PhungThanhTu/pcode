create table RunStatus (
    id int primary key,
    statusDescription nvarchar(50)
)
insert into [dbo].[RunStatus]
(id,statusDescription)
VALUES
(0,'Pending'),
(1,'Accepted'),
(2,'Wrong'),
(3,'Compliation Error'),
(4,'Runtime Error'),
(5,'Memory Limit Exceeded'),
(6,'Time Limit Exceeded'),
(7,'Others')