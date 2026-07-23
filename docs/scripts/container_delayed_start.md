# Delayed start for containers  
---  

## Logic  
```text
START
|
|─ [1] Scheduler exists? → NO: create scheduler (interval=0s, startup)
|
|─ [2] Loop: resolve vk.com (max 15 attempts, 5s delay between)
|       ├─ OK → internetUp=YES, exit loop
|       └─ FAIL → count++, delay 5s, repeat
|
|─ [3] internetUp?
        ├─ YES → foreach container: /container/start
        │         └─ on-error: log "Failed to start"
        └─ NO → log "Internet timeout after 75s"

END
```

---  

## How To Use  
- Add as script with name `containersDelayedStart`  
    - policy: read, write, test  
    - do not require permission: no  
- Fill `containers` variable with containers list to be start-delayed  

---  

## Code    
```bash
# =================================== 
# containersDelayedStart | by xdenb43
# tested on RoS 7.23
# ===================================

# -----------------------------------
# CONFIGURATION
# -----------------------------------
:local scriptName "containersDelayedStart";
# PLACE YOUR CONTAINERS HERE
:local containers {
    "mihomo"
    };

:local count 0;
:local maxAttempts 15;
:local internetUp false;
:local targetHost "vk.com";

# -----------------------------------
# SCHEDULER
# -----------------------------------
# warn if schedule does not exist and create it
:if ([:len [/system scheduler find name="$scriptName"]] = 0) do={
    /log warning "[$scriptName] Alert : Schedule does not exist. Creating schedule ....";
    :delay 1s;
    /system scheduler add name=$scriptName interval=0s start-time=startup on-event=$scriptName policy=read,write,test;
    /log warning "[$scriptName] Alert : Schedule created!";
}

# -----------------------------------
# MAIN PART
# -----------------------------------
# Check internet with domain resolving (using DNS)
:while ($count < $maxAttempts && !$internetUp) do={
    :do {
        :resolve $targetHost;
        :set internetUp true;
    } on-error={
        :set count ($count + 1);
        :delay 5s;
    }
}

# Start container if Internet UP
:if ($internetUp) do={
    :log info "[$scriptName] Internet is UP. Starting containers...";
    :foreach cont in=$containers do={
        :do {
            /container/start [find name~($cont)];
        } on-error={
            :log error "[$scriptName] Failed to start container: $cont";
        }
    }
} else {
    :log error "[$scriptName] failed: Internet or DNS timeout after 75 seconds";
}
```