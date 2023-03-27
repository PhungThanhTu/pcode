insert into [dbo].[Exercise]
(id,runtimeLimit,memoryLimit,scoreWeight,timeCreated)
values
('c7f5f23d-ebdf-4262-b050-97aa5590aa03',2000,10000,1,'2023-02-20 15:00:00')

insert into [dbo].[SampleSourceCode]
(exerciseId,programmingLanguageId,sourceCode)
values
('c7f5f23d-ebdf-4262-b050-97aa5590aa03',2,N'#include<iostream>

int SumOfTwoIntergers(int a, int b) {
   // Write your solution here
}

int main(){
    int a,b;
    std::cin >> a >> b;
    std::cout << SumOfTwoIntergers(a,b);
    return 0;
}')

