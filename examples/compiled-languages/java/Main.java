import java.util.Scanner;
import java.util.stream.IntStream;

public class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            String name = input.hasNextLine() ? input.nextLine() : "Sukoaa";
            if (name.trim().isEmpty()) name = "Sukoaa";
            int total = IntStream.rangeClosed(1, 5).map(n -> n * n).sum();
            System.out.println("Hello, " + name + "!");
            System.out.println("Sum of squares: " + total);
        }
    }
}
