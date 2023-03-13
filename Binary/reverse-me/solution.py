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