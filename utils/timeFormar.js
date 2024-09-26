const convertDateTimeFormart = (originalTime) => {
    const date = new Date(originalTime);

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    // const hours = date.getHours();
    // const minutes = date.getMinutes();

    const formattedTime = `${day} ${MONTHS[month]}, ${year}`;

    return formattedTime;
}

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

module.exports = convertDateTimeFormart;