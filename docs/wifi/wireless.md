# Wireless package  

Good official doc: <https://manual.mikrotik.com/docs/wireless/wireless-interface>  

---  

## Recommended values  

|         parameter         |                                            2ghz value                                             |                                                           5ghz value                                                            |
| :-------------------------: | :-------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
| `adaptive-noise-immunity` |                               `ap&client` because of noisy 2ghz env                               |                                                             `none`                                                              |
|   `hw-protection-mode`    |      `cts-to-self`: old devices and mixed b/g/n<br>`rts-cts`: collisions and Tx/Rx CCQ < 60%      |                                                             `none`                                                              |
|        `frequency`        |                         `2412`: ch. 1<br>`2437`: ch. 6<br>`2462`: ch. 11                          |                                            `5200`: ch. 40<br> if noisy ch. 52 or 100                                            |
|        `distance`         |                        `dynamic`: everywhere<br>`fixed`: outside p2p only                         |                                                            the same                                                             |
|         `country`         |   `russia3`: the best<br> `russia4`: max power<br>`russia` max limits<br>`russia1/2`: specific    |                                                            the same                                                             |
|      `installation`       |                        `indoor`: home usage<br> `outdoor`: limits for DFS                         |                                                            the same                                                             |
|    `multicast-helper`     |                           `disabled`: default<br>`full`: for home wifi                            |                                                            the same                                                             |
|      `preamble-mode`      |        `both`: universal<br>`short`: only modern devices<br>`long`: old devices and b mode        |                                                            the same                                                             |
|       `wmm-support`       | `enabled`: the best<br>`disabled`: not use, 54 Mb/s limit<br>`required`: drop unsupported clients |                                                            the same                                                             |
|   `skip-dfs-channels `    |                                          not applicable                                           | `all`: best for home usage<br>`disabled`: fixed ch. 52 or 100<br>`10min-only`: skip ch. 120–128<br>-->(weather radars) |  

---  
   
## Best config by device class   

### Low-End Devices (hAP lite, hAP ac lite, RB750)  
```bash
# RoS 7.23
# replace $MYSSID and $MYKEY
/interface wireless security-profiles
set [ find default=yes ] authentication-types=wpa2-psk disable-pmkid=no group-ciphers=aes-ccm \
    group-key-update=1h management-protection=disabled mode=dynamic-keys name=default \
    unicast-ciphers=aes-ccm wpa-pre-shared-key="" wpa2-pre-shared-key="$MYKEY"

# 2ghz
/interface wireless
set [ find default-name=wlan1 ] adaptive-noise-immunity=ap-and-client-mode band=2ghz-g/n \
    channel-width=20mhz country=russia3 distance=dynamic frequency=2412 \
    frequency-mode=regulatory-domain hw-protection-mode=none installation=indoor \
    mode=ap-bridge multicast-helper=default name=wifi-2ghz preamble-mode=both \
    security-profile=default skip-dfs-channels=disabled ssid=$MYSSID wmm-support=enabled \
    wps-mode=disabled

# 5ghz
/interface wireless
set [ find default-name=wlan2 ] adaptive-noise-immunity=none band=5ghz-n/ac \
    channel-width=20/40mhz-XX country=russia3 distance=dynamic frequency=5200 \
    frequency-mode=regulatory-domain hw-protection-mode=none installation=indoor \
    mode=ap-bridge multicast-helper=default name=wifi-5ghz preamble-mode=both \
    security-profile=default skip-dfs-channels=all ssid=$MYSSID wmm-support=enabled \
    wps-mode=disabled
```
