window.onload = function() {
    getdata();
};
function getdata(){
    // Access the data attributes from the HTML element
    var userData = document.getElementById("userData");
    var username = userData.getAttribute("data-username");
    var email = userData.getAttribute("data-email");
    var role = userData.getAttribute("data-role");
    var fullname = userData.getAttribute("data-fullname");
    var contactnumber = userData.getAttribute("data-contactnumber");
    var birthdate = userData.getAttribute("data-birthdate");
    var gender = userData.getAttribute("data-gender");
    var department = userData.getAttribute("data-department");
    var departPosition = userData.getAttribute("data-departPosition");
    var password = userData.getAttribute("data-password");
    var dstatus = userData.getAttribute("data-status");

    document.getElementById('profile-fullname').value = fullname;
    document.getElementById('profile-email').value = email;
    document.getElementById('profile-contact').value = contactnumber;
    document.getElementById('profile-username').value = username;
    document.getElementById('profile-department').value = department;
    document.getElementById('profile-position').value = departPosition;
    document.getElementById('profile-g').value = gender;
    document.getElementById('profile-birthdate').value = birthdate;

    // Display the username and email on the page
    document.getElementById("emailText").innerText = email;
    document.getElementById("adminText").innerText = role;

    if(role == "Staff"){
        const accountsSB = document.getElementById('accountsSB');
        const dashboardSB = document.querySelectorAll('.active');
        if (accountsSB && dashboardSB) {
            accountsSB.remove();
            dashboardSB.remove();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Light/Dark Mode Toggle
    const modeToggle = document.getElementById('modeToggle'); // Assume a toggle element exists
    const body = document.body;

    // Check saved preference from localStorage
    const savedMode = localStorage.getItem('theme');
    if (savedMode) {
        body.classList.toggle('dark-mode', savedMode === 'dark');
    }

    // Add event listener to toggle button
    if (modeToggle) {
        modeToggle.addEventListener('change', (event) => {
            const isDarkMode = event.target.checked;
            body.classList.toggle('dark-mode', isDarkMode);
            
            // Save user preference to localStorage
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }

    // Sidebar Toggle Functionality
    const sidebarToggleButton = document.getElementById('sidebarToggleButton');  
    const sidebar = document.querySelector('.sidebar');  
    const sidebarreturn = document.querySelectorAll('#sidebarleftbtn, #sidebarleftbtn-tickets, #sidebarleftbtn-reports, #sidebarleftbtn-accounts, #sidebarleftbtn-profile');  
    const sidebarmove = document.querySelectorAll('#sidebarleftbtn, #sidebarleftbtn-tickets, #sidebarleftbtn-reports, #sidebarleftbtn-accounts, #sidebarleftbtn-profile');   
    if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('minimized');
            setTimeout(() => {
                sidebarmove.forEach(buttonm => {
                    buttonm.style.display = "block"; // Hide after a delay
                });
            }, 900); 
        });
    }

    sidebarreturn.forEach(button => {
        button.addEventListener('click', () => {
            sidebar.classList.remove('minimized');
            setTimeout(() => {
                button.style.display = "none"; // Hide after a delay
            }, 700);
        });
    });

    const ticketsmenu = document.querySelectorAll('#ticketsSB, #reportsSB, #accountsSB, #profileSB'); 
    ticketsmenu.forEach(buttonA => {
        buttonA.addEventListener('click', () => {
            sidebarmove.forEach(buttonB => {
                    buttonB.style.display = "none"; // Hide after a delay
                });
        });
    });
 
    //Logout
    document.getElementById('logoutbtn').addEventListener('click', () => {
        window.location.href = 'midtermsLogin.html';
    });
    // edit profile
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileFields = [
        document.getElementById('profile-fullname'),
        document.getElementById('profile-email'),
        document.getElementById('profile-contact'),
        document.getElementById('profile-username'),
        document.getElementById('profile-department'),
        document.getElementById('profile-position'),
        document.getElementById('profile-g'),
        document.getElementById('profile-birthdate')

    ];

function toggleEdit() {
    profileFields.forEach(field => {
        field.readOnly = !field.readOnly;  
    });
    document.getElementById('profile-g').style.backgroundColor = "#fff";
    document.getElementById('profile-g').style.cursor = "pointer";
    document.getElementById('profile-g').style.color = "black";
    if (editProfileBtn.textContent === 'Edit Profile') {
        editProfileBtn.textContent = 'Save Profile';
    } else {
        editProfileBtn.textContent = 'Edit Profile';
        document.getElementById('profile-g').style.backgroundColor = "#e9ecef";
        document.getElementById('profile-g').style.cursor = "not-allowed";
        document.getElementById('profile-g').style.color = "#6c757d";
    }
}

    editProfileBtn.addEventListener('click', toggleEdit);

    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.sidebar nav ul li');

    const resetActiveClasses = () => {
        sections.forEach(section => section.classList.remove('active'));
        menuItems.forEach(item => item.classList.remove('active'));
    };

    const initializeDashboard = () => {
        const dashboardSection = document.getElementById('dashboard');
        const ticketStatusSection = document.getElementById('ticketStatus');
        const dashboardMenuItem = document.querySelector('.sidebar nav ul li[data-section="dashboard"]');

        if (dashboardSection && ticketStatusSection && dashboardMenuItem) {
            resetActiveClasses();
            dashboardSection.classList.add('active');
            ticketStatusSection.classList.add('active');
            dashboardMenuItem.classList.add('active');
        }
    };

    initializeDashboard();

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            const selectedSection = document.getElementById(sectionId);
            resetActiveClasses();

            if (selectedSection) selectedSection.classList.add('active');
            item.classList.add('active');

            const ticketStatusSection = document.getElementById('ticketStatus');
            if (sectionId === 'dashboard') {
                ticketStatusSection.classList.add('active');
            } else {
                ticketStatusSection.classList.remove('active');
            }

            console.log(`Switched to section: ${sectionId}`);
        });
    });

    // Ticket Section Logic
    const ticketTabs = document.querySelectorAll('.status-tab');
    const ticketsTableBody = document.getElementById('ticketsTableBody');
    const ticketDetails = document.getElementById('ticketDetailsModal');
    const reportdetailsb = document.getElementById('reportDetails');
    let selectedRow = null;

    const filterTickets = (status) => {
        const rows = ticketsTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const rowStatus = row.querySelector('td:last-child').textContent.trim();
            row.style.display = (status === 'all' || rowStatus.toLowerCase() === status.toLowerCase()) ? '' : 'none';
        });
    };

    ticketTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            ticketTabs.forEach(tab => tab.classList.remove('active'));
            tab.classList.add('active');
            filterTickets(tab.dataset.status);
        });
    });
    // Event listener for ticket details and status update
    let savedStatus;
    ticketsTableBody.addEventListener("click", function (e) {
        const row = e.target.closest("tr");
        if (row) {
            
            selectedRow = row; // Store the selected row
            const requester = row.cells[2].innerText;
            const department = row.cells[4].innerText;
            const dateTime = row.cells[1].innerText;
            const priority = row.cells[5].innerText;
            const status = row.cells[6].innerText;

            document.getElementById("detailRequester").innerText = requester;
            document.getElementById("detailDepartment").innerText = department;
            document.getElementById("detailDateTime").innerText = dateTime;
            document.getElementById("detailPriority").innerText = priority;
            document.getElementById("detailDescription").value = "Description for ticket ID " + row.dataset.id;
            document.getElementById("statusSelect").value = status.toLowerCase();
            savedStatus = status;
            updatestat();
            ticketDetails.classList.remove("hidden");
        }
    });

    document.getElementById("closebtna").addEventListener("click", function () {
        const statusSelect = document.getElementById('statusSelect');
        const updatebtn = document.getElementById('updateStatusButton');
        statusSelect.disabled = false;
        updatebtn.disabled = false;
        ticketDetails.classList.add("hidden");
    });
    document.getElementById("closebtnb").addEventListener("click", function () {
        reportdetailsb.classList.add("hidden");
    });

