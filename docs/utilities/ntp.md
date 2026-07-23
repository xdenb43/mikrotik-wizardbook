# NTP: Server, Client and Failover
Official documentation: <https://manual.mikrotik.com/docs/system-information-and-utilities/ntp>

---  

## NTP Client specific 
NTP server name resolution uses DNS FWD mechanism with IPv4 DNS resolvers.  
Better not to use DoH resolvers due to risk of broken resolution. See DoH mechanism [here](../dns/doh.md)  
> FQDN ("Resolved Address" will appear in the "Servers"- window in an appropriate column if the address is resolved) or IP address can be used.   
> If DHCP-Client property use-peer-ntp=yes - the dynamic entries advertised by DHCP to set the NTP server using its FQDN.  
> The domain name will be resolved each time an NTP request is sent. Router has to have /ip/dns configured.  

NTP servers used (really excessive quantity):  
- [ru.pool.ntp.org](https://www.ntppool.org/zone/ru)  
- [MSK-IX NTP Server](https://www.msk-ix.ru/ntp-server/)  
- [ФГУП «ВНИИФТРИ» Москва](https://www.vniiftri.ru/catalog/services/sinkhronizatsiya-vremeni-cherez-ntp-servera/)  

---   

## Best strategy   
- disable `broadcast` & `multicast`  
    - useless network junk for modern devices  
    - decrease WiFi performace (uses lowest rates)  
    - additional CPU load
- disable `manycast`  
    - only for enterprise networks with several NTP Servers  
    - useless for standaone Router  
- use `unicast`        

---  

## Setup commands
```bash
# ROS 7.23
# defconf network 192.168.88.1/24

/ip dhcp-client 
set use-peer-ntp=no numbers=0 

/ip dhcp-server network
set ntp-server=192.168.88.1 numbers=0 

# doh as example. Set yours
/ip dns
set allow-remote-requests=yes servers=8.8.8.8,1.1.1.1 use-doh-server=https://dns.google/dns-query verify-doh-cert=yes

/ip dns forwarders
add dns-servers=1.1.1.1,78.88.8.8,8.8.8.8 name="round-robin IPv4"

/ip dns static
add comment="NTP over static ipv4 DNS" disabled=no forward-to="round-robin IPv4" match-subdomain=yes name=pool.ntp.org ttl=1d type=FWD
add comment="NTP over static ipv4 DNS" disabled=no forward-to="round-robin IPv4" match-subdomain=yes name=ntp.msk-ix.ru ttl=1d type=FWD
add comment="NTP over static ipv4 DNS" disabled=no forward-to="round-robin IPv4" match-subdomain=yes name=vniiftri.ru ttl=1d type=FWD
    
/ip firewall nat
add action=redirect chain=dstnat comment="Incoming NTP redirect" dst-address-type=!local dst-port=123 in-interface-list=LAN protocol=udp
    
/system clock
set time-zone-autodetect=no time-zone-name=Europe/Moscow

/system ntp client
set enabled=yes
/system ntp client servers
add address=0.ru.pool.ntp.org
add address=1.ru.pool.ntp.org
add address=ntp.msk-ix.ru
add address=ntp1.vniiftri.ru
add address=ntp2.vniiftri.ru

# broadcast=no multicast=no manycast=no
/system ntp server
set enabled=yes broadcast=no multicast=no manycast=no

# security - drop NTP requests from WAN
# place after defconf: drop invalid
/ip firewall filter 
add action=drop chain=input comment="drop WAN NTP requests" dst-port=123 in-interface-list=WAN protocol=udp
```
