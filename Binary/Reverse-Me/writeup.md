# Writeup

We are given a binary to pwn.

```
$ checksec reverse-me
[*] '/pctf23/chall2/reverse-me'
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
```
Executing the binary we are asked to enter the flag
```
$ ./reverse-me 
Enter the flag:AAAAAAAAAA
Incorrect flag
```
Disassembling the main in ghidra
```

undefined8 main(void)

{
  int iVar1;
  long in_FS_OFFSET;
  undefined local_38 [16];
  undefined local_28 [24];
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  printf("Enter the flag:");
  __isoc99_scanf(&DAT_00102014,local_28);
  genMatrix(local_38,local_28);
  iVar1 = flagCheck(local_38);
  if (iVar1 == 0) {
    puts("Incorrect flag");
  }
  else {
    puts("You entered the right flag");
  }
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return 0;
}
```
 so we could see that it takes a string as input and check if it is a flag by first creating a matrix
 
 Disassembling the genMatrix in ghidra
 
``` 
void genMatrix(long param_1,long param_2)

{
  int iVar1;
  int local_c;
  
  for (local_c = 0; local_c < 0x20; local_c = local_c + 1) {
    iVar1 = local_c;
    if (local_c < 0) {
      iVar1 = local_c + 3;
    }
    *(undefined *)((long)(iVar1 >> 2) * 4 + param_1 + (long)(local_c % 4)) =
         *(undefined *)(local_c + param_2);
  }
  return;
}
```

We can see that a flag size of 16 is taken in and converteed into a matrix of 4 x 4 .

 Disassembling the flagCheck in ghidra
 
 ```

undefined8 flagCheck(char *param_1)

{
  undefined8 uVar1;
  
  if (((((int)param_1[3] + (int)*param_1 + (int)param_1[1] + (int)param_1[2] == 0x1a6) &&
       ((int)param_1[7] + (int)param_1[4] + (int)param_1[5] + (int)param_1[6] == 0x1c2)) &&
      ((int)param_1[0xb] + (int)param_1[8] + (int)param_1[9] + (int)param_1[10] == 0x1ca)) &&
     ((int)param_1[0xf] + (int)param_1[0xc] + (int)param_1[0xd] + (int)param_1[0xe] == 0x1b1)) {
    if ((((int)param_1[0xc] + (int)*param_1 + (int)param_1[4] + (int)param_1[8] == 0x1b1) &&
        ((int)param_1[0xd] + (int)param_1[1] + (int)param_1[5] + (int)param_1[9] == 0x1b5)) &&
       (((int)param_1[0xe] + (int)param_1[2] + (int)param_1[6] + (int)param_1[10] == 0x1b0 &&
        ((int)param_1[0xf] + (int)param_1[3] + (int)param_1[7] + (int)param_1[0xb] == 0x1cd)))) {
      if ((int)param_1[0xc] - (int)param_1[8] == 1) {
        if ((int)param_1[9] + (int)param_1[0xd] == 0xdb) {
          if ((int)param_1[0xe] == (uint)(param_1[10] == '\x12')) {
            uVar1 = 0;
          }
          else if ((int)param_1[8] == (uint)(param_1[9] == '\x17')) {
            uVar1 = 0;
          }
          else if ((int)param_1[8] == (uint)(param_1[0xf] == '\x10')) {
            uVar1 = 0;
          }
          else {
            uVar1 = 1;
          }
        }
        else {
          uVar1 = 0;
        }
      }
      else {
        uVar1 = 0;
      }
    }
```
So there are few conditions that are being checked to confirm that if the entered string is a correct flag.

Writing the pseudo code for flagCheck

```
    int r0 = mat[0][0]+mat[0][1]+mat[0][2]+mat[0][3];
    int r1 = mat[1][0]+mat[1][1]+mat[1][2]+mat[1][3];
    int r2 = mat[2][0]+mat[2][1]+mat[2][2]+mat[2][3];
    int r3 = mat[3][0]+mat[3][1]+mat[3][2]+mat[3][3];




    int c0 = mat[0][0]+mat[1][0]+mat[2][0]+mat[3][0];
    int c1 = mat[0][1]+mat[1][1]+mat[2][1]+mat[3][1];
    int c2 = mat[0][2]+mat[1][2]+mat[2][2]+mat[3][2];
    int c3 = mat[0][3]+mat[1][3]+mat[2][3]+mat[3][3];


    if(!(r0==422 && r1==450 && r2==458 && r3==433)){
        return 0;
    }

    if(!(c0==433 && c1==437 && c2==432 && c3==461)){
        return 0;
    }

    if(!(mat[3][0]-mat[2][0]==1)){
        return 0;
    }
    if(!(mat[3][1]+mat[2][1]==219)){
        return 0;
    }

    if(!(mat[3][2]^mat[2][2]==18)){
        return 0;
    }
    if(!(mat[2][0]^mat[2][1]==23)){
        return 0;
    }
    if(!(mat[2][0]^mat[3][3]==16)){
        return 0;
    }


    return 1;
```

Solving these set of equations with z3 module of pyhton

```
#!/usr/bin/env python3
from z3 import *

s = Solver()
flag = [BitVec('flag_%d' % i, 8) for i in range(16)]

mat = [[BitVec('x_%d_%d' % (i,j), 8) for j in range(4)] for i in range(4)]



s.add(mat[0][0]+mat[0][1]+mat[0][2]+mat[0][3] == 422)
s.add(mat[1][0]+mat[1][1]+mat[1][2]+mat[1][3] == 450)
s.add(mat[2][0]+mat[2][1]+mat[2][2]+mat[2][3] == 458)
s.add(mat[3][0]+mat[3][1]+mat[3][2]+mat[3][3] == 433)

s.add(mat[0][0]+mat[1][0]+mat[2][0]+mat[3][0] == 433)
s.add(mat[0][1]+mat[1][1]+mat[2][1]+mat[3][1] == 437)
s.add(mat[0][2]+mat[1][2]+mat[2][2]+mat[3][2] == 432)
s.add(mat[0][3]+mat[1][3]+mat[2][3]+mat[3][3] == 461)


s.add(mat[0][0]==112)
s.add(mat[3][3]==125)
s.add(mat[3][0] - mat[2][0]==1)
s.add(mat[3][1] + mat[2][1]==219)
s.add(mat[3][2] ^ mat[2][2]==18)
s.add(mat[2][0] ^ mat[2][1]==23)
s.add(mat[2][0] ^ mat[3][3]==16)


s.add(mat[0][1]==95)
s.add(mat[0][2]==99)
s.add(mat[0][3]==116)
s.add(mat[1][0]==102)

s.add(mat[1][1]==123)

for i in range(4):
    for j in range(4):
        s.add(mat[i][j] >= 32)
        s.add(mat[i][j] <= 126)

while z3.sat == s.check():
    m = s.model()
    r = [ [ m.evaluate(mat[i][j]) for j in range(4) ] 
          for i in range(4) ]
    l=""
    for i in range(4):
        for j in range(4):
            l+=chr(int(repr(r[i][j])))
    print(l)
    block = []
    for i in range(4):
        for j in range(4):
            block.append( mat[i][j] != r[i][j])
    s.add(Or(block))
```
Executing the above python program to get the flag

```
$ python3 solution.py 
p_ctf{qpmzwlnae}
```
Thus got the flag

```
$ ./reverse-me 
Enter the flag:p_ctf{qpmzwlnae}
You entered the right flag
```

 