function updatestat(){
    //filtering options
    if(savedStatus){
        const statusSelect = document.getElementById('statusSelect');
        const updatebtn = document.getElementById('updateStatusButton');
        if(savedStatus == "In Progress"){
            const optionToRemove = statusSelect.querySelector('option[value="new"]');

            if (optionToRemove) {
                optionToRemove.remove();
            }
        }else if(savedStatus == "Closed"){
            statusSelect.disabled = true;
            updatebtn.disabled = true;
            if (updatebtn.disabled) {
                updatebtn.style.pointerEvents = 'none';  
                updatebtn.style.cursor = 'not-allowed';  
            
                updatebtn.style.transition = 'none';  
            }
        }else{}
    }else{
        alert("walang laman");
    }
}


    document.getElementById("updateStatusButton").addEventListener("click", function () {
        if (selectedRow) {
            const newStatus = document.getElementById("statusSelect").value;
            selectedRow.cells[6].innerText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
            ticketDetails.classList.add("hidden");
        }
    });

    filterTickets('all');

    // Reports Section Logic
        const reportsTableBody = document.getElementById('reportsTableBody');
        const reportDetails = document.getElementById('reportDetails');


        // Show Report Details
        if (reportsTableBody) {
            reportsTableBody.addEventListener('click', event => {
                const row = event.target.closest('tr');
                if (row) {
                    const ticket = closedTickets.find(t => t.id == row.dataset.ticketId);
                    if (ticket) {
                        document.getElementById('reportRequester').textContent = ticket.requester;
                        document.getElementById('reportDepartment').textContent = ticket.department;
                        document.getElementById('detailDescription').value = ticket.description;
                        reportDetails.classList.remove('hidden');
                    }
                }
            });
        }

    // Close Report Details
    // const closeReportDetailsButton = document.getElementById('closeDetails');
    // if (closeReportDetailsButton) {
    //     closeReportDetailsButton.addEventListener('click', () => {
    //         reportDetails.classList.add('hidden');
    //     });
    // }

    // Charts Initialization
    const initCharts = () => {
        const createChart = (ctx, type, data, options) => new Chart(ctx, { type, data, options });

        const ticketStatusChart = document.getElementById('ticketStatusChart').getContext('2d');
        createChart(ticketStatusChart, 'pie', {
            labels: ['New', 'In Progress', 'Closed'],
            datasets: [{ data: [5, 5, 15], backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'] }]
        });

        const ticketHistoryChart = document.getElementById('ticketHistoryChart').getContext('2d');
        createChart(ticketHistoryChart, 'line', {
            labels: ['Nov 1', 'Nov 7', 'Nov 14', 'Nov 21'],
            datasets: [{ label: 'Tickets', data: [5, 8, 12, 15], backgroundColor: 'rgba(0, 123, 255, 0.5)', borderColor: '#007bff', fill: true }]
        });

        const ticketCategoryChart = document.getElementById('ticketCategoryChart').getContext('2d');
        createChart(ticketCategoryChart, 'pie', {
            labels: ['Network', 'Printer', 'Computer', 'Moodle', 'Database'],
            datasets: [{ data: [8, 6, 5, 4, 2], backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'] }]
        });

        const priorityChart = document.getElementById('priorityChart').getContext('2d');
        createChart(priorityChart, 'bar', {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{ label: 'Tickets by Priority', data: [10, 15, 25], backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 205, 86, 0.6)', 'rgba(255, 159, 64, 0.6)'] }]
        }, {
            plugins: { legend: { display: true, position: 'top' } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Number of Tickets' } }, x: { title: { display: true, text: 'Priority Levels' } } }
        });
    };

    initCharts();

    if (savedMode === 'dark') {
        modeToggle.checked = true;
    }
});

// Profile Edit Logic
// const editProfileButton = document.getElementById('editProfileButton');
// const manageProfileSection = document.getElementById('manageProfileSection');

// // Add an event listener to the edit button to toggle the manage profile section
// editProfileButton.addEventListener('click', () => {
//     // Toggle the visibility of the manage profile section
//     manageProfileSection.classList.toggle('hidden');
// });
// JavaScript for toggling the sidebar
const toggleButton = document.getElementById("sidebarToggleButton");
const sidebar = document.querySelector(".sidebar");

toggleButton.addEventListener("click", function() {
    sidebar.classList.toggle("collapsed");
});


const notificationArea = document.getElementById('notificationArea');
const notificationPopup = document.getElementById('notificationPopup');

if (notificationArea && notificationPopup) {
    notificationArea.addEventListener('click', () => {
        // Toggle the 'hidden' class to show or hide the notification popup
        notificationPopup.classList.toggle('hidden');
    });
}

// document.addEventListener('DOMContentLoaded', function() {
//     const profileImage = document.getElementById('profileImage');
//     // const profilePictureInput = document.getElementById('profilePicture');
//     const imagePreview = document.getElementById('imagePreview');

//     // profilePictureInput.addEventListener('change', function(event) {
//     //     const file = event.target.files[0];  // Get the uploaded file

//     //     if (file) {
//     //         const reader = new FileReader();

//     //         // When the file is successfully read
//     //         reader.onload = function(e) {
//     //             const imageUrl = e.target.result;  // The base64 URL of the image

//     //             // Update the profile image with the new image
//     //             profileImage.src = imageUrl;  // Change the profile image
//     //             imagePreview.src = imageUrl;  // Show the preview image
//     //             imagePreview.style.display = 'block';  // Display the preview
//     //         };

//     //         // Read the file as a data URL
//     //         reader.readAsDataURL(file);
//     //     }
//     // });
// });
 // Save the profile picture and update the UI
//  saveProfileButton.addEventListener('click', function() {
//     const file = profilePictureInput.files[0];  // Get the uploaded file

//     if (file) {
//         const reader = new FileReader();

//         reader.onload = function(e) {
//             const imageUrl = e.target.result;  // Base64 URL of the image

//             // Update the profile image
//             profileImage.src = imageUrl;

//             // Optionally, you can save the image to a server here
//             // For example, send the imageUrl to the server via an API

//             alert('Profile updated successfully!');
//         };

//         reader.readAsDataURL(file);  // Read file as data URL
//     } else {
//         alert('No image selected!');
//     }
// });

/*Account Settings*/
const usersTable = document.getElementById('usersTable');
    const managersTable = document.getElementById('managersTable');
    const usersTableBody = document.getElementById('usersTableBody');
    const managersTableBody = document.getElementById('managersTableBody');

    // Toggle visibility between User Accounts and Manager Accounts tables
    const showTable = (table) => {
        if (table === 'users') {
            usersTable.style.display = 'block';
            managersTable.style.display = 'none';
        } else if (table === 'managers') {
            usersTable.style.display = 'none';
            managersTable.style.display = 'block';
        }
    };

    // Event listeners for toggle buttons
    const usersButton = document.getElementById('usersButton'); // Button to show users table
    const managersButton = document.getElementById('managersButton'); // Button to show managers table

    if (usersButton && managersButton) {
        usersButton.addEventListener('click', () => showTable('users'));
        managersButton.addEventListener('click', () => showTable('managers'));
    }

    // Populate tables dynamically
    const usersData = [
        { fullName: 'Roel Delos Reyes', username: 'User1236', email: '24-0317@gened.edu.ph', department: 'Sales', status: 'Inactive' },
        { fullName: 'Jane Doe', username: 'User1237', email: '24-0318@gened.edu.ph', department: 'IT', status: 'Active' }
    ];

    const managersData = [
        { fullName: 'John Smith', username: 'Manager1236', email: 'manager3@gened.edu.ph', category: 'Security', status: 'Active' },
        { fullName: 'Emily Rose', username: 'Manager1237', email: 'manager4@gened.edu.ph', category: 'Operations', status: 'Inactive' }
    ];

    const populateTable = (tableBody, data, isUser) => {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.fullName}</td>
                <td>${item.username}</td>
                <td>${item.email}</td>
                <td>${isUser ? item.department : item.category}</td>
                <td>${item.status}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    // Populate both tables initially
    populateTable(usersTableBody, usersData, true);
    populateTable(managersTableBody, managersData, false);

    // Initially show the User Accounts table
    showTable('users');

    // Ticket Details Modal Functionality
        // Grab all the tabs and ticket rows
// const statusTabs = document.querySelectorAll('.status-tab');
// const tablerows = document.querySelectorAll('tr[data-status]'); // All rows with data-status attribute

// // Add event listener to each tab
// statusTabs.forEach(tab => {
//     tab.addEventListener('click', function() {
//         // Remove active class from all tabs and add it to the clicked tab
//         statusTabs.forEach(t => t.classList.remove('active'));
//         this.classList.add('active');

//         // Get the status value of the clicked tab (new or in-progress)
//         const status = this.getAttribute('data-status');

//         // Loop through all ticket rows and display/hide based on the selected status
//         tablerows.forEach(row => {
//             const rowStatus = row.getAttribute('data-status'); // Get the row's status
//             // Show the row if it matches the selected status (new or in-progress)
//             if (rowStatus === status ) {
//                 tablerows.style.display = '';  // Show the row
//             } else {
//                 tablerows.style.display = 'none';  // Hide the row
//             }
//         });
//     });
// });
document.addEventListener("DOMContentLoaded", function() {
    // Grab all the tabs and ticket rows
    const statusTabs = document.querySelectorAll('.status-tab');
    const rows = document.querySelectorAll('tr[data-status]'); // All rows with data-status attribute

    // Add event listener to each tab
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and add it to the clicked tab
            statusTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Get the status value of the clicked tab (new, in-progress, closed)
            const status = this.getAttribute('data-status');

            // Loop through all ticket rows and display/hide based on the selected status
            rows.forEach(row => {
                const rowStatus = row.getAttribute('data-status'); // Get the row's status
                // Show the row if it matches the selected status (new or in-progress)
                if (status === 'all' || rowStatus === status) {
                    row.style.display = '';  // Show the row
                } else {
                    row.style.display = 'none';  // Hide the row
                }
            });
        });
    });
});

 
// const statusTabs = document.querySelectorAll('.status-tab');
// const ticketsTableBody = document.getElementById('ticketsTableBody');

// statusTabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//         // Remove active class from all tabs and add it to the clicked tab
//         statusTabs.forEach(t => t.classList.remove('active'));
//         tab.classList.add('active');

//         // Filter tickets based on the selected status
//         const status = tab.getAttribute('data-status');
//         const rows = ticketsTableBody.querySelectorAll('tr[data-status]');

//         rows.forEach(row => {
//             const rowStatus = row.getAttribute('data-status');
//             if (rowStatus === status) {
//                 row.style.display = '';
//             } else {
//                 row.style.display = 'none';
//             }
//         });
//     });
// });

// Modal and overlay for ticket details

const modal = document.getElementById('ticketDetailsModal');
const overlay = document.getElementById('overlay');
// const closeDetails = document.getElementById('closeDetails');
const updateStatusButton = document.getElementById('updateStatusButton');
const detailRequester = document.getElementById('detailRequester');
const detailDepartment = document.getElementById('detailDepartment');
const detailDateTime = document.getElementById('detailDateTime');
const detailPriority = document.getElementById('detailPriority');
const detailDescription = document.getElementById('detailDescription');
const statusSelect = document.getElementById('statusSelect');
let selectedRow = null;

// Show ticket details modal
ticketsTableBody.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === 'TD') {
        const row = e.target.parentElement;
        selectedRow = row; // Store the selected row

        // Populate modal with ticket details
        detailRequester.textContent = row.children[2].textContent;
        detailDepartment.textContent = row.children[3].textContent;
        detailDateTime.textContent = row.children[1].textContent;
        detailPriority.textContent = row.children[4].textContent;
        detailDescription.value = "Description for ticket ID " + row.dataset.id; // Placeholder description
        statusSelect.value = row.children[5].textContent.toLowerCase(); // Set the current status

        // Show modal and overlay
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    }
});

