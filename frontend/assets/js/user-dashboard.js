// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
        window.location.href = '/login.html';
        return;
    }

    // Verify user role (should be 'user')
    const user = JSON.parse(userData);
    if (user.role !== 'user') {
        alert('Access denied. This page is for users only.');
        window.location.href = '/login.html';
        return;
    }

    // Populate username in dashboard greeting (uses name from registration)
    try {
        const usernameEl = document.getElementById('username-display');
        if (usernameEl) {
            // Prefer `username`, fallback to `name`, `firstName`, or `email`
            usernameEl.textContent = user.username || user.name || user.firstName || user.email || 'User';
        }
    } catch (err) {
        console.warn('Could not set username display:', err);
    }

    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').setAttribute('max', today);
    
    // Show add expense section by default
    showSection('add-expense');
});

// Show/hide sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    
    // Load expenses when view section is shown
    if (sectionId === 'view-expense') {
        loadExpenses();
    }
}

// Add expense function
async function addExpense(event) {
    event.preventDefault();
    
    const messageDiv = document.getElementById('expense-message');
    messageDiv.innerHTML = '<p class="message" style="background: #d4edda; color: #155724;">Adding expense...</p>';
    
    const formData = {
        source: document.getElementById('source').value,
        amount: parseFloat(document.getElementById('expense-amount').value),
        date: document.getElementById('expense-date').value
    };
    
    try {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageDiv.innerHTML = '<p class="message" style="background: #d4edda; color: #155724;">✓ Expense added successfully!</p>';
            document.getElementById('addExpenseForm').reset();
            
            // Reset max date
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('expense-date').setAttribute('max', today);
            
            // Clear message after 3 seconds
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 3000);
        } else {
            messageDiv.innerHTML = `<p class="message" style="background: #f8d7da; color: #721c24;">✗ ${data.message || 'Failed to add expense'}</p>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<p class="message" style="background: #f8d7da; color: #721c24;">✗ Error: ${error.message}</p>`;
    }
    
    return false;
}

// Load expenses function
async function loadExpenses() {
    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = '<p class="loading">Loading expenses...</p>';
    
    try {
        const response = await fetch('/api/expenses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            let html = '<table>';
            html += '<thead>';
            html += '<tr>';
            html += '<th>Date</th>';
            html += '<th>Source</th>';
            html += '<th>Amount</th>';
            html += '<th>Actions</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            
            data.data.forEach(expense => {
                const date = formatDate(expense.date);
                const amount = formatAmount(expense.amount);
                
                html += '<tr>';
                html += `<td>${date}</td>`;
                html += `<td>${expense.source || 'N/A'}</td>`;
                html += `<td>${amount}</td>`;
                html += `<td>
                    <button class="action-btn edit-btn" onclick="editExpense('${expense._id}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteExpense('${expense._id}')">Delete</button>
                </td>`;
                html += '</tr>';
            });
            
            html += '</tbody>';
            html += '</table>';
            expensesList.innerHTML = html;
        } else if (data.success && data.data.length === 0) {
            expensesList.innerHTML = '<p class="no-data">No expenses found. Add your first expense!</p>';
        } else {
            expensesList.innerHTML = '<p class="message" style="background: #f8d7da; color: #721c24;">Failed to load expenses</p>';
        }
    } catch (error) {
        expensesList.innerHTML = `<p class="message" style="background: #f8d7da; color: #721c24;">Error: ${error.message}</p>`;
    }
}

// Edit expense function - Make globally accessible
window.editExpense = function(expenseId) {
    console.log('Edit expense clicked, ID:', expenseId);
    // Redirect to edit page with expense ID
    window.location.href = `/edit-expense?id=${expenseId}`;
}

// Delete expense function - Make globally accessible
window.deleteExpense = async function(expenseId) {
    console.log('Delete expense clicked, ID:', expenseId);
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Expense deleted successfully!');
            loadExpenses(); // Reload the expenses list
        } else {
            alert(data.message || 'Failed to delete expense');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        } else {
            alert('Logout failed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Format date as DD-MM-YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Format amount with rupee symbol
function formatAmount(amount) {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
