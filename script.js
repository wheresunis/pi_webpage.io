/* jshint esversion: 11 */



const pageTitle = document.querySelector("title");

const notificationButton = document.getElementById("notificationBtn");
let clickTimer;

notificationButton.ondblclick = () => {
    clearTimeout(clickTimer);
    
    notificationButton.classList.add("animate");

    setTimeout(() => {
        notificationButton.classList.add("show-notification");
    }, 0);

    setTimeout(() => {
        
        notificationButton.classList.remove("animate");
    }, 500); // тривалість анімації

    setTimeout(() => {
    notificationButton.classList.remove("show-notification");
    }, 1000); // 500 мс + 500 мс(тривалість анімації)
};

notificationButton.onclick = () => {
    clearTimeout(clickTimer); // очищаємо таймер, якщо є
    clickTimer = setTimeout(() => {
        window.location.assign("messages.html");
    }, 300); // чекаємо 300 мс перед виконанням
};

let editingRow = null;
const studentForm = document.getElementById("student-form");
const studentsTableBody = document.getElementById("studentsTableBody");
const selectAllCheckbox = document.querySelector("thead input[type='checkbox']");
const deleteSelectedBtn = document.createElement("button");
const studentsTable = document.getElementById("studentsTable");

if(pageTitle.textContent=="Messages") {
    notificationButton.classList.add("show-notification");
}



document.addEventListener('DOMContentLoaded', function () {
    showNotificationDropdown();
    showUserDropdown();

    if(pageTitle.textContent=="Students") {
        deleteSelectedBtn.textContent = "Delete Selected";
        deleteSelectedBtn.id = "deleteSelected";
        deleteSelectedBtn.classList.add("deleteSelectedBtn");
        deleteSelectedBtn.style.display = "none";
        
        studentsTable.insertAdjacentElement("afterend", deleteSelectedBtn);
        
        document.getElementById("addStudentBtn").addEventListener("click", function () {
            openModal("Add Student");
        });
        document.getElementById("saveEvenEmpty").addEventListener("click", function () {
            addStudent();
            closeModal();
        });
        document.getElementById("cancelStudentBtn").addEventListener("click", function () {
            this.closest(".modal").style.display = "none";
        });
        document.getElementById("cancelDeleteBtn").addEventListener("click", function () {
            this.closest(".modal").style.display = "none";
        });

        let today = new Date();
        let minYear = today.getFullYear() - 100;
        let maxYear = today.getFullYear() - 16;
        document.getElementById("studentBirthday").min = `${minYear}-01-01`;
        document.getElementById("studentBirthday").max = `${maxYear}-01-01`;

        let form = document.getElementById('student-form');
        let nameInput = document.getElementById('studentName');

        function validateInput(input, regex, errorMessage) {
            let errorSpan = document.querySelector(".error-message");
            if (!regex.test(input.value)) {
                input.classList.add('invalid');
                errorSpan.textContent = errorMessage;
                errorSpan.style.display = "inline";
                return false;
            } else {
                input.classList.remove('invalid');
                errorSpan.textContent = '';
                errorSpan.style.display = "none";
                return true;
            }
        }

        function validateForm() {
            let isNameValid = validateInput(nameInput, /^([A-ZА-ЯІЇЄҐ][a-zа-яієїґ]+\s?)*$/, "*Name can not contain digits. Name should start with an uppercase letter.");
            return isNameValid;
        }

        // Обробник відправки форми
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (validateForm()) {
                if (editingRow) {
                    saveChanges();
                } else {
                    addStudent();
                }
                form.reset(); // очищаємо поля після додавання
            }
        });

        studentsTableBody.addEventListener("click", function (event) {
            const target = event.target;
            const row = target.closest("tr");
            if (target.classList.contains("edit")) {
                if (row.querySelector("input[type='checkbox']").checked) {
                    editStudent(row);
                } else {
                    alert("Please select the row first!");
                }
            } else if (target.classList.contains("delete")) {
                if (row.querySelector("input[type='checkbox']").checked) {
                    const name = row.cells[2].textContent;
                    document.getElementById("studentToDelete").textContent = `Delete student ${name}?`;
                    document.getElementById("warningModal").style.display = "block";
                } else {
                    alert("Please select the row first!");
                }
            } else if (target.type === "checkbox") {
                updateDeleteButton();
            }
        });

        document.getElementById("deleteConfirmBtn").addEventListener("click", function () {
            const selectedRow = document.querySelector("tr input[type='checkbox']:checked")?.closest("tr");
        
            if (selectedRow) {
                selectedRow.remove(); 
                document.getElementById("warningModal").style.display = "none"; 
            }
        });

        selectAllCheckbox.addEventListener("change", function () {
            const checkboxes = studentsTableBody.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
            updateDeleteButton();
        });

        deleteSelectedBtn.addEventListener("click", function () {
            const selectedRows = studentsTableBody.querySelectorAll("input[type='checkbox']:checked");
            selectedRows.forEach(cb => cb.closest("tr").remove());
            selectAllCheckbox.checked = false;
            updateDeleteButton();
        });
    }
    
});

function updateDeleteButton() {
    const selected = studentsTableBody.querySelectorAll("input[type='checkbox']:checked").length;
    deleteSelectedBtn.style.display = selected > 1 ? "inline-block" : "none";
}

