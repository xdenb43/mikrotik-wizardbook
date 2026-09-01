# Filter
Official documentation: <https://manual.mikrotik.com/docs/firewall-and-quality-of-service/firewall/filter>

!!! note ""
    There are two methods to set up filtering:  
        - Allow specific traffic and drop everything else.  
        - Drop only malicious traffic, everything else is allowed.
---  

## IPv4 minimal rules  

### defconf:  
```bash
/ip firewall filter  
add chain=input action=accept connection-state=established,related,untracked comment="defconf: accept established,related,untracked"               
add chain=input action=drop connection-state=invalid comment="defconf: drop invalid"                                                               
add chain=input action=accept protocol=icmp comment="defconf: accept ICMP"                                                                         
add chain=input action=accept src-address=127.0.0.1 dst-address=127.0.0.1 in-interface=lo comment="defconf: accept to local loopback (for CAPsMAN)"
add chain=input action=drop in-interface-list=!LAN comment="defconf: drop all not coming from LAN"                                                 

add chain=forward action=accept ipsec-policy=in,ipsec comment="defconf: accept in ipsec policy"                                                    
add chain=forward action=accept ipsec-policy=out,ipsec comment="defconf: accept out ipsec policy"
                                                  
add chain=forward action=fasttrack-connection connection-state=established,related comment="defconf: fasttrack"                                    
add chain=forward action=accept connection-state=established,related,untracked comment="defconf: accept established,related, untracked"            
add chain=forward action=drop connection-state=invalid comment="defconf: drop invalid"                                                             
add chain=forward action=drop connection-nat-state=!dstnat in-interface-list=WAN comment="defconf: drop all from WAN not DSTNATed"                 
```   
---  

### customized:  

Source: <https://www.youtube.com/watch?v=lFvGdRUqeMQ>

!!! attention "attention"   
    - Interface lists **must** be configured **smartly**   
    - IPSEC, CAPsMAN and other specific things skipped in minimal rules list   
    

```bash
/ip firewall address-list
add address=192.168.88.0/24 comment="default LAN" list=Allowed-LAN
add address=192.168.216.0/24 comment="Back-to-Home" list=Allowed-LAN
add address=$TRUSTED_NET_IPv4 comment="$TRUSTED_NET" list=Allowed-LAN

/ip firewall filter
add chain=input action=accept connection-state=established,related,untracked comment="accept established,related,untracked" 
add chain=input action=drop connection-state=invalid in-interface-list=WAN comment="drop invalid" 
add chain=input action=accept src-address-list=Allowed-LAN comment="accept trusted management sources" 
add chain=input action=drop in-interface-list=WAN comment="drop all traffic from WAN" 
add chain=input action=drop comment="drop everything else"

add chain=forward action=fasttrack-connection connection-mark=no-mark connection-state=established,related in-interface-list=LAN out-interface-list=WAN  comment="bi-directional fasttrack" 
add chain=forward action=accept connection-state=established,related,untracked comment="accept established,related, untracked" 
add chain=forward action=drop connection-state=invalid in-interface-list=WAN comment="drop invalid" 
add chain=forward action=drop connection-nat-state=!dstnat in-interface-list=WAN comment="drop all from WAN not DSTNATed" 
```
!!! seealso "See also"  
    [FastTrack in RouterOS](fasttrack.md)   
    
---  


