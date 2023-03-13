# Writeup

We are given a binary to pwn.

```
$ checksec solve
[*] '/pctf23/chall1/solve'
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
```
Executing the binary we are asked to guess four numbers in a row
```
$ ./solve 
Welcome to the game
Guess four numbers in a row to pass to next level
Enter your guess: 
```
Disassembling the main ```

Write a few words about the game ||||||||||

So now give me two of your lucky numbers and both must be less than 1000: 

-12 -211

You're a good story teller. Here's the flag.

p_ctf{s@y_t|k|28|8|d|g_st0ry}

```
```
gef➤  disassemble main
Dump of assembler code for function main:
      0x0000000000001657 <+0>:     endbr64 
   0x000000000000165b <+4>:     push   rbp
   0x000000000000165c <+5>:     mov    rbp,rsp
   0x000000000000165f <+8>:     sub    rsp,0x20
   0x0000000000001663 <+12>:    mov    DWORD PTR [rbp-0x14],edi
   0x0000000000001666 <+15>:    mov    QWORD PTR [rbp-0x20],rsi
   0x000000000000166a <+19>:    mov    rax,QWORD PTR [rip+0x29af]        # 0x4020 <stdout@GLIBC_2.2.5>
   0x0000000000001671 <+26>:    mov    ecx,0x0
   0x0000000000001676 <+31>:    mov    edx,0x2
   0x000000000000167b <+36>:    mov    esi,0x0
   0x0000000000001680 <+41>:    mov    rdi,rax
   0x0000000000001683 <+44>:    call   0x1190 <setvbuf@plt>
   0x0000000000001688 <+49>:    call   0x1180 <getegid@plt>
   0x000000000000168d <+54>:    mov    DWORD PTR [rbp-0x4],eax
   0x0000000000001690 <+57>:    mov    edx,DWORD PTR [rbp-0x4]
   0x0000000000001693 <+60>:    mov    ecx,DWORD PTR [rbp-0x4]
   0x0000000000001696 <+63>:    mov    eax,DWORD PTR [rbp-0x4]
   0x0000000000001699 <+66>:    mov    esi,ecx
   0x000000000000169b <+68>:    mov    edi,eax
   0x000000000000169d <+70>:    mov    eax,0x0
   0x00000000000016a2 <+75>:    call   0x1130 <setresgid@plt>
   0x00000000000016a7 <+80>:    mov    edi,0x0
   0x00000000000016ac <+85>:    call   0x1170 <time@plt>
   0x00000000000016b1 <+90>:    mov    rcx,rax
   0x00000000000016b4 <+93>:    movabs rdx,0x2aaaaaaaaaaaaaab
   0x00000000000016be <+103>:   mov    rax,rcx
   0x00000000000016c1 <+106>:   imul   rdx
   0x00000000000016c4 <+109>:   sar    rcx,0x3f
   0x00000000000016c8 <+113>:   mov    rax,rdx
   0x00000000000016cb <+116>:   sub    rax,rcx
   0x00000000000016ce <+119>:   mov    edi,eax
   0x00000000000016d0 <+121>:   call   0x1150 <srand@plt>
   0x00000000000016d5 <+126>:   lea    rax,[rip+0xa6d]        # 0x2149
   0x00000000000016dc <+133>:   mov    rdi,rax
   0x00000000000016df <+136>:   call   0x1110 <puts@plt>
   0x00000000000016e4 <+141>:   lea    rax,[rip+0xa75]        # 0x2160
   0x00000000000016eb <+148>:   mov    rdi,rax
   0x00000000000016ee <+151>:   call   0x1110 <puts@plt>
   0x00000000000016f3 <+156>:   mov    eax,0x0
   0x00000000000016f8 <+161>:   call   0x1312 <random_check>
   0x00000000000016fd <+166>:   test   eax,eax
   0x00000000000016ff <+168>:   je     0x170b <main+180>
   0x0000000000001701 <+170>:   mov    eax,0x0
   0x0000000000001706 <+175>:   call   0x1587 <vuln>
   0x000000000000170b <+180>:   mov    eax,0x0
   0x0000000000001710 <+185>:   leave  
   0x0000000000001711 <+186>:   ret    
End of assembler dump.
```
We see that the srand function gets time(0)/6 as the parameter

