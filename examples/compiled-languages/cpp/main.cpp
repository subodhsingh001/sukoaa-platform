#include <iostream>
#include <numeric>
#include <string>
#include <vector>

int main() {
    std::string name;
    if (!std::getline(std::cin, name) || name.empty()) name = "Sukoaa";
    std::vector<int> squares;
    for (int i = 1; i <= 5; ++i) squares.push_back(i * i);
    std::cout << "Hello, " << name << "!\n";
    std::cout << "Sum of squares: " << std::accumulate(squares.begin(), squares.end(), 0) << "\n";
    return 0;
}
