const long = 200
const short = 50
const between = 100

const directions = {
    0: ["North", [long]],
    45: ["Northeast", [long, between, short]],
    90: ["East", [long, between, long]],
    135: ["Southeast", [long, between, long, between, short]],
    180: ["South", [long, between, long, between, long]],
    225: ["Southwest", [long, between, long, between, long, between, short]],
    270: ["West", [long, between, long, between, long, between, long]],
    315: ["Northwest", [long, between, long, between, long, between, long, between, short]]
}

const startstop = document.querySelector("#startstop")
const direction = document.querySelector("#direction")
let lastDirectionTime = 0
let lastVibrationTime = 0
const directionInterval = 2000
const vibrationInterval = 2000

startstop.onclick = () => {
    if (window.DeviceOrientationEvent !== undefined) {
        window.addEventListener('deviceorientation', event => {
            let compassDir = null
            if(event.alpha === undefined) {
                // Stupid Apple.
                compassDir = event.webkitCompassHeading;  
            } else {
                compassDir = event.alpha
            }
            if (compassDir === null) {
                direction.innerText = "Unknown direction."
            } else {
                compassDir = Math.floor(compassDir)
                let cardinal = directions[compassDir]
                let now = new Date().getTime()
                if (cardinal === undefined) {
                    if ((now - lastDirectionTime) > directionInterval) {
                        lastDirectionTime = now
                        direction.innerText = compassDir
                    }
                } else {
                    let [name, pattern] = cardinal
                    direction.innerText = name
                    if ((now - lastVibrationTime) > vibrationInterval) {
                        lastVibrationTime = now
                        navigator.vibrate(pattern)
                    }
                }
            }
        })
    } else {
        direction.innerText = "Compass data is not supported by your browser."
    }
    navigator.vibrate([1000])
    startstop.value = "Compass started"
}
