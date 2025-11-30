const BASE_URL = "https://portfolio-api-r1wq.onrender.com";

// ----- Tab Switching -----
const tabButtons = document.querySelectorAll(".tab-btn");
const sections = {
  projects: document.getElementById("projects-section"),
  skills: document.getElementById("skills-section")
};

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    Object.values(sections).forEach(sec => sec.classList.add("hidden"));
    sections[tab].classList.remove("hidden");

    tabButtons.forEach(b => b.classList.remove("bg-blue-600", "text-white"));
    tabButtons.forEach(b => b.classList.add("bg-blue-100", "text-blue-700"));
    btn.classList.add("bg-blue-600", "text-white");
    btn.classList.remove("bg-blue-100", "text-blue-700");
  });
});

// ----- Projects CRUD -----
const addForm = document.getElementById('add-form');
const projectsContainer = document.getElementById('projects-container');

const editProjectModal = document.getElementById('edit-project-modal');
const editProjectForm = document.getElementById('edit-project-form');
const closeProjectModal = document.getElementById('close-project-modal');

const deleteModal = document.getElementById('delete-modal');
const deleteMessage = document.getElementById('delete-message');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

let deleteCallback = null;

// Load Projects
async function loadProjects() {
  const res = await fetch(`${BASE_URL}/api/projects`);
  const projects = await res.json();
  projectsContainer.innerHTML = '';
  projects.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col gap-2';
    div.innerHTML = `
      <h3 class="text-lg font-bold text-gray-800">${p.title}</h3>
      <p class="text-gray-600">${p.description}</p>
      <a href="${p.link}" target="_blank" class="text-blue-600 hover:underline">${p.link}</a>
      ${p.image ? `<img src="${BASE_URL}${p.image}" alt="${p.title}" class="mt-2 rounded-md max-h-40 object-cover">` : ''}
      <div class="flex gap-2 mt-2">
        <button onclick="openEditProject('${p._id}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
        <button onclick="confirmDelete(() => deleteProject('${p._id}'), 'Delete this project?')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
      </div>
    `;
    projectsContainer.appendChild(div);
  });
}

// Edit Project
window.openEditProject = async id => {
  const res = await fetch(`${BASE_URL}/api/projects`);
  const projects = await res.json();
  const p = projects.find(pr => pr._id === id);
  if (!p) return;

  editProjectForm.id.value = p._id;
  editProjectForm.title.value = p.title;
  editProjectForm.description.value = p.description;
  editProjectForm.link.value = p.link;

  editProjectModal.classList.remove('hidden');
};

closeProjectModal.addEventListener('click', () => editProjectModal.classList.add('hidden'));

editProjectForm.addEventListener('submit', async e => {
  e.preventDefault();
  const id = editProjectForm.id.value;
  const formData = new FormData(editProjectForm);
  await fetch(`${BASE_URL}/api/projects/${id}`, { method: 'PUT', body: formData });
  editProjectModal.classList.add('hidden');
  loadProjects();
});

addForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(addForm);
  await fetch(`${BASE_URL}/api/projects`, { method: 'POST', body: formData });
  addForm.reset();
  loadProjects();
});

async function deleteProject(id) {
  await fetch(`${BASE_URL}/api/projects/${id}`, { method: 'DELETE' });
  closeDeleteModal();
  loadProjects();
}

// ----- Skills CRUD -----
const skillsForm = document.getElementById('add-skill-form');
const skillsContainer = document.getElementById('skills-container');

const editSkillModal = document.getElementById('edit-skill-modal');
const editSkillForm = document.getElementById('edit-skill-form');
const closeSkillModal = document.getElementById('close-skill-modal');

async function loadSkills() {
  const res = await fetch(`${BASE_URL}/api/skills`);
  const skills = await res.json();
  skillsContainer.innerHTML = '';
  skills.forEach(s => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col gap-2';
    div.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="font-bold text-gray-800">${s.name}</span>
        <span class="text-gray-500 text-sm">${s.level}%</span>
      </div>
      <p class="text-gray-600">Icon: ${s.icon}</p>
      <div class="flex gap-2 mt-2">
        <button onclick="openEditSkill('${s._id}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
        <button onclick="confirmDelete(() => deleteSkill('${s._id}'), 'Delete this skill?')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
      </div>
    `;
    skillsContainer.appendChild(div);
  });
}

// Edit Skill
window.openEditSkill = async id => {
  const res = await fetch(`${BASE_URL}/api/skills`);
  const skills = await res.json();
  const s = skills.find(sk => sk._id === id);
  if (!s) return;

  editSkillForm.id.value = s._id;
  editSkillForm.name.value = s.name;
  editSkillForm.level.value = s.level;
  editSkillForm.icon.value = s.icon;

  editSkillModal.classList.remove('hidden');
};

closeSkillModal.addEventListener('click', () => editSkillModal.classList.add('hidden'));

editSkillForm.addEventListener('submit', async e => {
  e.preventDefault();
  const id = editSkillForm.id.value;
  const skill = {
    name: editSkillForm.name.value,
    level: Number(editSkillForm.level.value),
    icon: editSkillForm.icon.value
  };
  await fetch(`${BASE_URL}/api/skills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill)
  });
  editSkillModal.classList.add('hidden');
  loadSkills();
});

// Add Skill
skillsForm.addEventListener('submit', async e => {
  e.preventDefault();
  const skill = {
    name: skillsForm.name.value,
    level: Number(skillsForm.level.value),
    icon: skillsForm.icon.value
  };

  await fetch(`${BASE_URL}/api/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill)
  });

  skillsForm.reset();
  loadSkills();
});

async function deleteSkill(id) {
  await fetch(`${BASE_URL}/api/skills/${id}`, { method: 'DELETE' });
  closeDeleteModal();
  loadSkills();
}

// ----- Delete Modal Logic -----
function confirmDelete(callback, message) {
  deleteCallback = callback;
  deleteMessage.textContent = message;
  deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  deleteCallback = null;
}

confirmDeleteBtn.addEventListener('click', () => {
  if (deleteCallback) deleteCallback();
});

cancelDeleteBtn.addEventListener('click', closeDeleteModal);

// Initial Load
loadProjects();
loadSkills();
