VAR
	X:INT;
	Y:REAL;
	Z:BOOL;
	A:ARRAY[1..12] OF INT;
	i:INT;
END_VAR;
IF Z THEN
	X:=0;
	X:=X*60;
	Y:=sin(3.14156);
ELSIF X>0 THEN 
	X:=10;
ELSE
   X:=10;		
END_IF;
	Z:=TRUE;
	i:=0;
WHILE i<14 DO
	A[i]:=i;
	i:=i+1;
END_WHILE;
	X:=3;
FOR i:=0 TO 12 DO
    X:=X+i;
END_FOR;
CASE i OF
0:i:=1;
1:i:=2;
END_CASE;
// test value from another file
iii:=3;
RETURN;