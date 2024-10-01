// static/js/settings.js
document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('account-form');
    const passwordForm = document.getElementById('password-form');

    // Fetch user data and populate the account form
    async function fetchUserData() {
        try {
            const response = await fetch('/api/settings/user-settings/', {
                headers: {
                    'X-CSRFToken': getCsrfToken()
                }
            });
            const userData = await response.json();
            document.getElementById('email').value = userData.email;
            document.getElementById('username').value = userData.username;
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('An error occurred while fetching user data. Please try again.');
        }
    }

    accountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(accountForm);
        try {
            const response = await fetch('/api/settings/user-settings/', {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': getCsrfToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            if (response.ok) {
                alert('Account information updated successfully.');
            } else {
                throw new Error('Failed to update account information');
            }
        } catch (error) {
            console.error('Error updating account information:', error);
            alert('An error occurred while updating account information. Please try again.');
        }
    });

    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(passwordForm);
        if (formData.get('new_password') !== formData.get('confirm_password')) {
            alert('New passwords do not match.');
            return;
        }
        try {
            const response = await fetch('/api/settings/user-settings/change_password/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCsrfToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: formData.get('current_password'),
                    new_password: formData.get('new_password')
                })
            });
            if (response.ok) {
                alert('Password changed successfully.');
                passwordForm.reset();
            } else {
                throw new Error('Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred while changing the password. Please try again.');
        }
    });

    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    // Fetch user data on page load
    fetchUserData();
});