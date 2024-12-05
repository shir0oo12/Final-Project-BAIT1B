
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
    console.log('Redirecting to login.html');
    window.location.href = 'login.html';
    
});

// log in fuctionality
const loginForm = document.getElementById('login-form');
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const user = getUserFromLocalStorage();

    console.log('User from LocalStorage:', user);
    console.log('Entered Email:', email);
    console.log('Entered Password:', password);

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

// navbar shrink effect
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById("navbar").style.padding = "30px 10px";
        document.getElementById("logo").style.fontSize = "25px";
    } else {
        document.getElementById("navbar").style.padding = "80px 10px";
        document.getElementById("logo").style.fontSize = "35px";
    }
}
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
let totalAmount = 0;
const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.querySelector('#expense-table tbody');
const totalAmountElement = document.getElementById('total-amount');

// Add Expense Event Listener
expenseForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    if (!description || isNaN(amount) || !date) {
        alert('Please fill in all fields correctly.');
        return;
    }

    addExpenseToTable(description, amount, date);
    updateTotalAmount(amount);
    expenseForm.reset();
});

// Add Expense to Table
function addExpenseToTable(description, amount, date) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${description}</td>
        <td>₱${amount.toFixed(2)}</td>
        <td>${date}</td>
    `;
    expenseTableBody?.appendChild(row);
}

// Update Total with Currency Formatting
function updateTotalAmount(amount) {
    totalAmount += amount;
    totalAmountElement.textContent = `₱${totalAmount.toFixed(2)}`;
}

// --- Monthly Expenses Chart ---
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

const ctx = document.getElementById('monthlyExpensesChart').getContext('2d');
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

// Add expense for monthly chart
expenseForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const month = document.getElementById('month').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    if (!month || isNaN(amount) || amount <= 0) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const monthIndex = monthlyExpensesData.labels.indexOf(month);
    if (monthIndex !== -1) {
        monthlyExpensesData.datasets[0].data[monthIndex] += amount;
        monthlyExpensesChart.update();
    } else {
        alert('Invalid month entered.');
    }

    expenseForm.reset();
});

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