```
undefined8 main(void)

{
  __gid_t __rgid;
  int iVar1;
  time_t tVar2;
  
  setvbuf(stdout,(char *)0x0,2,0);
  __rgid = getegid();
  setresgid(__rgid,__rgid,__rgid);
  tVar2 = time((time_t *)0x0);
  srand((uint)(tVar2 / 3));
  puts("Welocome to the game");
  puts("Guess four numbers in a row to pass to next level");
  iVar1 = random_check();
  if (iVar1 != 0) {
    vuln();
  }
  return 0;
}
```
The random function in c gives the same sequence of random numbers with a constant seeder. So the seed here is the (current_time)/6
we write a small c program to find the sequence
```
#include<stdio.h>

int main(){
    srand(time(0)/3);
    printf("Randomly generated numbers are: \n");
    for (int i = 0; i < 5; i++)
        printf(" %d\n", rand() % 1000);
}
```
Using the script, we get the random numbers
```
Randomly generated numbers are: 
 178
 164
 78
 239
 823
 ```
 ```
 Welcome to the game
Guess four numbers in a row to pass to next level
Enter your guess: 178
[1/4] Your guess was right.
Enter your guess: 164
[2/4] Your guess was right.
Enter your guess: 78
[3/4] Your guess was right.
Enter your guess: 239
[4/4] Your guess was right.

Write a few words about the game: 
```
We can see that there are two story functions one is hard, and the other is easy.

```
gef➤  info functions
All defined functions:

Non-debugging symbols:
...
0x00000000000012c9  calculate_desc
0x0000000000001312  random_check
0x00000000000013e1  easy_set_winner
0x00000000000014b4  hard_set_winner
0x0000000000001587  vuln
0x0000000000001657  main
...
```

Checking all the variables
```
gef➤  info variables
All defined variables:

Non-debugging symbols:
...
0x0000000000004010 check
...
0x0000000000004040 fun
```

```
gef➤  p easy_set_winner 
$1 = {<text variable, no debug info>} 0x13e1 <easy_set_winner>
gef➤  p hard_set_winner 
$2 = {<text variable, no debug info>} 0x14b4 <hard_set_winner>
gef➤  x 0x0000000000004040
0x4260 <check>:	0x000014b4
```
We can see that check points to the hard_set_winner which we need to change to easy_set_winner

Calculating the difference between them we get 0x14b4-0x13e1 = 211

Also calculating the difference between check and fun :

0x4040 - 0x4010 = 48

as we know that fun stores integer each index is of four.
So we divide 48/(size of int) = 12

To reach the check variable from fun variable we need to subtract -12 from the fun variable. 
And then ,
So in order to change the check function to point to easy_set_winner we need to subtract -211 from hard_set_function.

Examining the easy_set_winner function in ghidra
```

void easy_set_winner(undefined8 param_1,undefined8 param_2)

{
  int iVar1;
  FILE *__stream;
  long in_FS_OFFSET;
  undefined8 local_58;
  undefined8 local_50;
  undefined8 local_48;
  undefined8 local_40;
  undefined8 local_38;
  undefined8 local_30;
  undefined8 local_28;
  undefined8 local_20;
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  iVar1 = calculate_desc(param_1,param_2);
  if (iVar1 == 0x4d8) {
    local_58 = 0;
    local_50 = 0;
    local_48 = 0;
    local_40 = 0;
    local_38 = 0;
    local_30 = 0;
    local_28 = 0;
    local_20 = 0;
    __stream = fopen("flag.txt","r");
    fgets((char *)&local_58,0x40,__stream);
    puts("You\'re a good story teller. Here\'s the flag.");
    puts((char *)&local_58);
  }
  else {
    printf("Youe story was not good.");
  }
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return;
}
```
We can see that it checks if the value of ascii character we entered in the story is equal to 0x4d8(1240) 
so from the ascii table, we get | has ascii value of 124, so we enter the story as ||||||||||||(10 times |)

```
Write a few words about the game ||||||||||
So now give me two of your lucky numbers and both must be less than 1000: 
-12 -211
You're a good story teller. Here's the flag.
p_ctf{s@y_t|k|28|8|d|g_st0ry}
```