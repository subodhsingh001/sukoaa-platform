package main

import ("bufio"; "fmt"; "os"; "strings")

func main() {
 name, _ := bufio.NewReader(os.Stdin).ReadString('\n')
 name = strings.TrimSpace(name)
 if name == "" { name = "Sukoaa" }
 total := 0
 for i := 1; i <= 5; i++ { total += i * i }
 fmt.Printf("Hello, %s!\nSum of squares: %d\n", name, total)
}
