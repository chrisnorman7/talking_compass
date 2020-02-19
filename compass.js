const direction = document.querySelector("#direction")

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', event => {
        let compassDir = null
        if(event.webkitCompassHeading) {
            // Apple works only with this, alpha doesn't work
            compassDir = event.webkitCompassHeading;  
        } else {
            compassDir = event.alpha
        }
        if (compassDir === null) {
            direction.innerText = "Unknown direction."
        } else {
            direction.innerText = compassDir
        }
    })
} else {
    direction.innerText = "Compass data is not supported by your browser."
}
