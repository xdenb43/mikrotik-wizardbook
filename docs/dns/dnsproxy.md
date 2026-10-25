# AdGuard dnsproxy
Official doc: <https://github.com/AdguardTeam/dnsproxy/blob/master/README.md>  

---  

!!! note ""  
    Can be used via [container](https://manual.mikrotik.com/docs/containers/) only  
        
## How To Setup
Original instruction: [dnsproxy container](https://hub.docker.com/r/wiktorbgu/dnsproxy-mikrotik) by [@wiktobgu](https://hub.docker.com/u/wiktorbgu)

## Parameters for MikroTik as DNS relay
- `upstream`: upstream DNS resolver(s) 
- `fallback`: failover "last resort” DNS resolver(s)   
- `cache` not required, MikroTik's native cache used  

[:: Explanation for DoH providers selection ::](doh.md/#doh-provider-selection-considerations-for-russia) 

```bash
--listen=0.0.0.0 \
--port=53 \
--dnssec \
--pending-requests-enabled \
--http3 \
--upstream=https://dns.google/dns-query \
--upstream=https://cloudflare-dns.com/dns-query \
--fallback=https://common.dot.dns.yandex.net/dns-query
```
---  

## Optimized setup commands   
!!! warning "attention"  
    - USB drive ```/usb1``` used below for containers and layer storage  
    - follow USB / external drive [requirements](https://manual.mikrotik.com/docs/containers/#requirements)  
    - check RoS version before any action
    
```bash
# RoS 7.25
# VETH IP 192.168.254.11
# Bridge-Docker network 192.168.254.0/24 
# Bridge-Docker NOT added to LAN interface list
# NO masquarading required

/interface/bridge add name=Bridge-Docker port-cost-mode=short
/ip/address add address=192.168.254.1/24 interface=Bridge-Docker network=192.168.254.0
/interface/veth add address=192.168.254.11/24 gateway=192.168.254.1 name=DNSPROXY
/interface/bridge/port add bridge=Bridge-Docker interface=DNSPROXY

/container config 
set layer-dir=/usb1/docker/layer \
    registry-url=https://dockerhub.timeweb.cloud \
    tmpdir=/usb1/docker/pull

/container 
add cmd="--listen=0.0.0.0 --port=53 \
    --http3 --dnssec --pending-requests-enabled \
    --upstream=https://dns.google/dns-query \
    --upstream=https://cloudflare-dns.com/dns-query \
    --fallback=https://common.dot.dns.yandex.net/dns-query" \
    dns=8.8.8.8,8.8.4.4,1.0.0.1,208.67.222.222,77.88.8.8 \
    interface=DNSPROXY \
    layer-dir=/usb1/docker/layer \
    memory-high=32.0MiB memory-max=64.0MiB \
    name=dnsproxy-mikrotik \
    remote-image=wiktorbgu/dnsproxy-mikrotik \
    restart-interval=1m restart-max-count=5 restart-policy=on-failure \
    root-dir=/usb1/docker/dnsproxy-mikrotik \
    start-on-boot=yes

# MikroTik as DNS relay
/ip dns set allow-remote-requests=yes use-doh-server="" servers=192.168.254.11

# Disable peer dns
/ip dhcp-client set use-peer-dns=no numbers=0
/interface lte apn set [ find default=yes ] use-peer-dns=no  

# Fallback to Google DoH when dnsproxy down
# Add static record to reduce the risk of interception of the dns.google resolution
/ip dns static
add address=8.8.8.8 comment="Google DNS" name=dns.google type=A
add address=8.8.4.4 comment="Google DNS" name=dns.google type=A

/tool netwatch
add comment="container dnsproxy-mikrotik" disabled=no \
    dns-server=192.168.254.11 \
    host=ya.ru name=dnsproxy-mikrotik test-script="" type=dns \
    down-script="/ip/dns/set servers=8.8.8.8,8.8.4.4,1.0.0.1,208.\
    67.222.222,77.88.8.8 use-doh-server=https://dns.google/dns-query \
    verify-doh-cert=yes\n/ip/dns/cache/flush" \
    up-script="/ip/dns/set servers=192.168.254.11 use-doh-server=\"\" \
    \n/ip/dns/cache/flush"
```
!!! seealso "see also"    
    [:: Optimization for DNS and DoH parameters ::](doh.md/#doh-and-dns-tuning)   

---

## Additional: dnsproxy as direct LAN DNS resolver  
!!! info "" 
    case for dnsproxy is announced via DHCP server  

```bash
/ip/dhcp-server/network/set dns-server=192.168.254.11
/ip dns set allow-remote-requests=no
```
Recommended values
```bash
--listen=0.0.0.0 \
--port=53 \
--cache \
--cache-size=33554432 \
--cache-max-ttl=43200 \
--cache-optimistic \
--optimistic-max-age=12h \
--optimistic-answer-ttl=30s \
--dnssec \
--http3 \
--pending-requests-enabled \
--upstream=https://dns.google/dns-query \
--upstream=https://cloudflare-dns.com/dns-query \
--fallback=https://common.dot.dns.yandex.net/dns-query
```  
---  

## Discussion  
Chat: <https://t.me/it_network_people>  

---    