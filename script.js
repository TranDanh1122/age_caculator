let isInValidDate = {
    day: null,
    month: null,
    year: null,
    age_day: null,
    age_month: null,
    age_year: null,
    today: new Date(),
    enteredDate: null,
    checkFormat: () => {
        isInValidDate.intFormat()
        if (isNaN(isInValidDate.day) || isNaN(isInValidDate.month) || isNaN(isInValidDate.year)) return ['all', "All fields must be filled valid number."]
        return true
    },
    checkDate: () => {
        if (isInValidDate.day < 1 || isInValidDate.day > 31) return ['day', 'Day must be between 1 and 31.'];
        return true
    },
    checkMonth: () => {
        if (isInValidDate.month < 1 || isInValidDate.month > 12) return ['month', 'Month must be between 1 and 12.'];
        return true
    },
    checkYear: () => {
        if (isInValidDate.year < 1900 || isInValidDate.year > 2024) return ['year', 'Year must be valid'];
        return true
    },
    checkIsFuture: () => {
        isInValidDate.enteredDate = new Date(isInValidDate.year, isInValidDate.month - 1, isInValidDate.day) //that shit is month index, im stuck here 1 hour, fk stupid bitch
        if (isInValidDate.enteredDate > isInValidDate.today) return ['all', 'Date cannot be in the future'];
        return true
    },
    checkIsLeafYearOrFeb: () => {
        if (!isValidDate(isInValidDate.day, isInValidDate.month, isInValidDate.year)) return ['all', 'The entered date is invalid.'];
        return true
    },
    passAllRule: () => {

        isInValidDate.age_year = isInValidDate.today.getFullYear() - isInValidDate.year
        isInValidDate.age_month = isInValidDate.today.getMonth() - isInValidDate.month
        isInValidDate.age_day = isInValidDate.today.getDate() - isInValidDate.day
        if (isInValidDate.age_day < 0) {
            isInValidDate.age_month--;
            const previousMonth = new Date(isInValidDate.today.getFullYear(), isInValidDate.today.getMonth(), 0);
            isInValidDate.age_day += previousMonth.getDate();
        }
        if (isInValidDate.age_month < 0) {
            isInValidDate.age_year--;
            isInValidDate.age_month += 12;
        }

        return false
    },
    intFormat: () => {
        isInValidDate.day = parseInt(isInValidDate.day)
        isInValidDate.month = parseInt(isInValidDate.month)
        isInValidDate.year = parseInt(isInValidDate.year)
    },
    init: (data) => {
        isInValidDate.day = data.day
        isInValidDate.month = data.month
        isInValidDate.year = data.year

    },

}

function isValidDate(day, month, year) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day <= daysInMonth[month - 1];
}
let form = document.querySelector('form')
let [dayEl, monthEl, yearEl] = [".day", ".month", ".year"].map(el => document.querySelector(el))
let showInputError = (el, message, toggle) => {
    let input = document.querySelector(`input[name="${el}"]`)
    input.toggleAttribute('error', toggle)
    input.nextElementSibling.textContent = message
    input.parentNode.querySelector('label').toggleAttribute('error', toggle)
}
let showError = (el, message) => {
    [dayEl, monthEl, yearEl].forEach(el => el.textContent = "- -")
    if (el == "all") {
        ["day", "month", "year"].forEach(el => showInputError(el, message))
        return false
    }
    showInputError(el, message)
}
let showAge = () => {
    ["day", "month", "year"].forEach(el => showInputError(el, "", false))

    dayEl.textContent = isInValidDate.age_day
    monthEl.textContent = isInValidDate.age_month
    yearEl.textContent = isInValidDate.age_year
}
let handleSubmit = (e) => {
    e.preventDefault()
    let data = Object.fromEntries(new FormData(form))
    if (!data) return false
    isInValidDate.init(data)
    for (const key in isInValidDate) {
        if (typeof isInValidDate[key] != "function") continue;
        let error = isInValidDate[key]()
        if (!error) break;
        if (Array.isArray(error)) {
            let el = error[0]
            let message = error[1]
            showError(el, message)
            return false;
        }
    }
    showAge()
}
form.addEventListener('submit', handleSubmit)