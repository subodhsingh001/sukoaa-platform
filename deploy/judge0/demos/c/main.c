#include <stdio.h>
#include <string.h>

int main(void) {
    char name[100];
    if (!fgets(name, sizeof name, stdin)) strcpy(name, "Sukoaa");
    name[strcspn(name, "\r\n")] = 0;
    printf("Hello, %s!\n", name);
    int total = 0;
    for (int i = 1; i <= 5; i++) total += i * i;
    printf("Sum of squares: %d\n", total);
    return 0;
}
