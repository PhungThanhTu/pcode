create table Exercise
(
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    RuntimeLimit int,
    MemoryLimit int,
    ScoreWeight int,
    TimeCreated smalldatetime,
    HaveDeadline bit,
    Deadline datetime2,
    StrictDeadline bit,
    ManualPercentage float,
    Check(ManualPercentage >= 0 and ManualPercentage <= 1)
)
