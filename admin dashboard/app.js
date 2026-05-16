// API Configuration
const API_BASE_URL = 'https://goldsmith-verbalize-fridge.ngrok-free.dev/api';

// Initialize Lucide Icons
lucide.createIcons();

// State management
let providers = [];
let users = [];
let missions = [];
let stats = {
    totalUsers: 0,
    totalClients: 0,
    totalProviders: 0,
    totalMissions: 0,
    pendingApprovals: 0,
    activeMissions: 0
};
let selectedProviderId = null;
let selectedProviderSource = null;

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    fetchPrestataires();
    fetchMissions();
    fetchUsers();
});

// Fetch Statistics for Dashboard
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        stats = await response.json();
        updateStatsUI();
    } catch (err) {
        console.error('Error fetching stats:', err);
    }
}

function updateStatsUI() {
    // Update the numbers in the dashboard boxes using specific IDs
    const totalUsersEl = document.getElementById('stat-total-users');
    const totalClientsEl = document.getElementById('stat-total-clients');
    const totalProvidersEl = document.getElementById('stat-total-providers');
    const totalMissionsEl = document.getElementById('stat-total-missions');
    const activeMissionsEl = document.getElementById('stat-active-missions');

    if (totalUsersEl) totalUsersEl.innerText = (stats.totalUsers || 0).toLocaleString();
    if (totalClientsEl) totalClientsEl.innerText = (stats.totalClients || 0).toLocaleString();
    if (totalProvidersEl) totalProvidersEl.innerText = (stats.totalProviders || 0).toLocaleString();
    if (totalMissionsEl) totalMissionsEl.innerText = (stats.totalMissions || 0).toLocaleString();
    if (activeMissionsEl) activeMissionsEl.innerText = `${stats.activeMissions || 0} actuellement actives`;

    const badge = document.getElementById('prestataires-count');
    if (badge) {
        badge.innerText = (stats.pendingApprovals || 0).toLocaleString();
        badge.style.display = (stats.pendingApprovals || 0) > 0 ? 'block' : 'none';
    }
}

// Tab Switching Logic
async function switchTab(tabName) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    // Show selected content
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    // Add active class to clicked nav
    document.getElementById(`nav-${tabName}`).classList.add('active');
    
    // Update Header
    const titles = {
        dashboard: "Vue d'ensemble",
        prestataires: "Tous les Prestataires",
        users: "Gestion des Utilisateurs",
        missions: "Contrôle des Missions"
    };
    document.getElementById('page-title').innerText = titles[tabName];

    // Fetch data based on tab
    if (tabName === 'dashboard') fetchStats();
    if (tabName === 'prestataires') fetchPrestataires();
    if (tabName === 'users') fetchUsers();
    if (tabName === 'missions') fetchMissions();
}

// Fetch all prestataires from the table
async function fetchPrestataires() {
    try {
        const response = await fetch(`${API_BASE_URL}/prestataires`);
        providers = await response.json();
        renderPrestataires();
        updateStatsUI();
        renderRecentActivity();
    } catch (err) {
        console.error('Erreur lors de la récupération des prestataires:', err);
    }
}

