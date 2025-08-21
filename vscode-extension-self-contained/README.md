# ST-DSL using Xtext  for VS Code

This is a ST(StructuredText) DSL(Domain Specific Language) implementation showing the [Xtext](https://www.eclipse.org/Xtext/) integration for VS Code based on the Microsoft [Language Server Protocol](https://github.com/Microsoft/language-server-protocol).

The base is following simple grammar

```
VAR
  X : INT;
  Y : REAL;
  Z : BOOL;
  A : ARRAY[1..12] OF INT;
  i : INT;
END_VAR;
IF Z THEN
  X := 0;
  X := X*60;
  Y := sin(3.14156);
ELSIF X>0 THEN
  X := 10;
ELSE
  X := 10;
END_IF;
Z := TRUE;
i := 0;
WHILE i<14 DO
  A[i] := i;
  i := i+1;
END_WHILE;
X := 3;
FOR i:=0 TO 12 DO
  X := X+i;
END_FOR;
CASE i OF
  0:
  i := 1;
  1:
  i := 2;
END_CASE;
RETURN;
```

The Xtext integration supports typical Xtext and Language Server features like

* Syntax Highlighting
* Validation
* Goto Definition / Find References
* Hover
* Formatting
* Mark Occurrences
* Open Symbol

A introductory article can be found [here](https://blogs.itemis.com/en/integrating-xtext-language-support-in-visual-studio-code)
