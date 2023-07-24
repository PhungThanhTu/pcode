// program named mainreturn.cpp
#include <iostream>
#include<string>
#include <fstream>
#include <algorithm>

using namespace std;
const std::string WHITESPACE = " \n\r\t\f\v";
 
std::string ltrim(const std::string &s)
{
    size_t start = s.find_first_not_of(WHITESPACE);
    return (start == std::string::npos) ? "" : s.substr(start);
}
 
std::string rtrim(const std::string &s)
{
    size_t end = s.find_last_not_of(WHITESPACE);
    return (end == std::string::npos) ? "" : s.substr(0, end + 1);
}
 
std::string trim(const std::string &s) {
    return rtrim(ltrim(s));
}

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

    if(trim(expected) == trim(actual))
    {
        cout << "Success";
        return 0;
    }
    cerr << "Expected :" << expected << "Actual :" << actual;
    return 1;
}