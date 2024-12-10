<?php
session_start();   

if (!isset($_SESSION['username'])) {
    header("Location: midtermsLogin.html");  
    exit();
}
$uname = $_SESSION['username'];   
$email = $_SESSION['email'];
$role = $_SESSION['role'];
$fullName = $_SESSION['fullName'];   
$contactNumber = $_SESSION['contactNumber'];
$birthdate = $_SESSION['birthdate'];
$gender = $_SESSION['gender'];   
$department = $_SESSION['department'];
$departPosition = $_SESSION['departPosition'];
$password = $_SESSION['password'];   
$status = $_SESSION['status'];

//Database Connection
$serverName = "ARIGATOU\SQLEXPRESS";
$database = "Midterms";
$username = "";
$password = "";

$connection = [
    "Database" => $database,
    "Uid" => $username,
    "PWD" => $password
];

$conn = sqlsrv_connect($serverName, $connection);
if (!$conn) {
    die(print_r(sqlsrv_errors(), true));
}

// Query for "New" tickets
$newQuery = "SELECT Tickets.TicketID, Tickets.DateFiled, Users.FullName, Tickets.Location, Users.Department, Tickets.Priority, Tickets.Status
            FROM Users
            INNER JOIN Tickets ON Users.UserID = Tickets.RequesterID
            WHERE Users.Department != 'MIS' AND Users.Department != 'IT' AND Tickets.Status = 'New';";
$newResult = sqlsrv_query($conn, $newQuery);

if( !$newResult ) {
    die( print_r(sqlsrv_errors(), true));
}

// Query for "In-Progress" tickets
$inProgressQuery = "SELECT Tickets.TicketID, Tickets.DateFiled, Users.FullName, Tickets.Location, Users.Department, Tickets.Priority, Tickets.Status
                    FROM Users
                    INNER JOIN Tickets ON Users.UserID = Tickets.RequesterID
                    WHERE Users.Department != 'MIS' AND Users.Department != 'IT' AND Tickets.Status = 'In Progress';";
$inProgressResult = sqlsrv_query($conn, $inProgressQuery);
if( !$inProgressResult ) {
    die( print_r(sqlsrv_errors(), true));
}
// Query for "Closed" tickets
$closedQuery = "SELECT Tickets.TicketID, Tickets.DateFiled, Users.FullName, Tickets.Location, Users.Department, Tickets.Priority, Tickets.Status
                    FROM Users
                    INNER JOIN Tickets ON Users.UserID = Tickets.RequesterID
                    WHERE Users.Department != 'MIS' AND Users.Department != 'IT' AND Tickets.Status = 'Closed';";
$closedResult = sqlsrv_query($conn, $closedQuery);
if( !$closedResult ) {
    die( print_r(sqlsrv_errors(), true));
}

$reportsQuery = "SELECT  Tickets.TicketID, Tickets.DateFiled, Tickets.DateClosed, Users.FullName, Tickets.Location, Tickets.ConcernCategory,  Tickets.Priority, Tickets.Status
                FROM Users
                INNER JOIN Tickets
                ON Users.UserID = Tickets.RequesterID
                where Users.Department != 'IT' and Tickets.Status = 'Closed'; 
                ";
$reportsResult = sqlsrv_query($conn, $reportsQuery);

