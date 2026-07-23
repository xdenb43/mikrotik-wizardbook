# AdGuard dnsproxy
Official doc: <https://github.com/AdguardTeam/dnsproxy/blob/master/README.md> 

---  

!!! note ""  
    Can be used via **container** only  
    
## How To Setup
Instruction: [dnsproxy container](https://hub.docker.com/r/wiktorbgu/dnsproxy-mikrotik) by [@wiktobgu](https://hub.docker.com/u/wiktorbgu)

## Parameters for MikroTik as DNS relay
- `upstream`: upstream DNS resolver(s) 
- `fallback`: failover "last resort” DNS resolver(s)   
- `cache` not required, mikrotik's native cache used  

Explanation for DoH providers selection is available [here](doh.md/#doh-provider-selection-considerations-for-russia) 

```bash
--listen=0.0.0.0 \
--port=53 \
--dnssec \
--pending-requests-enabled \
--timeout=5s \
--http3 \
--upstream=https://dns.google/dns-query \
--upstream=https://cloudflare-dns.com/dns-query \
--fallback=https://common.dot.dns.yandex.net/dns-query
```
---  

## Setup commands   
!!! attention ""  
    USB drive used for containers storage  
    Optimization for other DNS parameters well-described [here](doh.md/#doh-and-dns-tuning)

```bash
# RoS 7.23
# VETH IP 192.168.254.11
# Bridge-Docker network 192.168.254.0/24 
# Bridge-Docker NOT added to LAN interface list
# NO masquarading required

/interface/bridge add name=Bridge-Docker port-cost-mode=short
/ip/address add address=192.168.254.1/24 interface=Bridge-Docker network=192.168.254.0
/interface/veth add address=192.168.254.11/24 gateway=192.168.254.1 name=DNSPROXY
/interface/bridge/port add bridge=Bridge-Docker interface=DNSPROXY

/container config registry-url=https://dockerhub.timeweb.cloud

/container
add cmd="--listen=0.0.0.0 --port=53 \
    --dnssec --pending-requests-enabled --timeout=5s --http3 \
    --upstream=https://dns.google/dns-query \
    --upstream=https://cloudflare-dns.com/dns-query \
    --fallback=https://common.dot.dns.yandex.net/dns-query" \
    dns=8.8.8.8,8.8.4.4,1.1.1.1,1.0.0.1,77.88.8.8,77.88.8.1 \
    interface=DNSPROXY \
    layer-dir="" \
    memory-high=32.0MiB memory-max=64.0MiB \
    name=dnsproxy-mikrotik remote-image=wiktorbgu/dnsproxy-mikrotik \
    restart-interval=1m restart-max-count=5 restart-policy=on-failure \
    root-dir=/usb1/docker/dnsproxy-mikrotik start-on-boot=yes \
    workdir=/

/ip dns set allow-remote-requests=yes use-doh-server="" servers=192.168.254.11
```
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
--timeout=5s \
--http3 \
--upstream=https://dns.google/dns-query \
--upstream=https://cloudflare-dns.com/dns-query \
--fallback=https://common.dot.dns.yandex.net/dns-query
```  