//calender functionality
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentDate = today.getDate();

  // Display the current month and today's date
  document.getElementById("month").innerText = currentMonth;
  document.getElementById("day").innerText = currentDate;

  const weekDatesContainer = document.getElementById("week-dates");
  weekDatesContainer.innerHTML = ""; // Clear any existing dates

  // Calculate the current week dates
  const firstDayOfWeek = today.getDate() - today.getDay();
  for (let i = 0; i < 7; i++) {
    const dateElement = document.createElement("div");
    dateElement.classList.add("date");

    const weekDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      firstDayOfWeek + i
    );
    dateElement.innerText = weekDate.getDate();

    // Highlight today
    if (weekDate.getDate() === currentDate) {
      dateElement.classList.add("today");
    }

    weekDatesContainer.appendChild(dateElement);
  }
});

// Function to update the calendar
function updateCalendar() {
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentDate = today.getDate();

  // Update the month and date display
  document.getElementById("month").innerText = currentMonth;
  document.getElementById("day").innerText = currentDate;

  // Clear and repopulate week dates
  const weekDatesContainer = document.getElementById("week-dates");
  weekDatesContainer.innerHTML = "";

  // Calculate the current week dates
  const firstDayOfWeek = today.getDate() - today.getDay();
  for (let i = 0; i < 7; i++) {
    const dateElement = document.createElement("div");
    dateElement.classList.add("date");

    const weekDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      firstDayOfWeek + i
    );
    dateElement.innerText = weekDate.getDate();

    // Highlight today
    if (weekDate.getDate() === currentDate) {
      dateElement.classList.add("today");
    }

    weekDatesContainer.appendChild(dateElement);
  }
}

// Initial calendar update
updateCalendar();

// Check every minute if the date has changed to update at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    updateCalendar(); // Refresh the calendar when it’s midnight
  }
}, 60000); // Check every 60 seconds

 