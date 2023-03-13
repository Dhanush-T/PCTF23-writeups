from scapy.all import *
from pydub import AudioSegment

s_ip = "192.168.0.10"
d_ip = "192.168.0.20"
s_port = 12345
d_port = 80

messages = [
    b"Walt Walt, can you send me the blueprints you made for Nuclearophine? It's gonna change lives",
    b"Yeah, in a minute Jesse. I have it encrypted to keep it off prying hands.",
    b"Cool man. Send the password for the file along with it thanks",
    b"Hmmmmmm yo uknow what? try and find it..........Oh crap I sent a recording too by accident. FOr god's sake Jesse DO NOT LISTEN TO IT",
    b".......Man you getting arrested???",
    b"!!!!!!!!"
]

packets = []


# sends convo
def send_convo():
    i = 0
    chunk = 1024

    cl_seq = 100
    s_seq = 200
    cl_ack = 200
    s_ack = 100

    client = IP(dst=d_ip, src=s_ip)/TCP(sport=s_port, dport=d_port, flags='S', seq=cl_seq)
    cl_seq += 1

    server = IP(dst=s_ip, src=d_ip)/TCP(sport=d_port, dport=s_port, flags='SA', seq=s_seq, ack=cl_seq)
    s_seq+=1
    cl_ack+=1
    packets.extend([client, server])
    
    client = IP(dst=d_ip, src=s_ip)/TCP(sport=s_port, dport=d_port, flags='A', seq=cl_seq, ack=cl_ack)
    s_ack += 1
    packets.append(client)


    for i in range(0, 4, 2):
        client = IP(dst=d_ip, src=s_ip)/TCP(sport=s_port, dport=d_port, flags='PA', seq=cl_seq, ack=cl_ack)/Raw(load=messages[i])
        cl_seq = cl_seq + len(messages[i])
        s_ack += len(messages[i])
        packets.append(client)

        server = IP(dst=s_ip, src=d_ip)/TCP(sport=d_port, dport=s_port, flags='PA', seq=s_seq, ack=s_ack)/Raw(load=messages[i+1])
        cl_ack += len(messages[i+1])
        s_seq += len(messages[i+1])
        packets.append(server)

    j = 0
    with open("corrupted_hidden_sussy.wav", "rb") as f:
        zip = f.read()
        total_len = len(zip)

    while True:
        zip_chunk = zip[j:j+chunk]

        server = IP(dst=s_ip, src=d_ip)/UDP(sport=d_port, dport=s_port)/Raw(load=zip_chunk)
        packets.append(server)

        j += chunk

        if(j+chunk > total_len):
            zip_chunk = zip[j:total_len]

            server = IP(dst=s_ip, src=d_ip)/UDP(sport=d_port, dport=s_port)/Raw(load=zip_chunk)
            packets.append(server)
            break

    for i in range(4, len(messages), 2):
        client = IP(dst=d_ip, src=s_ip)/TCP(sport=s_port, dport=d_port, flags='PA', seq=cl_seq, ack=cl_ack)/Raw(load=messages[i])
        cl_seq = cl_seq + len(messages[i])
        s_ack += len(messages[i])
        packets.append(client)

        server = IP(dst=s_ip, src=d_ip)/TCP(sport=d_port, dport=s_port, flags='PA', seq=s_seq, ack=s_ack)/Raw(load=messages[i+1])
        cl_ack += len(messages[i+1])
        s_seq += len(messages[i+1])
        packets.append(server)
    
    
    with open("encrypted.zip", "rb") as f:
        zip = f.read()
        total_len = len(zip)

    j=0
    while True:
        zip_chunk = zip[j:j+chunk]

        server = IP(dst=s_ip, src=d_ip)/UDP(sport=d_port, dport=s_port)/Raw(load=zip_chunk)
        packets.append(server)

        j += chunk

        if(j+chunk > total_len):
            zip_chunk = zip[j:total_len]

            server = IP(dst=s_ip, src=d_ip)/UDP(sport=d_port, dport=s_port)/Raw(load=zip_chunk)
            packets.append(server)
            break


send_convo()
wrpcap("../solution/chall.pcap", packets)
wrpcap("../../includes/chall.pcap", packets)

