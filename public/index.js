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

// JavaScript to calculate total expenses and handle edit form actions
// Calculate and display total expenses
 
document.addEventListener("DOMContentLoaded", () => {
    // Calculate and display total expenses
    const totalExpenses = [
      ...document.querySelectorAll("#expensesTable tbody tr")
    ].reduce((total, row) => {
      return total + parseFloat(row.cells[1].innerText);
    }, 0);
    
    // Ensure `totalExpenses` element exists before trying to assign a value to it
    const totalExpensesElement = document.getElementById("totalExpenses");
    if (totalExpensesElement) {
      totalExpensesElement.innerText = totalExpenses.toFixed(2);
    } else {
      console.error("Element with ID 'totalExpenses' not found.");
    }
  
    // Attach event listener to edit button for each expense row if needed
    document.querySelectorAll("#expensesTable tbody tr .edit-button").forEach(button => {
      button.addEventListener("click", () => openEditForm(button));
    });
  });

// Function to open the edit form with the current values
function openEditForm(button) {
    const expenseId = button.getAttribute("data-expense-id");
    const type = button.getAttribute("data-type");
    const amount = button.getAttribute("data-amount");
    const description = button.getAttribute("data-description");
    const date = button.getAttribute("data-date");
 
  document.getElementById("editType").value = type;
  document.getElementById("editAmount").value = amount;
  document.getElementById("editDescription").value = description;
  document.getElementById("editDate").value = date;
  document.getElementById("editExpenseForm").dataset.expenseId = expenseId;
  document.getElementById("editFormModal").style.display = "block";
}

// Function to close the edit form
function closeEditForm() {
  document.getElementById("editFormModal").style.display = "none";
}

// Submit the edited expense
document
  .getElementById("editExpenseForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const expenseId = event.target.dataset.expenseId;
    const type = document.getElementById("editType").value;
    const amount = parseFloat(document.getElementById("editAmount").value);
    const description = document.getElementById("editDescription").value;
    const date = document.getElementById("editDate").value;

    try {
      const response = await fetch(`/expenses/edit/${expenseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount, description, date }),
      });
      if (response.ok) {
        location.reload(); // Reload the page to reflect changes
      } else {
        alert("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  });
