document.addEventListener("DOMContentLoaded", () => {
    // Modal and Form Elements
    const modal = document.getElementById('ticketDetailsModal');
    const modalFullName = document.getElementById('modalFullName');
    const modalDepartment = document.getElementById('modalDepartment');
    const modalLocation = document.getElementById('modalLocation');
    const modalDescription = document.getElementById('modalDescription');
    const priorityLevel = document.getElementById('priorityLevel');
    const closeModalBtn = document.getElementById('closeModal');
    const confirmTicketBtn = document.getElementById('confirmTicket');
    const submitTicketBtn = document.getElementById('submitTicket');
    const addTicketForm = document.querySelector('#createTicketForm');
    const ticketSummaryTable = document.getElementById('ticketSummaryTable');

    // Handle form submission and show modal
    submitTicketBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission
            document.getElementById('priorityLevel').disabled=true;
        const fullName = addTicketForm.querySelector('#fullName').value.trim();
        const department = addTicketForm.querySelector('#ticketTitle').value.trim();
        const location = addTicketForm.querySelector('#ticketLocation').value.trim();
        const description = addTicketForm.querySelector('#ticketDescription').value.trim();
        const errorMessages = [];

        // Form Validation
        if (fullName === "") errorMessages.push("Full Name is required.");
        if (department === "") errorMessages.push("Department/Office is required.");
        if (location === "") errorMessages.push("Location is required.");
        if (description === "") errorMessages.push("Details of the Concern are required.");

        if (errorMessages.length > 0) {
            alert(errorMessages.join("\n")); // Show validation errors
        } else {
            // Populate Modal with Form Data
            modalFullName.textContent = fullName;
            modalDepartment.textContent = department;
            modalLocation.textContent = location;
            modalDescription.textContent = description;

            // Simulate AI categorization for the concern (this could be dynamic in a real application)
            const categories = ["Network Issue", "Software Issue", "Hardware Issue", "Other"];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            document.getElementById('modalConcernCategory').textContent = randomCategory;

            // Show the Modal and hide the form
            addTicketForm.style.display = 'none';
            modal.style.display = 'flex';
        }
    });

    // Confirm Ticket Submission
    confirmTicketBtn.addEventListener('click', () => {
        const priority = priorityLevel.value;
        const newTicket = {
            fullName: modalFullName.textContent,
            department: modalDepartment.textContent,
            location: modalLocation.textContent,
            description: modalDescription.textContent,
            priority: priority,
        };

        // Simulate ticket submission (replace with server-side code if needed)
        alert(`Ticket submitted successfully!\nPriority: ${priority}`);

        // Add the ticket to the ticket summary table
        const ticketRow = document.createElement('tr');
        ticketRow.innerHTML = `
            <td>001</td>
            <td>${newTicket.fullName}</td>
            <td>${newTicket.department}</td>
            <td>${newTicket.location}</td>
            <td>${newTicket.description}</td>
        `;
        ticketSummaryTable.appendChild(ticketRow);

        // Close the modal and reset the form
        modal.style.display = 'none';
        addTicketForm.reset();
        addTicketForm.style.display = 'block';
    });

    // Cancel Ticket Submission (close modal)
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        addTicketForm.style.display = 'block';
    });

    // Toggle Sidebar
    const sidebarToggleButton = document.getElementById('sidebarToggleButton');
    sidebarToggleButton.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('collapsed');
    });

    // Logout functionality
    const logoutButton = document.getElementById('logoutbtn');
    logoutButton.addEventListener('click', () => {
        // Log out the user by redirecting to the login page
        window.location.href = 'midtermsLogin.html';
    });

    // Section navigation
    const sectionLinks = document.querySelectorAll('nav ul li');
    sectionLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sectionName = link.getAttribute('data-section');
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionName).classList.add('active');
            // Highlight active section link
            sectionLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
