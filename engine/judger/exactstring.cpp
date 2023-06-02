// program named mainreturn.cpp
#include <iostream>
#include<string>
#include <fstream>

using namespace std;
 
//    defining main with arguments
int main(int argc, char** argv)
{
    
    string expectedFileName = argv[1];
    string actualFileName = argv[2];
    
    ifstream file(expectedFileName);
    string expected;

    if(file.is_open())
    {
        string line;
        while(getline(file, line)){
            expected += line + '\n';
        }
        file.close();
    }
    else
    {
        cerr << "Unable to open file" << expectedFileName << std::endl;
    }

    ifstream afile(actualFileName);
    string actual;
    if(afile.is_open())
    {
        string line;
        while(getline(afile, line)){
            actual += line + '\n';
        }
        afile.close();
    }
    else
    {
        cerr << "Unable to open file" << actualFileName << std::endl;
    }

    cout << "expected :" << expected << "actual :" << actual;

    if(expected == actual)
    {
        return 0;
    }
    cerr << "Expected :" << expected << "Actual :" << actual;
    return 1;
}