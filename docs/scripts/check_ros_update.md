# Check RoS updates   
---  

!!! warning "Warning"  
    created to work together with [logEventTGInformer](logEventTGInformer.md) script  

## Logic  
```text
START
|
|─ 1. delay 60s (wait Internet)
|─ 2. no scheduler? → create (24h interval)
|─ 3. check-for-updates + delay 5s
|─ 4. get installedVersion / latestVersion
|─ 5. new version available?
        |─ YES -> log it "New RouterOS version available"
        |         logEventTGInformer parses log and ntfy telgram
        |─ NO -> silent exit

END
```  
---  

## How To Use
Add as script with name `checkRoSUpdate`  
- policy: read, write, test, policy  
- do not require permission: no  

---  

## Code  
```bash
# =================================== 
# checkRoSUpdate |  by xdenb43
# created to work together with logEventTGInformer
# tested on RoS 7.23
# =================================== 

# waiting for Internet is up after reboot
# no matter if no Internet this time - next loop will start after 24h
:delay 1m;

# -----------------------------------
# CONFIGURATION
# -----------------------------------
:local scriptName "checkRoSUpdate";
:local installedVersion;
:local latestVersion;

# -----------------------------------
# SCHEDULER
# -----------------------------------
# warn if schedule does not exist and create it
:if ([:len [/system scheduler find name="$scriptName"]] = 0) do={
    /log warning "[$scriptName] Alert : Schedule does not exist. Creating schedule ....";
    :delay 1s;
    /system scheduler add name=$scriptName interval=24h start-time=startup on-event=$scriptName policy=read,write,test,policy;
    /log warning "[$scriptName] Alert : Schedule created!";
}

# -----------------------------------
# MAIN PART
# -----------------------------------
/system/package/update/check-for-updates;
:delay 5s;

:set installedVersion [/system/package/update/get installed-version];
:set latestVersion [/system/package/update/get latest-version];

:if ([:len $latestVersion] > 0 && $latestVersion != $installedVersion) do={
    /log info "[$scriptName] new RouterOS version available: $latestVersion";
}
```