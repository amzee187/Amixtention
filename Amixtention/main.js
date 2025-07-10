const dateElement = document.getElementById('date')
const timeElement = document.getElementById('time')

updateDateTime()

function updateDateTime() {
    const newDate = new Date()
    const persianDate = newDate.toLocaleDateString('fa-IR', { weekday: "long", day: "2-digit", month: "long" })
    const time = newDate.toLocaleTimeString('fa-IR', { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    dateElement.textContent = persianDate
    timeElement.textContent = time
}

setInterval(updateDateTime, 1000)