// static/js/leaderboards.js
document.addEventListener('DOMContentLoaded', () => {
    const leaderboardsTable = document.getElementById('leaderboards-table');

    async function fetchLeaderboards() {
        try {
            const response = await fetch('/api/developer/leaderboards/', {
                headers: {
                    'X-CSRFToken': getCsrfToken()
                }
            });
            const data = await response.json();
            renderLeaderboards(data);
        } catch (error) {
            console.error('Error fetching leaderboards:', error);
            alert('An error occurred while fetching the leaderboards. Please try again.');
        }
    }

    function renderLeaderboards(models) {
        const table = `
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Performance</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    ${models.map((model, index) => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${index + 1}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${model.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${(model.performance * 100).toFixed(2)}%</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(model.status)}">
                                    ${model.status}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="useModel(${model.id})" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2">Use</button>
                                <button onclick="editModel(${model.id})" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2">Edit</button>
                                <button onclick="removeModel(${model.id})" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Remove</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        leaderboardsTable.innerHTML = table;
    }

    function getStatusColor(status) {
        switch (status) {
            case 'production':
                return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            case 'beta':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
            case 'alpha':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
        }
    }

    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    window.useModel = async function(modelId) {
        try {
            const response = await fetch(`/api/developer/models/${modelId}/use/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCsrfToken(),
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                alert('Model is now in use.');
                fetchLeaderboards(); // Refresh the leaderboard
            } else {
                throw new Error('Failed to use model');
            }
        } catch (error) {
            console.error('Error using model:', error);
            alert('An error occurred while trying to use the model. Please try again.');
        }
    }

    window.editModel = function(modelId) {
        // Redirect to model editor page with the selected model
        window.location.href = `/model-editor/?model=${modelId}`;
    }

    window.removeModel = async function(modelId) {
        if (confirm('Are you sure you want to remove this model?')) {
            try {
                const response = await fetch(`/api/developer/models/${modelId}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCsrfToken()
                    }
                });
                if (response.ok) {
                    alert('Model removed successfully.');
                    fetchLeaderboards(); // Refresh the leaderboard
                } else {
                    throw new Error('Failed to remove model');
                }
            } catch (error) {
                console.error('Error removing model:', error);
                alert('An error occurred while trying to remove the model. Please try again.');
            }
        }
    }

    // Initial load of leaderboards
    fetchLeaderboards();
});