// Close modal and overlay
// closeDetails.addEventListener('click', () => {
//     modal.classList.add('hidden');
//     overlay.classList.add('hidden');
// });

// Update the ticket status when the update button is clicked
updateStatusButton.addEventListener('click', () => {
    if (selectedRow) {
        const newStatus = statusSelect.value;
        selectedRow.cells[5].innerText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1); // Update status in the table
        modal.classList.add('hidden'); // Close the modal
        overlay.classList.add('hidden'); // Close the overlay
    }
});

// Close modal and overlay when clicking outside of it (overlay functionality)
overlay.addEventListener('click', () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
});

// Close modal when the close button (span) is clicked
const closeButton = document.querySelector('.close-button');

closeButton.addEventListener('click', () => {
    // Hide the modal
    modal.classList.add('hidden');
    // Hide the overlay (if applicable)
    overlay.classList.add('hidden');
});
// Modal and overlay for report details
const reportsTableBody = document.getElementById('reportsTableBody');
const reportDetailsModal = document.getElementById('reportDetails');
const reportOverlay = document.getElementById('overlay'); // Reuse the same overlay
const closeReportDetails = document.querySelector('#reportDetails button#closeDetails');

// Show report details modal
reportsTableBody.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === 'TD') {
        const row = e.target.parentElement;

        // Populate modal with report details
        document.getElementById('reportRequester').textContent = row.children[2].textContent;
        document.getElementById('reportDepartment').textContent = row.children[3].textContent;
        document.getElementById('detailDescription').textContent = 'Details for Ticket ID ' + row.children[0].textContent;

        // Show modal and overlay
        reportDetailsModal.classList.remove('hidden');
        reportOverlay.classList.remove('hidden');
    }
});

