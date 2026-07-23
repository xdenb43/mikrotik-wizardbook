# DoH resolvers<br> minimum certificates    

---  

!!! danger "attention"    
    - RoS 7.23+ prefer to use built-in root CA list instead of adding CA manually!   
      `/certificate/settings/set builtin-trust-store=all`  
    - **Exception**: manually add SSL CA for CloudFlare
    - **for insurance**: manually add CA for Comss

---  

## DoH providers  

The best DoH provider choice described [here](doh.md/#doh-provider-selection-considerations-for-russia)

### CloudFlare  
- default DoH link [https://cloudflare-dns.com/dns-query](https://cloudflare-dns.com/dns-query)  
- secure DoH link [https://secure.cloudflare-dns.com/dns-query](https://secure.cloudflare-dns.com/dns-query)

!!! note ""  
    MikroTik build-in root CA: **NOK**, need to add SSL cert  
    Appears by error `DoH server connection error: SSL: ssl: no trusted CA certificate found`

#### Setup commands
```bash
# RoS 7.23
# SSL root CA
/tool fetch url="https://ssl.com/repo/certs/SSLcomRootCertificationAuthorityECC.pem"
/certificate import file-name=SSLcomRootCertificationAuthorityECC.pem

/ip dns set allow-remote-requests=yes \
    servers=1.1.1.1,77.88.8.8,8.8.8.8 \
    use-doh-server=https://cloudflare-dns.com/dns-query verify-doh-cert=yes

/ip dns cache flush
```  
---  

### Quad9  
!!! caution "limited support" 
    - Limited support backed    
      since RoS 7.23: `dns - added HTTP/2 support to DoH on ARM64 and x86/CHR devices`  
    - Totally not supported   
      since December 15 2025: [DOH HTTP/1.1 Retirement](https://quad9.net/news/blog/doh-http-1-1-retirement/)    

!!! note ""  
    MikroTik build-in root CA: **OK**  
#### Setup commands
```bash
# RoS 7.23
# optional
# /tool fetch mode=https url="https://cacerts.digicert.com/DigiCertGlobalG3TLSECCSHA3842020CA1-1.crt.pem"
# /certificate import file-name=DigiCertGlobalG3TLSECCSHA3842020CA1-1.crt.pem

/ip dns static
add address=9.9.9.9 comment="DNS Quad9" name=dns.quad9.net type=A
add address=149.112.112.112 comment="DNS Quad9" name=dns.quad9.net type=A

/ip dns set allow-remote-requests=yes \
    servers=1.1.1.1,77.88.8.8,8.8.8.8 \
    use-doh-server=https://dns.quad9.net/dns-query verify-doh-cert=yes
    
/ip dns cache flush
```  
---  

### Google  
- CA list <https://pki.goog/repository/> 
!!! note ""  
    MikroTik build-in root CA: **OK**    

#### Setup commands
```bash
# RoS 7.23
# optional
# /tool fetch url=https://i.pki.goog/r1.pem
# /tool fetch url=https://i.pki.goog/r2.pem
# /tool fetch url=https://i.pki.goog/r3.pem
# /tool fetch url=https://i.pki.goog/r4.pem
# /tool fetch url=https://i.pki.goog/gsr4.pem
# /certificate import file-name=r1.pem
# /certificate import file-name=r2.pem
# /certificate import file-name=r3.pem
# /certificate import file-name=r4.pem
# /certificate import file-name=gsr4.pem

/ip dns static
add address=8.8.8.8 comment="DNS Google" name=dns.google type=A
add address=8.8.4.4 comment="DNS Google" name=dns.google type=A

/ip dns set allow-remote-requests=yes \
    servers=1.1.1.1,77.88.8.8,8.8.8.8 \
    use-doh-server=https://dns.google/dns-query verify-doh-cert=yes
    
/ip dns cache flush
```  
---  

### Comss   
!!! note "" 
    CA switched to GlobalSign GCC R6 AlphaSSL CA  
    MikroTik build-in root CA: **OK**  
    
#### Setup commands
```bash
# RoS 7.23
# recommended
/tool/fetch url=https://secure.globalsign.com/cacert/gsgccr6alphasslca2025.crt
/certificate/import file-name=gsgccr6alphasslca2025.crt

/ip dns static
add address=195.133.25.16 comment="DNS Comss" name=dns.comss.one type=A
add address=83.220.169.155 comment="DNS Comss" name=dns.comss.one type=A
add address=212.109.195.93 comment="DNS Comss" name=dns.comss.one type=A

/ip dns set allow-remote-requests=yes \
    servers=1.1.1.1,77.88.8.8,8.8.8.8 \
    use-doh-server=https://dns.comss.one/dns-query verify-doh-cert=yes
    
/ip dns cache flush
```  
---  

## Additional  

### Big CA list with all certificates ~ 2Mb
```bash
/tool fetch url=https://curl.se/ca/cacert.pem
/certificate import file-name=cacert.pem passphrase=""
```  

!!! seealso "See also"  
    [How To Check DoH is working](doh.md/#fast-doh-setup)  

