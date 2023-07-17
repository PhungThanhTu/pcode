-- TABLES
-- setup PlpUser
create table PlpUser
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    username varchar(20),
    hashedPassword varchar(max),
    email varchar(max),
    fullName nvarchar(max),
    refreshToken varchar(max),
    expiryDate datetime,
    avatar nvarchar(max)
)
create table Course
(
    id UNIQUEIDENTIFIER PRIMARY KEY,
    title nvarchar(max),
    courseSubject nvarchar(max),
    courseTheme nvarchar(max)
)