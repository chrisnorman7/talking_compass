const long = 200
const short = 50
const between = 100
const startCompassText = "Start Compass"

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

let audioContext = null
let oscillator = null
const baseFrequency = 200
const distanceTransform = 10
const maxDistance = 150

const startstop = document.querySelector("#startstop")
const save = document.querySelector("#save")
const audioToggle = document.querySelector("#audioToggle")
const savedCoordinates = document.querySelector("#savedCoordinates")
const distanceDirections = document.querySelector("#distanceDirections")

const direction = document.querySelector("#direction")
const position = document.querySelector("#position")

let latitude = null
let savedLatitude = null
let longitude = null
let savedLongitude = null

const gpsNames = ["latitude", "longitude", "altitude", "heading", "speed", "accuracy"]

let watchId = null

let lastDirectionTime = 0
let lastVibrationTime = 0
const directionInterval = 2000
const vibrationInterval = 4000

window.onload = () => {
    window.AudioContext = (window.AudioContext || window.webkitAudioContext)
    startstop.value = startCompassText
}

startstop.onclick = () => {
    if (!audioContext) {
        audioContext = new AudioContext()
    }
    if (oscillator) {
        oscillator.disconnect()
        oscillator = null
    } else {
        oscillator = audioContext.createOscillator()
        oscillator.connect(audioContext.destination)
        oscillator.start()
        oscillator.frequency.value = baseFrequency
        if (!audioToggle.checked) {
            audioContext.suspend()
        }
    }
    if (watchId) {
        navigator.geolocation.clearWatch(watchId)
        watchId = null
        startstop.value = startCompassText
    } else {
        if ("geolocation" in navigator) {
            position.hidden = false
            watchId = navigator.geolocation.watchPosition(
                obj => {
                    latitude = obj.coords.latitude
                    longitude = obj.coords.longitude
                    for (let name of gpsNames) {
                        let text = obj.coords[name]
                        if (["altitude", "speed", "accuracy"].includes(name)) {
                            text = distanceToText(text)
                        }
                        if (text === null) {
                            text = "Unknown"
                        }
                        document.querySelector(`#${name}`).innerText = text
                    }
                    let now = new Date().getTime()
                    let distance = null
                    if (savedLatitude !== null && savedLongitude !== null) {
                        distance = distanceBetween(
                            latitude, longitude,
                            savedLatitude, savedLongitude
                        )
                        if (distance <= maxDistance) {
                            if (audioToggle.checked) {
                                audioContext.resume()
                            }
                            oscillator.frequency.value = baseFrequency + (distance * distanceTransform)
                        } else {
                            audioContext.suspend()
                        }
                    } else {
                        distance = undefined
                    }
                    if ((now - lastDirectionTime) > directionInterval) {
                        lastDirectionTime = now
                        let compassDir = obj.coords.heading
                        if (compassDir === null) {
                            direction.innerText = "Unknown direction."
                        } else {
                            compassDir = Math.floor(compassDir)
                            let cardinal = directions[compassDir]
                            if (cardinal === undefined) {
                                direction.innerText = compassDir
                            } else {
                                let [name, pattern] = cardinal
                                direction.innerText = name
                                if ((now - lastVibrationTime) > vibrationInterval) {
                                    lastVibrationTime = now
                                    navigator.vibrate(pattern)
                                }
                            }
                        }
                        if (savedLatitude && savedLongitude) {
                            updateDistanceDirections(distance)
                        }
                    }
                },
                error => {
                    direction.innerText = `Error: ${error.message}`
                    if (error.code == 1) {
                        startstop.value = startCompassText
                        watchId = null
                    }
                },
                {enableHighAccuracy: true}
            )
            navigator.vibrate([10])
            startstop.value = "Stop Compass"
        } else {
            direction.innerText = "Location information is not supported by your browser."
        }
    }
}

save.onclick = () => {
    if (latitude === null && longitude === null) {
        alert("You must first start the compass.")
    } else {
        savedLatitude = latitude
        savedLongitude = longitude
        savedCoordinates.innerText = `${savedLatitude}° latitude, ${savedLongitude}° longitude.`
        updateDistanceDirections()
    }
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function bearing(lat1, lon1, lat2, lon2){
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2)
    const x = (
        Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) *
        Math.cos(lon2 - lon1)
    )
    let brng = Math.atan2(y, x)
    brng = radiansToDegrees(brng)
    return (brng + 360) % 360
}

function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}

function distanceBetween(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const fi1 = degreesToRadians(lat1)
    const fi2 = degreesToRadians(lat2)
    const deltaLambda = degreesToRadians(lon2 - lon1)
    return Math.acos(
        Math.sin(fi1) * Math.sin(fi2) + Math.cos(fi1) * Math.cos(fi2) *
        Math.cos(deltaLambda)
    ) * R
}

function updateDistanceDirections(distance) {
    if (distance === undefined) {
        distance = distanceBetween(
            latitude, longitude,
            savedLatitude, savedLongitude
        )
    }
    distance = distanceToText(distance)
    let degrees = Math.floor(bearing(
        latitude, longitude,
        savedLatitude, savedLongitude
    ))
    distanceDirections.innerText = `${distance} at ${degrees}°.`
}

function distanceToText(m) {
    if (typeof(m) == "number") {
        m = m.toFixed(2)
    }
    if (m > 1000) {
        return `${m / 1000}km`
    } else {
        return `${m}m`
    }
}

audioToggle.onclick = () => {
    if (!watchId) {
        alert("You must start the compass before audio will work.")
    } else if (audioToggle.checked) {
        audioContext.resume()
    } else {
        audioContext.suspend()
    }
}
