insert into [dbo].[Submission]
(id, exerciseId, score, averageTime, averageMemory, timeCreated)
VALUES
('40a50118-e207-4672-9a44-7bf0aa51be76','c7f5f23d-ebdf-4262-b050-97aa5590aa03',0,0,0,'2023-02-20 15:00:00'),
('137bc48a-fa98-4167-abc4-889f61a2e2db','c7f5f23d-ebdf-4262-b050-97aa5590aa03',0,0,0,'2023-02-20 15:00:00'),
('9f4d8da1-a41a-406e-a7c4-64e4e67f1696','c7f5f23d-ebdf-4262-b050-97aa5590aa03',0,0,0,'2023-02-20 15:00:00')


    -- insert Submission Source code
insert into [dbo].[SubmissionSourceCode]
(submissionId,programmingLanguageId,sourceCode)
VALUES
('40a50118-e207-4672-9a44-7bf0aa51be76',2,N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
   return a + b;
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}'),
('137bc48a-fa98-4167-abc4-889f61a2e2db',2,N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
   return a - b;
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}'),
('9f4d8da1-a41a-406e-a7c4-64e4e67f1696',2,N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
  while(true){}
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}')
