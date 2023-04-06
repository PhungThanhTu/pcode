create table DocumentCourse (
    CourseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Course](id),
    DocumentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Document](id),
    IsPublic bit,
    CONSTRAINT PK_DocumentCourse PRIMARY KEY (CourseId, DocumentId)  
)