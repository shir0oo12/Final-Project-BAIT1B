
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const expenseTableBody = document.querySelector('#expense-table tbody');
const totalAmountElement = document.getElementById('total-amount');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let totalAmount = 0;

// Add an expense
expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    if (description && amount && date) {
        addExpenseToTable(description, amount, date);
        updateTotalAmount(amount);

        // Clear input fields
        descriptionInput.value = '';
        amountInput.value = '';
        dateInput.value = '';
    }
});

// Add a row to the table
function addExpenseToTable(description, amount, date) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${description}</td>
        <td>₱${amount.toFixed(2)}</td>
        <td>${date}</td>
    `;

    expenseTableBody.appendChild(row);
}

// Update total amount
function updateTotalAmount(amount) {
    totalAmount += amount;
    totalAmountElement.textContent = `₱${totalAmount.toFixed(2)}`;
}

// Dark Mode 
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');

    // Update button text based on the mode
    if (document.body.classList.contains('dark')) {
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        darkModeToggle.textContent = "🌙 Dark Mode";
    }
});

// Set default mode to light
document.body.classList.add('light');
