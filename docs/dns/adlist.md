# AdList ADS blocker

Good official doc: <https://manual.mikrotik.com/docs/network-management/dns#adlist>  

---  

!!! danger "WARNING"  
    - Before configuring, <u>increase the DNS cache</u> as it's used to store adlist entries.   
      If limit is reached and error in DNS, error topic is printed `adlist read: max cache size reached`  
    - Adlist is stored on device's internal memory. Ensure that there is <u>enough free space</u> to save the desired adlist.  

!!! warning "not recommended for"  
    [Low-end devices](architecture.md/#low-end-devices)  

---  

## Best AdLists for Russia  
Schakal lists: <https://4pda.to/forum/index.php?showtopic=275091&st=7980#entry89665467>  

### Recommended list:  
Original link: <https://schakal.ru/hosts/alive_hosts.txt>    
Secondary Link: <https://schakal.hopto.org/alive_hosts.txt>  


Some sites have to be whitelisted, info can be found [here](https://4pda.to/forum/index.php?showtopic=275091&st=9040#entry94846826)  

---  

## Setup commands  
!!! attention "Prerequisites"   
    - MikroTik is configured as DNS resolver  
    - Recommended cache size and DoH setup instruction can be found [here](doh.md/#queries-tuning-by-model)  
```bash
# RoS 7.23
# cache size and ttl as an example
/ip dns
set cache-max-ttl=12h cache-size=32768KiB

# WhiteList
/ip dns static
add address-list=AdsWhitelist comment="Huawei Weather app" name=hw.zuimeitianqi.com type=FWD

# adList
/ip dns adlist
add ssl-verify=no url=https://schakal.hopto.org/alive_hosts.txt
```
