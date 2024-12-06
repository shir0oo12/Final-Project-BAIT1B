// --- User Authentication ---
function saveUserToLocalStorage(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function getUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// --- Signup Functionality ---
const signupForm = document.getElementById('signup-form');
signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!name || !email || !password) {
        alert('All fields are required!');
        return;
    }

    const user = { name, email, password };
    saveUserToLocalStorage(user);

    alert('Account created successfully! Please log in.');
    window.location.href = 'login.html';
});

// --- Login Functionality ---
const loginForm = document.getElementById('login-form');
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const user = getUserFromLocalStorage();

    if (user && user.email === email && user.password === password) {
        alert(`Welcome back, ${user.name}!`);
        window.location.href = 'index.html';
    } else {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = 'Invalid email or password.';
        errorDiv.style.display = 'block';
    }
});

// --- Logout Functionality ---
const logoutBtn = document.getElementById('logout-btn');
logoutBtn?.addEventListener('click', logout);

// --- Redirect if Not Logged In ---
const isAuthPage = window.location.href.includes('login.html') || window.location.href.includes('signup.html');
if (!getUserFromLocalStorage() && !isAuthPage) {
    window.location.href = 'login.html';
}

// --- Onload Greeting for Authenticated Users ---
window.onload = () => {
    const user = getUserFromLocalStorage();
    if (user) {
        console.log(`Hello, ${user.name}!`);
    }
};


// --- Theme Management ---
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(savedTheme);
    } else {
        document.body.classList.add('light'); // Default to light mode
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// Ensure default mode is set
if (!document.body.classList.contains('dark') && !document.body.classList.contains('light')) {
    document.body.classList.add('light'); // Default to light mode
}

// Dark Mode Toggle Event Listener
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle?.addEventListener('click', toggleTheme);

// Apply saved theme on page load
applySavedTheme();

// --- Expense Tracker Functionality ---
let tableData = []; // Array to store table rows
let totalAmount = 0;

const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.querySelector('#expense-table tbody');
const totalAmountElement = document.getElementById('total-amount');

// Monthly Expenses Chart Data
let monthlyExpensesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
        label: 'Monthly Expenses (₱)',
        data: Array(12).fill(0), // Initial data for each month set to 0
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }]
};

// Initialize Chart.js
const ctx = document.getElementById('monthlyExpensesChart')?.getContext('2d');
const monthlyExpensesChart = new Chart(ctx, {
    type: 'bar',
    data: monthlyExpensesData,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 500
                }
            }
        }
    }
});

// Load table data from localStorage
function loadFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem('tableData'));
    const savedChart = JSON.parse(localStorage.getItem('chartData'));

    if (savedData) {
        tableData = savedData;
        renderTable();
    }

    if (savedChart) {
        monthlyExpensesData.datasets[0].data = savedChart;
        monthlyExpensesChart.update();
    }
}

// Save table data and chart data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('tableData', JSON.stringify(tableData));
    localStorage.setItem('chartData', JSON.stringify(monthlyExpensesData.datasets[0].data));
}

// Render table with data
function renderTable() {
    expenseTableBody.innerHTML = ""; // Clear the table
    totalAmount = 0; // Reset total

    tableData.forEach((data, index) => {
        totalAmount += data.amount;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.description}</td>
            <td>₱${data.amount.toFixed(2)}</td>
            <td>${data.date}</td>
            <td>
                <button class="edit-btn" onclick="editRow(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteRow(${index})">Delete</button>
            </td>
        `;
        expenseTableBody.appendChild(row);
    });

    // Update total amount
    totalAmountElement.textContent = `₱${totalAmount.toFixed(2)}`;
}

// Add Expense Event Listener
expenseForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const month = new Date(date).getMonth();

    if (!description || isNaN(amount) || !date) {
        alert('Please fill in all fields correctly.');
        return;
    }

    tableData.push({ description, amount, date });
    monthlyExpensesData.datasets[0].data[month] += amount; // Update chart
    saveToLocalStorage();
    renderTable();
    monthlyExpensesChart.update(); // Refresh chart

    expenseForm.reset();
});

// Edit Row
function editRow(index) {
    const newDescription = prompt("Edit description:", tableData[index].description);
    const newAmount = parseFloat(prompt("Edit amount:", tableData[index].amount));
    const newDate = prompt("Edit date:", tableData[index].date);
    const oldMonth = new Date(tableData[index].date).getMonth();

    if (newDescription && !isNaN(newAmount) && newDate) {
        const newMonth = new Date(newDate).getMonth();
        monthlyExpensesData.datasets[0].data[oldMonth] -= tableData[index].amount;
        monthlyExpensesData.datasets[0].data[newMonth] += newAmount;

        tableData[index] = { description: newDescription, amount: newAmount, date: newDate };
        saveToLocalStorage();
        renderTable();
        monthlyExpensesChart.update(); // Refresh chart
    }
}

// Delete Row
function deleteRow(index) {
    if (confirm("Are you sure you want to delete this expense?")) {
        const month = new Date(tableData[index].date).getMonth();
        monthlyExpensesData.datasets[0].data[month] -= tableData[index].amount;
        tableData.splice(index, 1);
        saveToLocalStorage();
        renderTable();
        monthlyExpensesChart.update(); // Refresh chart
    }
}

// Load table data on page load
loadFromLocalStorage();
