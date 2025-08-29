<?php
require_once 'gemini_api.php';

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

// Initialize Gemini API (set your API key here or use environment variable)
$geminiApiKey = 'AIzaSyC3PMs3W1O9p5blNbH3SrxTfIiXUXOdUr4';
$geminiAPI = new GeminiAPI($geminiApiKey);

try {
    // Connect to database
    $db = new PDO('sqlite:' . __DIR__ . '/breach_data_sample.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Search for email
    $stmt = $db->prepare('SELECT * FROM breach_data WHERE email = ?');
    $stmt->execute([$email]);
    $breaches = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Generate AI analysis using Gemini
    $ai_summary = $geminiAPI->analyzeThreat($email, $breaches);

    // Return results in format expected by frontend
    if (empty($breaches)) {
        echo json_encode([
            'success' => true,
            'found_breaches' => false,
            'breaches' => [],
            'ai_summary' => $ai_summary,
            'total_breaches' => 0
        ]);
    } else {
        $count = count($breaches);

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
