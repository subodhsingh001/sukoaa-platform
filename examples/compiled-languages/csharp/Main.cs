using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        string name = Console.ReadLine();
        if (String.IsNullOrWhiteSpace(name)) name = "Sukoaa";
        int total = Enumerable.Range(1, 5).Select(n => n * n).Sum();
        Console.WriteLine("Hello, " + name + "!");
        Console.WriteLine("Sum of squares: " + total);
    }
}
