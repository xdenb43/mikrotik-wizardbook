#  Legacy wireless package  

Good official doc: <https://manual.mikrotik.com/docs/wireless/> 

!!! note "Applicable for"   
    - /interface/wireless/  
    - 802.11 a/b/g/n  
    - WiFi 5 (802.11 ac)  

---  

## Recommended values  

### Security  

|        parameter        |                                                                 common value  for 2.4ghz and 5ghz                                                                  |
| :---------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `authentication-types`  |                                                                             `wpa2-psk`                                                                             |
|     `disable-pmkid`     |                                                                                `no`                                                                                |
|    `unicast-ciphers`    |                                                                             `aes-ccm`                                                                              |
|     `group-ciphers`     |                                                                             `aes-ccm`                                                                              |
|   `group-key-update`    |                                                     `1d`: recommended for home networks <br> `1hr`: enterprise                                                     |
| `management-protection` | `allowed`: recommended (best compatibility/security balance) <br>`disabled`: only for legacy compatibility issues<br>`required`: only if every client supports PMF |
  
### Configuration  

|         parameter         |                                                                        2.4ghz value                                                                         |                                                         5ghz value                                                         |
| :-----------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|          `band`           |                                           `2ghz-g/n` gives maximum compatibility <br> `b` is for very old devices                                           |                                                        `5ghz-n/ac`                                                         |
|        `frequency`        |                                                      `2412`: ch. 1<br>`2437`: ch. 6<br>`2462`: ch. 11                                                       |                       `5200`: ch. 40 preferred <br> if congested `5260` (ch. 52) or `5500` (ch. 100)                       |
|      `channel-width`      |                                                                           `20mhz`                                                                           |                                                       `20/40mhz-XX`                                                        |
|         `country`         |             `russia3`: recommended<br> `russia4`: higher allowed TX power<br>`russia`: maximum regulatory limits<br>`russia1/2`: legacy domains             |                                                          the same                                                          |
|        `distance`         |                                                     `dynamic`: everywhere<br>`fixed`: outside p2p only                                                      |                                                          the same                                                          |
| `adaptive-noise-immunity` |                                                           `ap&client`: recommended (noisy 2.4ghz)                                                           |                                                           `none`                                                           |
|   `hw-protection-mode`    | `none`: recommended, maximum throughput <br>`cts-to-self`: 802.11b compatibility, rarely used <br>`rts-cts`: hidden nodes / excessive retries / CCQ <60-70% |                                                           `none`                                                           |
|      `installation`       |                                            `indoor`: recommended for home use<br> `outdoor`: outdoor links only                                             |                                                          the same                                                          |
|    `multicast-helper`     |                               `disabled`: recommended for home<br>`full`: IPTV, Chromecast, AirPlay, multicast-heavy networks                               |                                                          the same                                                          |
|      `preamble-mode`      |                                     `both`: universal<br>`short`: only modern devices<br>`long`: old devices and b mode                                     |                                                          the same                                                          |
|       `wmm-support`       |                               `enabled`: recommended<br>`disabled`: not use, 54 Mb/s limit<br>`required`: drop legacy clients                               |                                                          the same                                                          |
|   `skip-dfs-channels `    |                                                                       not applicable                                                                        | `all`: recommended for home<br>`disabled`: used fixed ch52 or ch100<br>`10min-only`: skip ch120–128<br>-->(weather radars) |

---  
   
## Config example  

```bash
# RoS 7.23
# replace $MYSSID and $MYKEY
/interface wireless security-profiles
set [ find default=yes ] authentication-types=wpa2-psk disable-pmkid=no \
    group-ciphers=aes-ccm group-key-update=1d management-protection=allowed \
    mode=dynamic-keys name=default unicast-ciphers=aes-ccm \
    wpa-pre-shared-key="" wpa2-pre-shared-key="$MYKEY"

# 2.4ghz
/interface wireless
set [ find default-name=wlan1 ] adaptive-noise-immunity=ap-and-client-mode \
    band=2ghz-g/n channel-width=20mhz country=russia3 distance=dynamic \
    frequency=2412 frequency-mode=regulatory-domain hw-protection-mode=none \
    installation=indoor mode=ap-bridge multicast-helper=default name=wifi-2ghz \
    preamble-mode=both security-profile=default skip-dfs-channels=disabled \
    ssid=$MYSSID wmm-support=enabled wps-mode=disabled

# 5ghz
/interface wireless
set [ find default-name=wlan2 ] adaptive-noise-immunity=none \
    band=5ghz-n/ac channel-width=20/40mhz-XX country=russia3 distance=dynamic \
    frequency=5200 frequency-mode=regulatory-domain hw-protection-mode=none \
    installation=indoor mode=ap-bridge multicast-helper=default name=wifi-5ghz \
    preamble-mode=both security-profile=default skip-dfs-channels=all \
    ssid=$MYSSID wmm-support=enabled wps-mode=disabled
```
---  