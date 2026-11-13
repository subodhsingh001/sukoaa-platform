SUKOAA COMPILED-LANGUAGE DEMOS

All five starters use only their language standard library.
Standard input: Sukoaa
Expected output for every program:
Hello, Sukoaa!
Sum of squares: 55

C: stdio.h and string.h; compiled with GCC C11.
C++: iostream, numeric, string and vector; compiled with G++ C++17.
Rust: std::io, Vec and iterator operations; compiled with rustc.
C#: System and System.Linq; compiled with the .NET SDK.
Java: java.util.Scanner and java.util.stream.IntStream; compiled with
Eclipse JDT ECJ at Java 8 syntax level and run with the installed JVM.

Each starter compiled and produced the expected output in local QA. Each
also rejected an intentional undefined-symbol error with a source location.
These checks do not prove that a specific Judge0 compiler/version or your
production runner has been configured. No third-party package install,
NuGet/Maven/Cargo dependency resolution, custom headers or multi-file builds
are provided in the website's single-file runner.
