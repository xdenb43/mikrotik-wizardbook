# Architecture Guide  

---   

## Device classification model  

|   Tier    |            Targe usage             | Usage scenarios                         |
| :-------: | :---------------------------------: | :--------------------------------------- |
|  Low-end  |         Home / Entry-level          | simplicity and home usage                |
| Mid-range | SOHO / Extended home / Small Office | balanced SOHO and professional setups    |
| High-end  |       Enterprise / ISP-grade        | scalable enterprise and ISP environments |  

!!! note ""  
    This classification is based on real-world performance, not official vendor segmentation. 
 
## Feature suitability matrix  

| Feature | Low-end | Mid-range | High-end |
|--------|--------|------------|-----------|
| NAT | ✅ | ✅ | ✅ |
| Firewall (basic) | ⚠ limited | ✅ | ✅ |
| VLANs | ⚠ minimal | ✅ | ✅ |
| VPN | ⚠ limited | ✅ | 🚀 |
| DoH | ⚠ CPU-heavy | ✅ | 🚀 |
| BGP / advanced routing | ❌ | ⚠ limited | 🚀 |  
  
## Detailed classification

### Low-end Devices  
   
#### Typical models  
- MikroTik hAP lite  
- MikroTik hAP mini  
- MikroTik hEX lite  
- MikroTik RB941-2nD
- **MikroTik hAP ac lite TC**  

#### Characteristics  
- Low CPU performance (single-core or low-frequency multi-core)
- Limited RAM (32–64 MB)
- Basic routing and NAT capabilities
- Limited capacity for CPU-intensive features (e.g., DoH, complex firewall rules)

#### Recommended use cases  
- Home internet gateway  
- Basic NAT and DHCP services  
- Simple firewall configurations  
- Testing and lab environments  

#### Limitations  
- DoH may introduce noticeable CPU load  
- Limited scalability for VLAN-heavy or VPN-heavy setups  
- Not suitable for advanced traffic processing  
---

### Mid-range Devices 

#### Typical models  
- MikroTik hAP ac²  
- MikroTik hAP ac³  
- MikroTik RB4011  
- MikroTik hEX S
- MikroTik hAP ac3 (SOHO router)
- MikroTik hAP ax2 (SOHO / Advanced Home / Edge Router)
- **MikroTik hAP ax³** (upper-tier / advanced SOHO router)   

#### Characteristics  
- Multi-core CPU with significantly higher throughput  
- 128 MB to 1 GB RAM depending on model  
- Stable performance under combined workloads  
- Suitable for modern RouterOS features (v7+)  

#### Recommended use cases  
- Small office / SOHO networks  
- VLAN segmentation and inter-VLAN routing  
- VPN services (WireGuard, IPsec, L2TP)  
- DoH with caching enabled  
- Moderate firewall complexity  

!!! caution "Caution"  
    - Proper configuration is required to avoid CPU bottlenecks    
    - Firewall rules should be optimized for performance
    - DNS caching is strongly recommended when using DoH
---  

### High-end Devices  

#### Typical models  
- MikroTik CCR1009  
- MikroTik CCR2004  
- MikroTik CCR2116  
- MikroTik CCR2216  

#### Characteristics  
- High-core-count CPUs optimized for routing workloads  
- Hardware acceleration for throughput-intensive operations  
- Designed for multi-gigabit environments  
- High memory capacity for large routing tables and policies  

#### Recommended use cases
- Enterprise networks  
- ISP infrastructure  
- Large-scale routing (BGP, OSPF at scale)  
- Complex firewall and policy-based routing  
- High-throughput NAT environments  

!!! caution "Caution"  
    - Best performance achieved with properly segmented architecture (VLANs, VRFs)  
    - Recommended for environments with sustained high traffic loads  
        
---  