// Render prestataires table
function renderPrestataires() {
    const tableBody = document.getElementById('prestataires-table-body');
    if (!tableBody) return;

    const searchInput = document.getElementById('prestataire-search');
    const searchValue = (searchInput?.value || '').toLowerCase();

    const filtered = providers.filter((provider) => {
        const nom = (provider.nom || '').toLowerCase();
        const metier = (provider.metier || '').toLowerCase();
        const telephone = (provider.telephone || '').toLowerCase();
        return nom.includes(searchValue) || metier.includes(searchValue) || telephone.includes(searchValue);
    });

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="p-8 text-center text-gray-500 italic">Aucun prestataire trouvé.</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(provider => {
        const row = document.createElement('tr');
        row.className = "border-b border-gray-50 hover:bg-gray-50 transition-colors";
        row.innerHTML = `
            <td class="p-4">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold uppercase">
                        ${(provider.nom || '?').slice(0, 1)}
                    </div>
                    <div>
                        <div class="font-semibold text-gray-800">${provider.nom || 'Sans nom'}</div>
                    </div>
                </div>
            </td>
            <td class="p-4">
                <span class="px-2 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600">
                    ${provider.metier || 'Non spécifié'}
                </span>
            </td>
            <td class="p-4">
                <a href="tel:${provider.telephone || ''}" class="text-sm font-medium text-gray-700 hover:text-blue-600">${provider.telephone || ''}</a>
            </td>
            <td class="p-4 text-sm text-gray-500">
                ${provider.created_at ? new Date(provider.created_at).toLocaleDateString('fr-FR') : ''}
            </td>
            <td class="p-4">
                <button onclick="openReviewModal('${provider.source || 'prestataires'}', ${provider.id})" class="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                    Voir infos
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    lucide.createIcons();
}

function renderRecentActivity() {
    const recentProvidersEl = document.getElementById('dashboard-recent-prestataires');
    const recentMissionsEl = document.getElementById('dashboard-recent-missions');

    if (recentProvidersEl && providers.length > 0) {
        const sorted = [...providers].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 5);
        recentProvidersEl.innerHTML = sorted.map(p => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                    <p class="font-semibold text-gray-800 text-sm">${p.nom || 'Sans nom'}</p>
                    <p class="text-xs text-gray-500">${p.metier || 'Expert'}</p>
                </div>
                <span class="text-xs text-gray-400">${p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : ''}</span>
            </div>
        `).join('');
    }

    if (recentMissionsEl && missions.length > 0) {
        const sorted = [...missions].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 5);
        recentMissionsEl.innerHTML = sorted.map(m => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                    <p class="font-semibold text-gray-800 text-sm">${m.title || 'Mission'}</p>
                    <p class="text-xs text-gray-500">${m.client_name || 'Client'} → ${m.provider_name || 'Prestataire'}</p>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${m.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} uppercase">
                    ${m.status || 'active'}
                </span>
            </div>
        `).join('');
    }
}

// Modal Functions
function openReviewModal(source, id) {
    const provider = providers.find(p => p.id === id && p.source === source) || providers.find(p => p.id === id);
    if (!provider) return;

    selectedProviderId = id;
    selectedProviderSource = source || provider.source || null;
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
        <div class="md:col-span-2 space-y-6">
            <div class="space-y-3">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Infos du prestataire</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500">Nom Complet</p>
                        <p class="font-medium text-gray-900">${provider.nom || 'Sans nom'}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500">Métier</p>
                        <p class="font-medium text-gray-900">${provider.metier || 'Non spécifié'}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500">Statut</p>
                        <p class="font-medium text-gray-900">${provider.status || 'pending'}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500">Téléphone</p>
                        <p class="font-medium text-gray-900">${provider.telephone || ''}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500">Email</p>
                        <p class="font-medium text-gray-900">${provider.email || 'Non renseigné'}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl">
                        <p class="text-xs text-gray-500">Date d'inscription</p>
                        <p class="font-medium text-gray-900">${provider.created_at ? new Date(provider.created_at).toLocaleString('fr-FR') : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('approval-modal').classList.remove('hidden');
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('approval-modal').classList.add('hidden');
    selectedProviderId = null;
    selectedProviderSource = null;
}

async function setPrestataireStatus(status) {
    if (!selectedProviderId) return;

    let reason = '';
    if (status === 'rejected' || status === 'suspended') {
        const label = status === 'rejected' ? 'motif du rejet' : 'motif de la suspension';
        reason = window.prompt(`Entrez le ${label} :`, '') || '';
        if (status === 'rejected' && !reason.trim()) {
            alert('Le motif du rejet est requis.');
            return;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/prestataires/${selectedProviderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, reason, source: selectedProviderSource }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erreur lors de la mise à jour');
        }

        alert('Statut mis à jour avec succès');
        closeModal();
        await fetchPrestataires();
        await fetchStats();
    } catch (err) {
        console.error('Erreur lors de la mise à jour du statut:', err);
        alert(err.message || 'Erreur lors de la mise à jour');
    }
}

// --- Fetch Users ---
async function fetchUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        users = await response.json();
        renderUsers();
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
    }
}

function renderUsers() {
    const container = document.getElementById('users-table-container');
    const searchInput = document.getElementById('user-search');
    const roleFilterEl = document.getElementById('user-role-filter');
    
    if (!container || !searchInput || !roleFilterEl) return;

    const searchVal = searchInput.value.toLowerCase();
    const roleFilter = roleFilterEl.value;

    let filteredUsers = users.filter(user => {
        const matchesSearch = 
            (user.name && user.name.toLowerCase().includes(searchVal)) ||
            (user.email && user.email.toLowerCase().includes(searchVal)) ||
            (user.phone && user.phone.toLowerCase().includes(searchVal));
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    if (filteredUsers.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 italic">
                Aucun utilisateur trouvé correspondant à vos critères.
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Utilisateur</th>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Rôle</th>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Téléphone</th>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Inscrit le</th>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredUsers.map(user => `
                        <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td class="p-4">
                                <div class="font-semibold text-gray-800">${user.name || 'Sans nom'}</div>
                                <div class="text-xs text-gray-500">${user.email || ''}</div>
                            </td>
                            <td class="p-4">
                                <span class="px-2 py-1 rounded-full text-xs font-bold ${user.role === 'provider' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}">
                                    ${user.role === 'provider' ? 'PRESTATAIRE' : 'CLIENT'}
                                </span>
                            </td>
                            <td class="p-4 text-sm text-gray-600">${user.phone}</td>
                            <td class="p-4 text-sm text-gray-500">${new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                            <td class="p-4">
                                <button onclick="deleteUser(${user.id})" class="text-red-500 hover:text-red-700 font-medium text-sm mr-3">Supprimer</button>
                                <button class="text-orange-500 hover:text-orange-700 font-medium text-sm">Suspendre</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function deleteUser(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Utilisateur supprimé avec succès');
            fetchUsers();
            fetchStats();
        } else {
            alert('Échec de la suppression');
        }
    } catch (err) {
        console.error('Erreur lors de la suppression:', err);
    }
}

function exportUsersToCSV() {
    const searchVal = document.getElementById('user-search').value.toLowerCase();
    const roleFilter = document.getElementById('user-role-filter').value;

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            (user.name && user.name.toLowerCase().includes(searchVal)) ||
            (user.email && user.email.toLowerCase().includes(searchVal)) ||
            (user.phone && user.phone.toLowerCase().includes(searchVal));
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const csvRows = [['Nom', 'Rôle', 'Téléphone', 'Email', 'Date Inscription'].join(',')];
    for (const user of filteredUsers) {
        csvRows.push([
            user.name || 'Sans nom',
            user.role,
            user.phone,
            user.email || '',
            new Date(user.created_at).toLocaleDateString()
        ].join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'utilisateurs_bricol_clic.csv');
    a.click();
}

// --- Fetch Missions ---
async function fetchMissions() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/missions`);
        missions = await response.json();
        renderMissions();
        renderRecentActivity();
    } catch (err) {
        console.error('Erreur lors de la récupération des missions:', err);
    }
}

function renderMissions() {
    const container = document.getElementById('tab-missions');
    if (!container) return;
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Mission</th>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Client</th>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Prestataire</th>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Statut</th>
                        <th class="p-4 text-sm font-semibold text-gray-600 uppercase">Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${missions.map(m => {
                        const statusColors = {
                            completed: 'bg-green-50 text-green-600',
                            pending: 'bg-orange-50 text-orange-600',
                            active: 'bg-blue-50 text-blue-700'
                        };
                        const statusLabels = {
                            completed: 'TERMINÉ',
                            pending: 'EN ATTENTE',
                            active: 'EN COURS'
                        };
                        return `
                            <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td class="p-4 font-medium text-gray-800">${m.title}</td>
                                <td class="p-4 text-sm text-gray-600">${m.client_name || 'Inconnu'}</td>
                                <td class="p-4 text-sm text-gray-600">${m.provider_name || 'Inconnu'}</td>
                                <td class="p-4">
                                    <span class="px-2 py-1 rounded-full text-xs font-bold ${statusColors[m.status] || 'bg-gray-50 text-gray-600'}">
                                        ${statusLabels[m.status] || m.status.toUpperCase()}
                                    </span>
                                </td>
                                <td class="p-4 text-sm text-gray-500">${new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('approval-modal');
    if (event.target == modal) {
        closeModal();
    }
}
