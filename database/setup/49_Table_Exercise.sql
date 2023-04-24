-- remove legacy Exercise
-- drop table Exercise

create table Exercise
(
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    RuntimeLimit int,
    MemoryLimit int,
    ScoreWeight int,
    TimeCreated smalldatetime,
    Deadline datetime2,
    StrictDeadline bit,
    ManualPercentage float,
    Check(ManualPercentage >= 0 and ManualPercentage <= 1)
)