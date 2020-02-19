const directions = {
    0: "North",
    45: "Northeast",
    90: "East",
    135: "Southeast",
    180: "South",
    225: "Southwest",
    270: "West",
    315: "Northwest"
}

const direction = document.querySelector("#direction")
let lastDirectionTime = 0
const directionInterval = 1

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
            if (cardinal === undefined) {
                let now = new Date().getTime()
                if ((now - lastDirectionTime) > directionInterval) {
                    direction.innerText = compassDir
                }
            } else {
                if ([0, 90, 180, 270].includes(compassDir)) {
                    navigator.vibrate([1000])
                } else {
                    navigator.vibrate([500])
                }
                direction.innerText = cardinal
            }
        }
    })
} else {
    direction.innerText = "Compass data is not supported by your browser."
}
