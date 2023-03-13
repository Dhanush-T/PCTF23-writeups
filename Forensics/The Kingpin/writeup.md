## THE KINGPIN - WRITEUP

We are given capture.pcap, a packet capture file. On opening it with wireshark and examining it, we notice USB traffic and nothing that stands out except for 2 packets of a much larger size (>50000 bytes).

Exporting their data with:
```python
from scapy.all import *

packets = rdpcap("chall.pcapng")
p1 = packets[500]
p2 = packets[542]

with open("file1", "wb") as f:
    f.write(bytes(p1.load))
with open("file2", "wb") as f:
    f.write(p2.load)
```

Exporting the 2 packets bytes and running file on them reveals they are zip archives.

We now have 2 zip files - f1.zip and f2.zip with folders 01-10 each with 10 images.

In all odd numbered folders, we have A-T.png (25 x 500 px) and in all even numbered folders, we have 01-20.png (500 x 25 px).

Our objective is to combine each set of A-T.png sequentially from top to bottom and each set of 01-20.png from left to right sequentially:

```bash
declare -i flag=1

for LayerNo in {01..10}
do
    mkdir -p Solved/
    if [[ $flag -eq 1 ]];
    then
        convert -append ${LayerNo}/{A..T}.png Solved/Layer${LayerNo}.png
    else
        convert +append ${LayerNo}/{01..20}.png Solved/Layer${LayerNo}.png
    fi

    flag=${flag}*-1
done
```
On opening each of the 10 folders, we see a 500x500 image of mostly red with some white squares with hints of black text on them.

The objective is to superimpose all 10 images as layers on top of one another and make all the red parts transparent. This can be achieved with GIMP.

Import all 10 images as layers into GIMP. For each layer colors > "Color to alpha" > "select color from image" and select the red from the image. 

Finally the flag will be visible: p_ctf{TH3_D3V1L_0F_H3LL5_K1TCH3N_15_B4CK}
