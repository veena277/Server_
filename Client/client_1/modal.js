document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("open");
  const modalContainer = document.getElementById("modal_container");
  const createEmployeeForm = document.getElementById("createEmployeeForm");
  const createButton = document.getElementById("create");
  const employeeList = document.getElementById("employeeList");
  const loginModalContainer = document.getElementById("login_modal_container");
  const loginButton = document.getElementById("login");
  const deleteButton = document.getElementById("delete");
  const deleteModalContainer = document.getElementById("delete_modal_container");
  const deleteEmployeeList = document.getElementById("deleteEmployeeList");
  const updateButton = document.getElementById("update");
  const updateModalContainer = document.getElementById("update_modal_container");
  const updateEmployeeList = document.getElementById("updateEmployeeList");

  openButton.addEventListener("click", () => {
      modalContainer.classList.add("show");
  });

  modalContainer.querySelector('.modal-content').addEventListener("click", (event) => {
      event.stopPropagation();
  });

  modalContainer.addEventListener("click", () => {
      modalContainer.classList.remove("show");
  });

  createButton.addEventListener("click", () => {
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();

      if (firstName && lastName) {
          const employeeCard = document.createElement("div");
          employeeCard.classList.add("employee-card");
          employeeCard.innerHTML = `
              <h3>${firstName} ${lastName}</h3>
              <p>Employee</p>
          `;
          employeeCard.addEventListener("click", () => {
              loginModalContainer.classList.add("show");
          });
          employeeList.appendChild(employeeCard);

          createEmployeeForm.reset();
          modalContainer.classList.remove("show");
      } else {
          alert("Please enter both first and last names.");
      }
  });

  loginModalContainer.querySelector('.modal-content').addEventListener("click", (event) => {
      event.stopPropagation();
  });

  loginModalContainer.addEventListener("click", () => {
      loginModalContainer.classList.remove("show");
  });

  loginButton.addEventListener("click", () => {
      window.location.href = "interface.html";
  });

  deleteButton.addEventListener("click", () => {
      updateDeleteEmployeeList();
      deleteModalContainer.classList.add("show");
  });

  updateButton.addEventListener("click", () => {
      updateUpdateEmployeeList();
      updateModalContainer.classList.add("show");
  });

  deleteModalContainer.querySelector('.modal-content').addEventListener("click", (event) => {
      event.stopPropagation();
  });


  deleteModalContainer.addEventListener("click", () => {
      deleteModalContainer.classList.remove("show");
  });

  
  updateModalContainer.querySelector('.modal-content').addEventListener("click", (event) => {
      event.stopPropagation();
  });

  
  updateModalContainer.addEventListener("click", () => {
      updateModalContainer.classList.remove("show");
  });

 
  function updateDeleteEmployeeList() {
      deleteEmployeeList.innerHTML = "";
      const employeeCards = document.querySelectorAll(".employee-card");
      employeeCards.forEach((card, index) => {
          const deleteItem = document.createElement("div");
          deleteItem.classList.add("delete-item");
          deleteItem.innerHTML = `
              ${card.innerHTML}
              <button class="delete-button" data-index="${index}">Delete</button>
          `;
          deleteEmployeeList.appendChild(deleteItem);
      });

      const deleteButtons = deleteEmployeeList.querySelectorAll(".delete-button");
      deleteButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
              const index = event.target.getAttribute("data-index");
              const employeeCard = document.querySelectorAll(".employee-card")[index];
              employeeCard.remove();
              updateDeleteEmployeeList(); 
          });
      });
  }

  
  function updateUpdateEmployeeList() {
      updateEmployeeList.innerHTML = "";
      const employeeCards = document.querySelectorAll(".employee-card");
      employeeCards.forEach((card, index) => {
          const updateItem = document.createElement("div");
          updateItem.classList.add("update-item");
          updateItem.innerHTML = `
              ${card.innerHTML}
              <button class="update-button" data-index="${index}">Update</button>
          `;
          updateEmployeeList.appendChild(updateItem);
      });

      
  }
});
