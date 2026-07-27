# WiFi 5/6 (802.11ac/ax)

Good official doc: <https://manual.mikrotik.com/docs/wireless/> 

!!! note "Applicable for"   
    - /interface/wifi/  
    - wifi-qcom  
    - wifi-mediatek (hAP ax S)  

---  

## Recommended values for standalone router  
!!! tip "universal for"  
    - common 2.4ghz and 5ghz SSID
    - mix of modern and legacy devices  
    - IoT devices  
    - noisy env  

!!! warning "warning"  
    - no explicit band steering set - let clients to choose the preferable band  
    - implicit band steering simulated by TX power values  
    - `FT` (802.11r) and `FT over DS` are `disabled` for standalone router  

### Security  

|        parameter        |                           2.4ghz value                            |                                 5ghz value                                 |
| :-----------------------: | :-----------------------------------------------------------------: | :--------------------------------------------------------------------------: |
| `authentication-types`  |                            `wpa2-psk`                             | `wpa2-psk + wpa3-psk`: recommended <br> `wpa3`: dedicated modern SSID only |
|      `encryption`       |                              `ccmp`                               | `ccmp`: best compatibility <br> `ccmp + gcmp`: if all clients support GCMP |
|   `group-encryption`    |                              `ccmp`                               |                                  the same                                  |
|   `group-key-update`    | `1d`: recommended for home <br> `1hr`: enterprise / high-security |                                  the same                                  |
| `management-protection` |                             `allowed`                             |      `allowed`: recommended <br> `required`: dedicated WPA3-only SSID      |
|          `wps`          |                             `disable`                             |                                  the same                                  |

### Channel  

|      parameter      |                                  2.4ghz value                                   |                                   5ghz value                                   |
| :-----------------: | :-----------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
|       `band`        |                                    `2ghz-ax`                                    |                                   `5ghz-ax`                                    |
|     `frequency`     |                `2412`: ch. 1<br>`2437`: ch. 6<br>`2462`: ch. 11                 | `5200`: ch. 40 preferred <br> if congested `5260` (ch. 52) or `5500` (ch. 100) |
|       `width`       |                                     `20mhz`                                     |                                 `20/40/80mhz`                                  |
| `reselect-interval` | `1d`: automatically selects the best channel from the configured frequency list |                      `none`<br>fixed channel recommended                       |
|   `reselect-time`   |             `04:00:00`: recommended for home use <br> (04:00–05:00)             |                      `none`<br>fixed channel recommended                       |
  
### Configuration 
  
|      parameter       |                                                                        2.4ghz value                                                                         |                        5ghz value                        |
| :--------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------: |
|      `country`       |                                                                          `Russia`                                                                           |                         the same                         |
| `hw-protection-mode` | `none`: recommended, maximum throughput <br>`cts-to-self`: 802.11b compatibility, rarely used <br>`rts-cts`: hidden nodes / excessive retries / CCQ <60-70% |                         the same                         |
|    `installation`    |                                            `indoor`: recommended for home use<br> `outdoor`: outdoor links only                                             |                         the same                         |
| `multicast-enhance`  |                               `disabled`: recommended for home<br>`full`: IPTV, Chromecast, AirPlay, multicast-heavy networks                               |                         the same                         |
|      `tx-power`      |                                                   `12 dBm` <br>prefer 5 GHz by reducing 2.4 GHz coverage                                                    | `17 dBm`<br>good balance between coverage and throughput |
|    `dtim-period`     |                                                                 `0`: auto (driver default)                                                                  |               `3`: for Apple compatibility               |

---  
   
## Config example (hAP ax³)  
```bash
# RoS 7.23.2
# common SSID for 2.4ghz and 5ghz
# replace $MYSSID and $MYKEY

# security
/interface wifi security
add authentication-types=wpa2-psk,wpa3-psk disabled=no \
    encryption=ccmp group-encryption=ccmp group-key-update=1d \
    management-protection=allowed \
    name=sec-default passphrase="$MYKEY" wps=disable
add authentication-types=wpa2-psk disabled=no \
    encryption=ccmp group-encryption=ccmp group-key-update=1d \
    management-protection=allowed \
    name=sec-2ghz passphrase="$MYKEY" wps=disable

# channel
/interface wifi channel
add band=5ghz-ax disabled=no frequency=5200 name=ch-5ghz width=20/40/80mhz
add band=2ghz-ax disabled=no frequency=2412,2437,2462 name=ch-2ghz width=20mhz \
    reselect-interval=1d reselect-time=04:00:00

# configuration
/interface wifi configuration
add channel=ch-2ghz country=Russia disabled=no hw-protection-mode=none \
    installation=indoor mode=ap multicast-enhance=disabled \
    name=config-2ghz security=sec-2ghz ssid=$MYSSID \
    tx-power=12
add channel=ch-5ghz country=Russia disabled=no hw-protection-mode=none \
    installation=indoor mode=ap multicast-enhance=disabled \
    name=config-5ghz security=sec-default ssid=$MYSSID \
    tx-power=17 \
    dtim-period=3

# interface
/interface wifi
set [ find default-name=wifi2 ] configuration=config-2ghz \
    configuration.mode=ap disabled=no name=wifi-2ghz
set [ find default-name=wifi1 ] configuration=config-5ghz \
    configuration.mode=ap disabled=no name=wifi-5ghz
```
---  