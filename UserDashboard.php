<?php
// Start the session
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    // If not logged in, redirect to the login page
    header("Location: midtermsLogin.html");
    exit();
}

// Redirect users with "Admin" role to Dashboard.php
if ($_SESSION['role'] === 'Admin') {
    header("Location: Dashboard.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechSISC - User Dashboard</title>
    <link rel="stylesheet" href="UserDashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
        <h2 class="logo">TechSISC</h2>  
            <button id="sidebarToggleButton" class="sidebar-toggle-btn">
                <i class="fas fa-arrow-circle-left"></i>
              </button>
            <div class="profile">
                <img id="profileImage" src="roel.jpg" alt="Admin Profile">
                <p id="emailText">Email</p>
                <p id="adminText">User</p>
            </div>
            <nav>
                <ul>
                    <li data-section="add-ticket" class="active">
                        <i class="fas fa-plus-circle"></i> Add Ticket
                    </li>
                    <li data-section="tickets-summary">
                        <i class="fas fa-list-alt"></i> Tickets Summary
                    </li>
                    <li id="logoutbtn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <main>
        <section id="add-ticket" class="section active">
    <header>
        <h1>Create Ticket</h1>
    </header>
    <form id="createTicketForm">
        <label for="fullName">Full Name:</label>
        <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required>

        <label for="ticketTitle">Department / Office:</label>
        <input type="text" id="ticketTitle" name="ticketTitle" placeholder="Enter your department or office" required>

        <label for="ticketLocation">Location:</label>
        <input type="text" id="ticketLocation" name="ticketLocation" placeholder="Enter your location" required>

        <label for="ticketDescription">Details of the Concern:</label>
        <textarea id="ticketDescription" name="ticketDescription" rows="4" placeholder="Describe the issue or concern" required></textarea>

        <button type="button" id="submitTicket">Submit</button>

        <p class="form-note">
            Note: A technician will respond promptly to your issue, <br>
            or you may contact us directly at <strong>Helpdesk@sgen.edu.ph</strong>.
        </p>
    </form>

    <div id="ticketDetailsModal" class="modal" style="display: none;">
        <div class="modal-content">
            <h3>Ticket Details</h3>
            <p><strong>Full Name:</strong> <span id="modalFullName"></span></p>
            <p><strong>Department / Office:</strong> <span id="modalDepartment"></span></p>
            <p><strong>Location:</strong> <span id="modalLocation"></span></p>
            <p><strong>Details of the Concern:</strong> <span id="modalDescription"></span></p>
            
            <!-- AI-Determined Concern Category -->
            <p><strong>Concern Category:</strong> <span id="modalConcernCategory">Determining...</span></p>

            <label for="priorityLevel"><strong>Priority:</strong></label>
            <select id="priorityLevel">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <div class="modal-buttons">
                <button id="confirmTicket" class="confirm-btn">Confirm</button>
                <button id="closeModal" class="cancel-btn">Cancel</button>
            </div>
        </div>
    </div>
</section>

            <!-- Tickets Summary Section -->
            <section id="tickets-summary" class="section hidden">
                <header>
                    <h1>Tickets Summary</h1>
                </header>
                <table>
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Full Name</th>
                            <th>Department / Office</th>
                            <th>Location</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody id="ticketSummaryTable">
                        <!-- Tickets will be added here -->
                    </tbody>
                </table>
            </section>
        </main>
    </div>

   

    <script src="Userscript.js"></script>
</body>
</html>
