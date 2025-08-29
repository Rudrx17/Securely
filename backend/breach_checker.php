<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed']);
    exit;
}

// Get input
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['email'])) {
    echo json_encode(['success' => false, 'error' => 'Email required']);
    exit;
}

$email = trim($input['email']);

try {
    // Connect to database
    $db = new PDO('sqlite:' . __DIR__ . '/breach_data_sample.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Search for email
    $stmt = $db->prepare('SELECT * FROM breach_data WHERE email = ?');
    $stmt->execute([$email]);
    $breaches = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return results in format expected by frontend
    if (empty($breaches)) {
        echo json_encode([
            'success' => true,
            'found_breaches' => false,
            'breaches' => [],
            'ai_summary' => 'Good news! No breaches found for this email address.',
            'total_breaches' => 0
        ]);
    } else {
        // Simple AI-like summary
        $count = count($breaches);
        $ai_summary = "🚨 **Security Alert: $count Data Breach" . ($count > 1 ? 'es' : '') . " Found**\n\n";
        $ai_summary .= "Your email was found in $count security breach" . ($count > 1 ? 'es' : '') . ". ";
        $ai_summary .= "Please change your passwords immediately and enable two-factor authentication.";
        
        echo json_encode([
            'success' => true,
            'found_breaches' => true,
            'breaches' => $breaches,
            'ai_summary' => $ai_summary,
            'total_breaches' => $count
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
