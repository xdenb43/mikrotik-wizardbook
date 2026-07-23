# L2TP/IPsec Client

Good official doc: <https://manual.mikrotik.com/docs/virtual-private-networks/>  

---  
 
## Get connection data  

Example:
```text
L2TP over IPsec (IKEv1)

IPsec (IKE SA / Phase 1) - profile
    IKE version: IKEv1
    Authentication: Pre-Shared Key ($PSK)
    Encryption: AES-128-CBC
    Integrity: HMAC-SHA1-96
    PRF: HMAC-SHA1
    DH Group: MODP 1024
    DPD: enabled (30s)
    NAT-T: enabled (UDP 4500)

IPsec CHILD SA (Phase 2) - proposal
    Protocol: ESP in UDP encapsulation (L2TP/IPsec transport mode)
    Encryption: AES-128-CBC
    Integrity: HMAC-SHA1-96
    PFS: OFF
    Mode: TRANSPORT (not tunnel)  
    
L2TP over IPsec
    L2TP version: v2
    Port: UDP 1701 (tunneled inside IPsec)
PPP authentication (after IPsec)
    Username: $USERNAME
    Password: $PASSWORD
    Auth methods allowed:
        - MSCHAPv2 (preferred)

IP assignment
    Local IP: $LOCAL_IP
    Remote VPN server: $REMOTE_IP
    IPCP: address + DNS routes enabled
    Default route: user-choice
```
---

## Setup commands  

```bash
# IPsec phase 1
/ip ipsec profile
set [ find default=yes ] dh-group=modp1024 dpd-interval=30s dpd-maximum-failures=5 \
    enc-algorithm=aes-128 hash-algorithm=sha1 lifetime=1d name=default \
    nat-traversal=yes ppk=no proposal-check=obey

# IPsec phase 2
/ip ipsec proposal
set [ find default=yes ] auth-algorithms=sha1 disabled=no enc-algorithms=aes-128-cbc \
    lifetime=30m name=default pfs-group=none

# L2TP itself
/interface l2tp-client
add add-default-route=no allow=mschap2 allow-fast-path=no connect-to=$REMOTE_IP \
    dial-on-demand=no disabled=no ipsec-secret=$PSK keepalive-timeout=60 \
    l2tp-proto-version=l2tpv2 l2tpv3-digest-hash=md5 max-mru=1380 max-mtu=1380 \
    mrru=disabled name=$CONNECTION_NAME password=$PASSWORD \
    profile=default random-source-port=no use-ipsec=yes use-peer-dns=no user=$USERNAME

/interface list
add name="L2TP OUT"
/interface list member
add interface=$CONNECTION_NAME list="L2TP OUT"  

# Masquerade
add action=masquerade chain=srcnat comment="Masquerade L2TP " \
    out-interface-list="L2TP OUT"

/interface l2tp-client disable $CONNECTION_NAME
/interface l2tp-client enable $CONNECTION_NAME
```