if( !$reportsResult ) {
    die( print_r(sqlsrv_errors(), true));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechSISC - Admin Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="AdminStyle.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- For Charts -->
</head>
<body>
    <!-- Use data attributes to store session data -->
    <div id="userData" 
        data-username="<?php echo htmlspecialchars($uname); ?>"
        data-email="<?php echo htmlspecialchars($email); ?>" 
        data-role="<?php echo htmlspecialchars($role); ?>"
        data-fullName="<?php echo htmlspecialchars($fullName); ?>"
        data-gender="<?php echo htmlspecialchars($gender); ?>" 
        data-birthdate="<?php echo htmlspecialchars($birthdate); ?>"
        data-contactNumber="<?php echo htmlspecialchars($contactNumber); ?>" 
        data-department="<?php echo htmlspecialchars($department); ?>"
        data-departPosition="<?php echo htmlspecialchars($departPosition); ?>" 
        data-password="<?php echo htmlspecialchars($password); ?>"
        data-status="<?php echo htmlspecialchars($status); ?>" >
    </div>
    <!-- Use data attributes to store session data -->
     
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
                <p id="adminText">Admin</p>
            </div>

    
            <!-- Navigation Menu -->
            <nav>
                <ul>
                    <li  data-section="dashboard" class="active">
                        <i class="fas fa-tachometer-alt"></i> Dashboard
                    </li>
                    <li id="ticketsSB" data-section="tickets">
                        <i class="fas fa-ticket-alt"></i> Tickets
                    </li>
                    <li id="reportsSB" data-section="reports">
                        <i class="fas fa-chart-line"></i> Reports
                    </li>
                    <li id="accountsSB" data-section="accounts">
                        <i class="fas fa-user"></i> Accounts
                    </li>
                    <li id="profileSB" data-section="profile">
                        <i class="fas fa-id-card"></i> Profile
                    </li>
                    <li id="logoutbtn" data-section="logout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </li>
                    <div class="theme-toggle">
                        <label for="checkbox">
                            <i class="fas fa-moon"></i>
                            <i class="fas fa-sun"></i>
                            <input type="checkbox" id="checkbox">
                            <span class="ball"></span>
                        </label>
                    </div>
                </ul>
            </nav>
            
        </aside>

        <!-- Main Content -->
        <main>
            <!-- Dashboard Section -->
            <section id="dashboard" class="section active">
                <header>
                      <button id="sidebarleftbtn" class="sidebar-left-btn">
                        <i class="fas fa-bars"></i> <!-- Font Awesome hamburger icon -->
                    </button>
                    <h1>Dashboard</h1>
                    
                    <!-- Notifications -->
                    <div id="notificationArea" class="notifications">
                        🔔 Notifications
                        <div id="notificationPopup" class="notification-popup hidden">
                            <h3>Ticket Updates</h3>
                            <ul>
                                <li><strong>New Tickets</strong>: 5</li>
                                <li><strong>In Progress</strong>: 3</li>
                                <li><strong>Closed Tickets</strong>: 2</li>
                            </ul>
                            <div>
                                <h4>Assigned People:</h4>
                                <ul>
                                    <li>New Ticket #1 - Assigned to John Doe</li>
                                    <li>In Progress #3 - Assigned to Jane Smith</li>
                                    <li>Closed Ticket #2 - Assigned to Mike Lee</li>
                                </ul>
                            </div>
                            <button class="close-btn">Close</button>
                        </div>
                    </div>
                    
                </header>

                <!-- Ticket Status Section -->
                <div id="ticketStatus" class="section active">
                    <h2>Ticket Status</h2>
                    <div class="ticket-status-container">
                        <div class="status-box">
                            <h3>All Tickets</h3>
                            <p class="ticket-count">25</p>
                        </div>
                        <div class="status-box">
                            <h3>New Tickets</h3>
                            <p class="ticket-count">5</p>
                        </div>
                        <div class="status-box">
                            <h3>In Progress</h3>
                            <p class="ticket-count">5</p>
                        </div>
                        <div class="status-box">
                            <h3>Closed Tickets</h3>
                            <p class="ticket-count">15</p>
                        </div>
                    </div>
                </div>

                <!-- Main Dashboard Layout - Grid Section -->
                <div class="grid-container">
                    <div class="chart-container">
                        <h3>Ticket Status</h3>
                        <canvas id="ticketStatusChart"></canvas>
                    </div>

                    <div class="chart-container">
                        <h3>Ticket History</h3>
                        <canvas id="ticketHistoryChart"></canvas>
                    </div>

                    <div class="chart-container">
                        <h3>Level of Priority</h3>
                        <canvas id="priorityChart"></canvas>
                    </div>
                    

                    <div class="chart-container">
                        <h3>Ticket Category</h3>
                        <canvas id="ticketCategoryChart"></canvas>
                    </div>
                </div>
            </section>

            <!-- Tickets Section (Initially Hidden) -->
            <section id="tickets" class="section hidden">
                <header>
                    <button id="sidebarleftbtn-tickets" class="sidebar-left-btn">
                        <i class="fas fa-bars"></i> <!-- Font Awesome hamburger icon -->
                    </button>
                    <h1>Tickets</h1>
                    <div class="status-tabs">
                        <button class="status-tab active" data-status="new">New</button>
                        <button class="status-tab" data-status="in-progress">In Progress</button>
                        <button class="status-tab" data-status="closed">Closed</button>
                    </div>
                </header>
                
                <div class="tickets-container">
                    <table class="tickets-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date/Time</th>
                                <th>Requester</th>
                                <th>Location</th>
                                <th>Department</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="ticketsTableBody">
                            <?php while ($row = sqlsrv_fetch_array($newResult, SQLSRV_FETCH_ASSOC)): ?>

                                <?php
                                // Initialize formattedDate with 'N/A' as default
                                $formattedDate = 'N/A';

                                // Check if DateFiled exists and is an instance of DateTime or a valid timestamp
                                if (isset($row['DateFiled'])) {
                                if ($row['DateFiled'] instanceof DateTime) {
                                    // Format the DateTime object to include both date and time
                                    $formattedDate = $row['DateFiled']->format('F j, Y g:i A');
                                } else {
                                    $timestamp = strtotime($row['DateFiled']);
                                    if ($timestamp) {
                                        // Format the timestamp to include both date and time
                                        $formattedDate = date('F j, Y g:i A', $timestamp);
                                    }
                                }
                                }
                                ?>

                                <tr data-status="new">
                                    <td><?php echo $row['TicketID']; ?></td>
                                    <td><?php echo $formattedDate; ?></td> <!-- Display the formatted date here -->
                                    <td><?php echo $row['FullName']; ?></td>
                                    <td><?php echo $row['Location']; ?></td>
                                    <td><?php echo $row['Department']; ?></td>
                                    <td><?php echo $row['Priority']; ?></td>
                                    <td><?php echo $row['Status']; ?></td>
                                </tr>

                            <?php endwhile; ?> 

                            <?php while ($row = sqlsrv_fetch_array($inProgressResult, SQLSRV_FETCH_ASSOC)): ?>

                                <?php
                                // Initialize formattedDate with 'N/A' as default
                                $formattedDate = 'N/A';

                                // Check if DateFiled exists and is an instance of DateTime or a valid timestamp
                                if (isset($row['DateFiled'])) {
                                if ($row['DateFiled'] instanceof DateTime) {
                                // Format the DateTime object to include both date and time
                                $formattedDate = $row['DateFiled']->format('F j, Y g:i A');
                                } else {
                                $timestamp = strtotime($row['DateFiled']);
                                if ($timestamp) {
                                    // Format the timestamp to include both date and time
                                    $formattedDate = date('F j, Y g:i A', $timestamp);
                                }
                                }
                                }
                                ?>

                                <tr data-status="in-progress">
                                    <td><?php echo $row['TicketID']; ?></td>
                                    <td><?php echo $formattedDate; ?></td> <!-- Display the formatted date here -->
                                    <td><?php echo $row['FullName']; ?></td>
                                    <td><?php echo $row['Location']; ?></td>
                                    <td><?php echo $row['Department']; ?></td>
                                    <td><?php echo $row['Priority']; ?></td>
                                    <td><?php echo $row['Status']; ?></td>
                                </tr>

                                <?php endwhile; ?> 

                                <?php while ($row = sqlsrv_fetch_array($closedResult, SQLSRV_FETCH_ASSOC)): ?>

                                    <?php
                                    // Initialize formattedDate with 'N/A' as default
                                    $formattedDate = 'N/A';

                                    // Check if DateFiled exists and is an instance of DateTime or a valid timestamp
                                    if (isset($row['DateFiled'])) {
                                    if ($row['DateFiled'] instanceof DateTime) {
                                    // Format the DateTime object to include both date and time
                                    $formattedDate = $row['DateFiled']->format('F j, Y g:i A');
                                    } else {
                                    $timestamp = strtotime($row['DateFiled']);
                                    if ($timestamp) {
                                        // Format the timestamp to include both date and time
                                        $formattedDate = date('F j, Y g:i A', $timestamp);
                                    }
                                    }
                                    }
                                    ?>

                                    <tr data-status="closed">
                                        <td><?php echo $row['TicketID']; ?></td>
                                        <td><?php echo $formattedDate; ?></td> <!-- Display the formatted date here -->
                                        <td><?php echo $row['FullName']; ?></td>
                                        <td><?php echo $row['Location']; ?></td>
                                        <td><?php echo $row['Department']; ?></td>
                                        <td><?php echo $row['Priority']; ?></td>
                                        <td><?php echo $row['Status']; ?></td>
                                    </tr>
                                    <?php endwhile; ?> 
                        </tbody>
                    </table>
                </div>
                
                <div id="overlay" class="hidden"></div>
            
                <div id="ticketDetailsModal" class="modal hidden">
                    <div class="modal-header">
                        <h2>Ticket Details</h2>
                        <span class="close-button" id="closebtna">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="ticket-detail">
                            <div>
                                <label for="detailRequester">Requester:</label>
                                <p id="detailRequester"></p>
                            </div>
                            <div>
                                <label for="detailDepartment">Department:</label>
                                <p id="detailDepartment"></p>
                            </div>
                            <div>
                                <label for="detailDateTime">Date & Time:</label>
                                <p id="detailDateTime"></p>
                            </div>
                            <div>
                                <label for="detailPriority">Priority:</label>
                                <p id="detailPriority"></p>
                            </div>
                            <div>
                                <label for="statusSelect">Status:</label>
                                <select id="statusSelect">
                                    <option value="new">New</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <div class="description">
                                <label for="detailDescription">Description:</label>
                                <textarea id="detailDescription" rows="4" readonly style="width: 97%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
                            </div>
                        </div>
                        <div class="button-group">
                            <button id="updateStatusButton">Update Status</button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="reports" class="section hidden">
                <button id="sidebarleftbtn-reports" class="sidebar-left-btn">
                    <i class="fas fa-bars"></i> <!-- Font Awesome hamburger icon -->
                </button>
                <h2>Reports</h2>
                <!-- Reports Table -->
                <table class="reports-table">
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Filed Date</th>
                            <th>Closed Date</th>
                            <th>Requester</th>
                            <th>Location</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="reportsTableBody">
                        <?php while ($row = sqlsrv_fetch_array($reportsResult, SQLSRV_FETCH_ASSOC)): ?>

                            <?php
                                // Initialize formattedDate with 'N/A' as default
                                $formattedDateF = 'N/A';
                                $formattedDateC = 'N/A';

                                // Check if DateFiled exists and is an instance of DateTime or a valid timestamp
                                if (isset($row['DateFiled'])) {
                                    if ($row['DateFiled'] instanceof DateTime) {
                                        // Format the DateTime object to include both date and time
                                        $formattedDateF = $row['DateFiled']->format('F j, Y g:i A');
                                    } else {
                                        $timestamp = strtotime($row['DateFiled']);
                                        if ($timestamp) {
                                            // Format the timestamp to include both date and time
                                            $formattedDateF = date('F j, Y g:i A', $timestamp);
                                        }
                                    }
                                }
                                if (isset($row['DateClosed'])) {
                                    if ($row['DateClosed'] instanceof DateTime) {
                                        // Format the DateTime object to include both date and time
                                        $formattedDateC = $row['DateClosed']->format('F j, Y g:i A');
                                    } else {
                                        $timestamp = strtotime($row['DateClosed']);
                                        if ($timestamp) {
                                            // Format the timestamp to include both date and time
                                            $formattedDateC = date('F j, Y g:i A', $timestamp);
                                        }
                                    }
                                }
                            ?>

                            <tr data-status="reports">
                                <td><?php echo $row['TicketID']; ?></td>
                                <td><?php echo $formattedDateF; ?></td>  
                                <td><?php echo $formattedDateC; ?></td>  
                                <td><?php echo $row['FullName']; ?></td>
                                <td><?php echo $row['Location']; ?></td>
                                <td><?php echo $row['ConcernCategory']; ?></td>
                                <td><?php echo $row['Priority']; ?></td>
                                <td><?php echo $row['Status']; ?></td>
                            </tr>

                        <?php endwhile; ?>     
                    </tbody>
                </table>
            
                <!-- Report Details Modal -->
                <div id="reportDetails" class="report-details hidden">
                    <!-- <button id="closeDetails">Close</button> -->
                    <h3>Ticket Details</h3>
                    <span class="close-button" id="closebtnb">&times;</span>
                    <div class="ticket-detail">
                        <p><strong>Requester:</strong> <span id="reportRequester"></span></p>
                        <p><strong>Department:</strong> <span id="reportDepartment"></span></p>
                        <p><strong>Description:</strong> <textarea id="detailDescription" readonly></textarea></p>
                    </div>
                </div>
            </section>
                        <!-- Accounts Section -->
                        <section id="accounts" class="section">
    <header>
        <h2>Accounts</h2>
        <div class="table-toggle-buttons">
            <button id="usersButton" class="active">User Accounts</button>
            <button id="managersButton">Manager Accounts</button>
            <button id="addAccountButton" class="add-btn">Add Account</button>
        </div>
    </header>
    
    <!-- User Accounts Table -->
    <div class="accounts-container" id="usersTable" style="display: block;">
        <div class="table-wrapper">
            <table class="accounts-table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Birthdate</th>
                        <th>Gender</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody">
                    <tr>
                        <td>Roel Delos Reyes</td>
                        <td>User1234</td>
                        <td>24-0315@gened.edu.ph</td>
                        <td>09123456789</td>
                        <td>2000-01-01</td>
                        <td>Male</td>
                        <td>Marketing</td>
                        <td>Marketing Lead</td>
                        <td>Requester</td>
                        <td>Active</td>
                        <td>
                            <button class="edit-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="deactivate-btn">
                                <i class="fas fa-user-slash"></i> Deactivate
                            </button>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <!-- Manager Accounts Table (Initially Hidden) -->
    <div class="accounts-container" id="managersTable" style="display: none;">
        <table class="accounts-table">
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Contact Number</th>
                    <th>Birthdate</th>
                    <th>Gender</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="managersTableBody">
                <!-- Manager rows will go here -->
            </tbody>
        </table>
    </div>

    <!-- Modal for Add/Update Account -->
    <div id="accountModal" class="modal hidden">
        <div class="modal-contents">
            <h1 id="formTitle">Add/Edit Account</h1>
            <form id="accountForm">
                <input type="text" id="fullname" placeholder="Full Name" required>
                <input type="text" id="username" placeholder="Username" required>
                <input type="email" id="email" placeholder="Email" required>
                <input type="text" id="contactNumber" placeholder="Contact Number" required>
                <input type="date" id="birthdate" required>
                <select id="gender" required>
                    <option value="" disabled selected>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="text" id="department" placeholder="Department" required>
                <input type="text" id="position" placeholder="Position" required>
                <select id="role" required>
                    <option value="" disabled selected>Select Role</option>
                    <option value="Requester">Requester</option>
                    <option value="IT Personnel">IT Personnel</option>
                    <option value="Manager">Manager</option>
                </select>
                <select id="status" required>
                    <option value="" disabled selected>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <div class="modal-actions">
                    <button type="submit" class="btn save-btn">Save</button>
                    <button type="button" class="btn cancel-btn" id="cancelButton">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</section>


            <!-- profile section -->
            <section id="profile" class="section hidden">
                <header>
                    <button id="sidebarleftbtn-profile" class="sidebar-left-btn">
                        <i class="fas fa-bars"></i> <!-- Font Awesome hamburger icon -->
                    </button>
                    <h1>Profile</h1>
                </header>
                
                <div class="profile-container">
                    <form class="profile-form">
                        <div class="form-group">
                            <label for="profile-fullname">Full Name</label>
                            <input type="text" id="profile-fullname"  readonly>
                        </div>
                        <div class="form-group">
                            <label for="profile-email">Email</label>
                            <input type="email" id="profile-email" value="johndoe@example.com" readonly>
                        </div>
                        <div class="form-group">
                            <label for="profile-username">Username</label>
                            <input type="text" id="profile-username" value="JohnDoe" readonly>
                        </div>
                        <div class="form-groupA">
                            <div class="grouplbl">
                                <label for="profile-birthdate-gender">Birthdate</label>
                                <label for="profile-Gender">Gender</label>
                                <label for="profile-Cnumber">Contact Number</label>
                            </div>
                                <div class="genderdate" readonly>
                                    <input type="date" id="profile-birthdate" value="1990-01-01" readonly>
                                    <select id="profile-g" readonly>
                                        <option value="Male" selected>Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <input type="tel" id="profile-contact" value="123-456-7890" readonly>
                                </div>
                        </div>
                        <div class="form-groupB">
                            <label for="profile-department">Department</label>
                            <label for="profile-position">Position</label>
                            <div>
                                <input type="text" id="profile-department" value="IT Department" readonly>
                                <input type="text" id="profile-position" value="Systems Administrator" readonly>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="profile-role">Role</label>
                            <input type="text" id="profile-role" value="Administrator" readonly>
                        </div>
                        <div class="form-group">
                            <div class="btngroup">
                                <button type="button" id="editProfileBtn">Edit Profile</button>
                                <button type="button" id="changePasswordBtn">Change Password</button>
                            </div>
                        </div>

                    </form>
                </div>
            </section>
        </main>
    </div>
<script src="script.js"></script>
<script src="scripts.js"></script>
</body>
</html>
