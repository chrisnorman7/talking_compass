/* global Cookies */

const long = 100
const short = 25
const between = 50
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

let beepTimer = null
const beep = new Audio("data:audio/mpeg;base64,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wZ0G7jqlt/OcDIKX+/1NblSX+VKfQfP8xuJJGk7////rf////+PgXTv///1JThJJQainmySAB6imUyuVbVttUo7T4Csa821OuF88f62+CZHFnGf///mQgYIEO0SMF2NVy9NxYTdlqJ8AuS4zr//SJoTUJ+CaKKTcZvosrUPo8W/MUv0f033E9E/QpN6P///v/////WRR2mwUAYUABjabRu1vrOLKAF0kIdHjnEx/iNWo7jGn1////mApxNTJQQOU1Het/NoUFTMQs6Vja///THaGIl/0fojl8mjd/Jo8W+ZfpNpCajsz7////6kn/////WRRgDz//LD1KSTDjKOciSAKxdLx5S31uYqKIWj/+5JECgAC8V5M6g9rdFyr6Vo9rW6KtHcr5DEJQRkSpLRklSigvVc4QpmyPe9H3zHR1/in9P/8VNCMJOzYUDyVjfwHP0ZgiZt/3/+9EBnDKbegdUrckhgntHaQ9vX/X/9A/////+r/////mJ3/9ItRcoVRogAcmV9N8z0pvES8QQsKoMGXEymPQyWm6E4HQLqgpv/CZJAtYXQSwoF8e6SB56zABEoW+qgZjJAZovGr0Gl5/OjFKL3JwnaX9v7/X8y1f/////////49WAzMzEYYMZLq6CUANIqbDX7lisBIdraAEPwShTRc9WZ2vAqBc4NQ9GrUNaw0Czcrte0g1NEoiU8NFjx4NFh54FSwlOlgaCp0S3hqo8SLOh3/63f7P/KgKJxxhgGSnAFMCnIogwU5JoqBIDAuBIiNLETyFmiImtYiDTSlb8ziIFYSFv/QPC38zyxEOuPeVGHQ77r/1u/+kq49//6g4gjoVQSUMYQUSAP8PwRcZIyh2kCI2OwkZICZmaZxgnsNY8DmSCWX0idhtz3VTJSqErTSB//1X7TTTVVV//uSZB2P8xwRJ4HvYcItQlWBACM4AAABpAAAACAAADSAAAAEVf/+qCE000VVVVU0002//+qqqqummmmr///qqqppppoqqqqppppoqqATkEjIyIxBlBA5KwUEDBBwkFhYWFhUVFfiqhYWFhcVFRUVFv/Ff/xUVFRYWFpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==")
let lastBeepTime = 0
const distanceMultiplier = 100
const beepInterval = 50

const startstop = document.querySelector("#startstop")
const save = document.querySelector("#save")
const audioToggle = document.querySelector("#audioToggle")
const savedCoordinates = document.querySelector("#savedCoordinates")
const distanceDirections = document.querySelector("#distanceDirections")

const direction = document.querySelector("#direction")
const position = document.querySelector("#position")

let latitude = null
let savedLatitude = null
if ("latitude" in Cookies.get()) {
    savedLatitude = JSON.parse(Cookies.get("latitude"))
}
let longitude = null
let savedLongitude = null
if ("longitude" in Cookies.get()) {
    savedLongitude = JSON.parse(Cookies.get("longitude"))
}
let distance = null

const gpsNames = ["latitude", "longitude", "altitude", "heading", "speed", "accuracy"]

let watchId = null

let lastDirectionTime = 0
let lastVibrationTime = 0
const directionInterval = 2000
const vibrationInterval = 4000

window.onload = () => {
    startstop.value = startCompassText
    if ("audio" in Cookies.get()) {
        audioToggle.checked = JSON.parse(Cookies.get("audio"))
    }
}

startstop.onclick = () => {
    if (watchId) {
        clearInterval(beepTimer)
        navigator.geolocation.clearWatch(watchId)
        watchId = null
        startstop.value = startCompassText
    } else {
        beepTimer = setInterval(() => {
            if (distance === null || watchId === null || document[hidden]) {
                return
            }
            const now = new Date().getTime()
            if ((now - lastBeepTime) >= (distance * distanceMultiplier) && audioToggle.checked) {
                lastBeepTime = now
                beep.play()
            }
        }, beepInterval)
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
                    const now = new Date().getTime()
                    if (savedLatitude !== null && savedLongitude !== null) {
                        distance = distanceBetween(
                            latitude, longitude,
                            savedLatitude, savedLongitude
                        )
                    } else {
                        distance = null
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
        Cookies.set("latitude", savedLatitude)
        Cookies.set("longitude", savedLongitude)
        distance = distanceBetween(
            latitude, longitude,
            savedLatitude, savedLongitude
        )
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

function updateDistanceDirections(d) {
    if (d === undefined || d === null) {
        d = distanceBetween(
            latitude, longitude,
            savedLatitude, savedLongitude
        )
    }
    d = distanceToText(d)
    let degrees = Math.floor(bearing(
        latitude, longitude,
        savedLatitude, savedLongitude
    ))
    distanceDirections.innerText = `${d} at ${degrees}°.`
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

// Set the name of the hidden property and the change event for visibility
let hidden = null
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden"
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden"
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden"
}

audioToggle.onclick = () => Cookies.set("audio", JSON.stringify(audioToggle.checked))