// Close modal and overlay
// closeReportDetails.addEventListener('click', () => {
//     reportDetailsModal.classList.add('hidden');
//     reportOverlay.classList.add('hidden');
// });

reportOverlay.addEventListener('click', () => {
    reportDetailsModal.classList.add('hidden');
    reportOverlay.classList.add('hidden');
});

/* USERDASHBOARDDDDDDDDDDDDDDDDDDDD*/

// Close modal and overlay
// closeDetails.addEventListener('click', () => {
//     modal.classList.add('hidden');
//     overlay.classList.add('hidden');
// });

// Update ticket status
updateStatusButton.addEventListener('click', () => {
    if (selectedRow) {
        const newStatus = statusSelect.value; // Get the selected status from the dropdown
        selectedRow.children[5].textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1); // Update the table
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    } else {
        alert("No ticket selected to update.");
    }
});

// Handle overlay click to close the modal
overlay.addEventListener('click', () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
});

// Ensure accessibility by enabling ESC key to close the modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }
});

// Light/Dark Mode Toggle
const checkbox = document.getElementById('checkbox');
const body = document.body;

// Check saved preference from localStorage
const savedMode = localStorage.getItem('theme');
if (savedMode) {
    body.classList.toggle('dark-mode', savedMode === 'dark');
    checkbox.checked = savedMode === 'dark'; // Ensure checkbox reflects saved mode
}

// Add event listener to the checkbox for theme toggle
checkbox.addEventListener('change', () => {
    const isDarkMode = checkbox.checked;
    body.classList.toggle('dark-mode', isDarkMode);
    
    // Save user preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Logout Functionality
document.getElementById('logoutbtn').addEventListener('click', () => {
    // Perform logout logic here, like destroying session
    window.location.href = 'midtermsLogin.html'; // Redirect to login page
});

