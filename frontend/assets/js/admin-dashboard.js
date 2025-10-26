// Admin Dashboard JavaScript

// Check if user is admin
function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !user || user.role !== 'admin') {
        alert('Access denied! Admin access required.');
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Fetch all users
async function loadUsers() {
    const usersLoading = document.getElementById('users-loading');
    const usersError = document.getElementById('users-error');
    const usersTable = document.getElementById('users-table');
    const usersTbody = document.getElementById('users-tbody');
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            usersLoading.style.display = 'none';
            usersTable.style.display = 'table';
            
            if (data.data && data.data.length > 0) {
                usersTbody.innerHTML = data.data.map((user, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHtml(user.username)}</td>
                        <td>${escapeHtml(user.email)}</td>
                        <td>${escapeHtml(user.role)}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editUser('${user._id}')">Edit</button>
                            <button class="btn btn-delete" onclick="deleteUser('${user._id}', '${escapeHtml(user.username)}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                usersTbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
            }
        } else {
            throw new Error(data.message || 'Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        usersLoading.style.display = 'none';
        usersError.textContent = 'Error loading users: ' + error.message;
        usersError.style.display = 'block';
    }
}

// Fetch all expenses
async function loadExpenses() {
    const expensesLoading = document.getElementById('expenses-loading');
    const expensesError = document.getElementById('expenses-error');
    const expensesTable = document.getElementById('expenses-table');
    const expensesTbody = document.getElementById('expenses-tbody');
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/expenses', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            expensesLoading.style.display = 'none';
            expensesTable.style.display = 'table';
            
            console.log('Loaded expenses:', data.data); // Debug log
            
            if (data.data && data.data.length > 0) {
                expensesTbody.innerHTML = data.data.map((expense, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHtml(expense.username || 'Unknown')}</td>
                        <td>${formatDate(expense.date)}</td>
                        <td>${escapeHtml(expense.source || expense.category || 'N/A')}</td>
                        <td>₹${formatAmount(expense.amount)}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editExpense('${expense._id}')">Edit</button>
                            <button class="btn btn-delete" onclick="deleteExpense('${expense._id}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                expensesTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No expenses found</td></tr>';
            }
        } else {
            throw new Error(data.message || 'Failed to load expenses');
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
        expensesLoading.style.display = 'none';
        expensesError.textContent = 'Error loading expenses: ' + error.message;
        expensesError.style.display = 'block';
    }
}

// Edit user - Make globally accessible
window.editUser = function(userId) {
    console.log('Edit user clicked, ID:', userId);
    window.location.href = `/admin/edit-user?id=${userId}`;
}

// Delete user
window.deleteUser = async function(userId, username) {
    console.log('Delete user clicked, ID:', userId, 'Username:', username);
    if (!confirm(`Are you sure you want to delete user "${username}"?\n\nThis will also delete all their expenses!`)) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('User deleted successfully!');
            loadUsers(); // Reload users list
            loadExpenses(); // Reload expenses list
        } else {
            alert('Error: ' + (data.message || 'Failed to delete user'));
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
    }
}

// Edit expense - Make globally accessible
window.editExpense = function(expenseId) {
    console.log('Edit expense clicked, ID:', expenseId);
    window.location.href = `/admin/edit-expense?id=${expenseId}`;
}

// Delete expense
window.deleteExpense = async function(expenseId) {
    console.log('Delete expense clicked, ID:', expenseId);
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Expense deleted successfully!');
            loadExpenses(); // Reload expenses list
        } else {
            alert('Error: ' + (data.message || 'Failed to delete expense'));
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense: ' + error.message);
    }
}

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        // Clear local storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Call logout API
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        }).finally(() => {
            window.location.href = '/login';
        });
    }
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function formatAmount(amount) {
    return parseFloat(amount).toFixed(2);
}

// Initialize on page load
if (checkAdminAuth()) {
    loadUsers();
    loadExpenses();
}
