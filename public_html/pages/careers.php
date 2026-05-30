<?php
require_once '../includes/config.php';

$message = "";
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit_applicant'])) {
    // Map PHP POST data to ERPNext Job Applicant fields
    $applicant_data = [
        "applicant_name"   => $_POST['fullname'],
        "email_id"         => $_POST['email'],
        "mobile_no"        => $_POST['phone'],
        "job_title"        => $_POST['job_opening'],
        "linkedinID"       => $_POST['linkedinID'],
        "total_experience" => $_POST['experience'],
        "notice_period"    => $_POST['notice'],
        "status"           => "Open"
    ];

    if (!empty($_POST['cover_letter'])) {
        $applicant_data['cover_letter'] = $_POST['cover_letter'];
    }

    $result = post_to_erpnext('Job Applicant', $applicant_data);

    if ($result['code'] == 200) {
        $message = "<div class='alert success'>Application submitted successfully!</div>";
    } else {
        $error_details = $result['data'] ?? null;
        $curl_error = !empty($result['curl_error']) ? $result['curl_error'] : null;
        $message = "<div class='alert error'>";
        $message .= "Error submitting application.";
        if ($curl_error) {
            $message .= " Connection error: " . htmlspecialchars($curl_error) . ".";
        }
        if ($error_details) {
            $message .= " Response: " . htmlspecialchars(json_encode($error_details));
        }
        $message .= "</div>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Careers | Insight Travel</title>
    <link rel="stylesheet" href="/css/style.css?v=2">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
</head>
<body>
    <?php include __DIR__ . '/../includes/navbar.php'; ?>

    <section class="container">
        <h1>Join Our Team</h1>

        <p>Help us serve the Guests of Allah. Apply for open positions below.</p>

        <?php echo $message; ?>

        <form action="" method="POST" class="career-form" name="careers_form">
            <div class="form-row">
                <input type="text" name="fullname" placeholder="Applicant Name" required>
                <input type="email" name="email" placeholder="Email Address" required>
                <input type="linkedinID" name="linkedinID" placeholder="Your LinkedIn ID">
              </div>

            <div class="form-row">
                <input type="text" name="phone" placeholder="Phone Number" required>
                <select name="experience" required>
                    <option value="">Years of Experience</option>
                    <option value="No Experience">No Experience</option>
                    <option value="1+ Years">1+ Years</option>
                    <option value="2+ Years">2+ Years</option>
                    <option value="3+ Years">3+ Years</option>
                    <option value="4+ Years">4+ Years</option>
                    <option value="5+ Years">5+ Years</option>
                    <option value="6+ Years">6+ Years</option>
                    <option value="7+ Years">7+ Years</option>
                    <option value="8+ Years">8+ Years</option>
                    <option value="9+ Years">9+ Years</option>
                    <option value="10+ Years">10+ Years</option>
                    <option value="11+ Years">11+ Years</option>
                    <option value="13+ Years">13+ Years</option>
                    <option value="14+ Years">14+ Years</option>
                    <option value="15+ Years">15+ Years</option>
                    <option value="16+ Years">16+ Years</option>
                    <option value="17+ Years">17+ Years</option>
                    <option value="18+ Years">18+ Years</option>
                    <option value="19+ Years">19+ Years</option>
                    <option value="20+ Years">20+ Years</option>
                </select>
            </div>

            <div class="form-row">
                <input type="text" name="job_opening" placeholder="Job Opening (e.g. Sales Executive)" required>
                <select name="notice" required>
                    <option value="Immediate Joining">Immediate Joining</option>
                    <option value="10 Days">10 Days</option>
                    <option value="20 Days">20 Days</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                </select>
            </div>
            <div class="form-row">
            <fieldset class="radio-grid">
               <legend> Are you Saudi National</legend>
               <label><input type="radio" name="options" value="yes"> Yes</label>
               <label><input type="radio" name="options" value="no"> No</label>
            </fieldset>
            </div>
            <textarea name="cover_letter" placeholder="Short Bio / Notes"></textarea>
            <button type="submit" name="submit_applicant" class="btn">Submit Application</button>
            <button type="reset" class="btn btn-reset">Reset</button>
        </form>
    </section>
    <script src="/js/script.js?v=2"></script>
</body>
</html>