function addStudent() {
    const table = studentsTableBody;
    const row = table.insertRow();
    const checkboxCell = row.insertCell(0);
    checkboxCell.innerHTML = "<input type='checkbox' aria-label='select row' name='checkbox'>";
    checkboxCell.style.textAlign = "center";
    const groupCell = row.insertCell(1);
    groupCell.textContent = document.getElementById("studentGroup").value;
    groupCell.setAttribute("data-cell", "Group");
    const nameCell = row.insertCell(2);
    nameCell.textContent = document.getElementById("studentName").value;
    nameCell.setAttribute("data-cell", "Name");
    const genderCell = row.insertCell(3);
    genderCell.textContent = document.getElementById("studentGender").value;
    genderCell.setAttribute("data-cell", "Gender");
    const birthdayCell = row.insertCell(4);
    birthdayCell.textContent = document.getElementById("studentBirthday").value;
    birthdayCell.setAttribute("data-cell", "Birthday");
    const statusCell = row.insertCell(5);
    statusCell.style.textAlign = "center";
    statusCell.textContent = "";
    statusCell.setAttribute("data-cell", "Status");
    statusCell.innerHTML = ""; 
    
    const circle = document.createElement("div");
    circle.classList.add("circle");
    
    if (document.getElementById("studentName").value == "Maria Sokolovska") {
        circle.style.backgroundColor = "green";
    } else {
        circle.style.backgroundColor = "gray";
    }
    
    statusCell.appendChild(circle);
    const optionsCell = row.insertCell(6);
    optionsCell.style.textAlign = "center";
    optionsCell.setAttribute("data-cell", "Options");
    const optionButtonsDiv = document.createElement("div");
    optionButtonsDiv.classList.add("option-buttons");  
    
    // створення кнопки
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.setAttribute("aria-label", "edit");
    
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.setAttribute("aria-label", "delete");
    
    // додавання кнопок в div
    optionButtonsDiv.appendChild(editBtn);
    optionButtonsDiv.appendChild(deleteBtn);
    
    // додавання div з кнопками в клітинку
    optionsCell.appendChild(optionButtonsDiv);
    selectAllCheckbox.checked = false;
    updateDeleteButton();
    closeModal();
}

function openModal(title) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("saveStudent").textContent = title === "Add Student" ? "Add" : "Save Changes";
    document.getElementById("studentModal").style.display = "block";

    if (title === "Add Student") {
        clearForm();
        editingRow = null;
        document.getElementById("saveEvenEmpty").style.display = "block";
    }
    else if (title === "Edit Student") {
        document.getElementById("saveEvenEmpty").style.display = "none";
    }
}

function closeModal() {
    document.getElementById("warningModal").style.display = "none";
    document.getElementById("studentModal").style.display = "none";
    
}

function clearForm() {
    document.getElementById("studentGroup").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("studentGender").value = "";
    document.getElementById("studentBirthday").value = "";
}

function editStudent(row) {
    openModal("Edit Student");

    document.getElementById("studentGroup").value = row.cells[1].textContent;
    document.getElementById("studentName").value = row.cells[2].textContent;
    document.getElementById("studentGender").value = row.cells[3].textContent;
    document.getElementById("studentBirthday").value = row.cells[4].textContent;

    editingRow = row;
}

function saveChanges() {
    if (!editingRow) return;
    
    editingRow.cells[1].textContent = document.getElementById("studentGroup").value;
    editingRow.cells[2].textContent = document.getElementById("studentName").value;
    editingRow.cells[3].textContent = document.getElementById("studentGender").value;
    editingRow.cells[4].textContent = document.getElementById("studentBirthday").value;
    
    const statusCell = editingRow.cells[5];
    statusCell.innerHTML = "";
    const circle = document.createElement("div");
    circle.classList.add("circle");
    if(document.getElementById("studentName").value == "Maria Sokolovska")
    {
        circle.style.backgroundColor = "green";
    } else {
        circle.style.backgroundColor = "gray";
    }
    
    statusCell.appendChild(circle);

    editingRow = null;
    closeModal();
}

document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", function () {
        this.closest(".modal").style.display = "none";
    });
});

function showNotificationDropdown() {
    const dropdown = document.getElementById("notificationDropdown");
    notificationButton.addEventListener("mouseenter", function () {
        dropdown.style.display = "block";
    });

    dropdown.addEventListener("mouseenter", function () {
        dropdown.style.display = "block";
    });

    dropdown.addEventListener("mouseleave", function () {
        dropdown.style.display = "none";
    });

    notificationButton.addEventListener("mouseleave", function (event) {
        setTimeout(() => {
            if (!dropdown.matches(':hover')) {
                dropdown.style.display = "none";
            }
        }, 100); // невелика затримка
    });
};

function showUserDropdown() {
    const userProfile = document.getElementById("user-profile");
    const dropdown = document.getElementById("dropdownUserProfile");
    userProfile.addEventListener("mouseenter", function () {
        dropdown.style.display = "block";
    });
    dropdown.addEventListener("mouseenter", function () {
        dropdown.style.display = "block";
    });
    dropdown.addEventListener("mouseleave", function () {
        dropdown.style.display = "none";
    });
    userProfile.addEventListener("mouseleave", function (event) {
        setTimeout(() => {
            if (!dropdown.matches(':hover')) {
                dropdown.style.display = "none";
            }
        }, 100); // невелика затримка
    });
};

document.querySelector(".hidden-menu-button").addEventListener("click", showSidebarMenu); 
document.querySelector(".closeSidebarBtn").addEventListener("click", hideSidebarMenu); 

function showSidebarMenu()
{
    const hiddenMenu = document.querySelector('.sidebarForPhones');
    hiddenMenu.style.display = 'flex';
}

function hideSidebarMenu()
{
    const hiddenMenu = document.querySelector('.sidebarForPhones');
    hiddenMenu.style.display = 'none';
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')  // Зауваж, що шлях починається з "/"
      .then((registration) => {
        console.log('Service Worker зареєстровано:', registration);
      })
      .catch((error) => {
        console.log('Помилка при реєстрації Service Worker:', error);
      });
  });
}

    
