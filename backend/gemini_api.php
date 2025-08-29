<?php
class GeminiAPI {
    private $apiKey;
    private $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    public function analyzeThreat($identifier, $breaches) {
        if (empty($breaches)) {
            return $this->getSafeAnalysis($identifier);
        } else {
            return $this->getBreachAnalysis($identifier, $breaches);
        }
    }
    
    private function getBreachAnalysis($identifier, $breaches) {
        $breachCount = count($breaches);
        $breachDetails = "";
        
        // Build breach details for context
        foreach ($breaches as $i => $breach) {
            $breachDetails .= "\n" . ($i + 1) . ". " . ($breach['website'] ?? 'Unknown site') . 
                            " (Date: " . ($breach['breach_date'] ?? 'Unknown') . 
                            ", Data exposed: " . ($breach['data_types'] ?? 'Unknown') . ")";
        }
        
        $prompt = "You are a friendly and reassuring cybersecurity expert named \"Securely.\" Your goal is to help a non-technical user understand their security situation without causing panic.

A scan for the identifier \"$identifier\" found $breachCount compromised account(s).

Breach details:$breachDetails

Please generate a response with two distinct sections:

1. *Threat Summary:* In a short, simple paragraph, explain what this means. Use an analogy (like a lost key for a house). Reassure them that this is common and very fixable.

2. *Action Steps:* Provide a short, numbered list of 3 clear, simple, and prioritized steps they should take right now to secure their accounts. Start with the most important action.

Format your response exactly like this, with no extra text before or after:
Threat Summary: [Your summary here]
Action Steps:
1. [First step]
2. [Second step]
3. [Third step]";

        return $this->callGeminiAPI($prompt);
    }
    
    private function getSafeAnalysis($identifier) {
        $prompt = "You are a friendly and reassuring cybersecurity expert named \"Securely.\" Your goal is to help users stay secure online.

A scan for the identifier \"$identifier\" found NO compromised accounts. The user is currently safe.

Please generate a response with two distinct sections:

1. *Safety Status:* In a short, friendly paragraph, congratulate them on their good security and explain what this means for their online safety.

2. *Prevention Tips:* Provide a short, numbered list of 3 clear, simple tips they should follow to keep their accounts safe and avoid future breaches.

Format your response exactly like this, with no extra text before or after:
Safety Status: [Your congratulatory message here]
Prevention Tips:
1. [First prevention tip]
2. [Second prevention tip]
3. [Third prevention tip]";

        return $this->callGeminiAPI($prompt);
    }
    
    private function callGeminiAPI($prompt) {
        if (empty($this->apiKey)) {
            return $this->getFallbackResponse($prompt);
        }
        
        $url = $this->baseUrl . '?key=' . $this->apiKey;
        
        $data = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.3,
                'topK' => 40,
                'topP' => 0.8,
                'maxOutputTokens' => 500
            ]
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            error_log("Gemini API cURL error: " . $error);
            return $this->getFallbackResponse($prompt);
        }
        
        if ($httpCode !== 200) {
            error_log("Gemini API HTTP error: " . $httpCode . " Response: " . $response);
            return $this->getFallbackResponse($prompt);
        }
        
        $responseData = json_decode($response, true);
        
        if (!$responseData || !isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
            error_log("Gemini API invalid response format");
            return $this->getFallbackResponse($prompt);
        }
        
        return $responseData['candidates'][0]['content']['parts'][0]['text'];
    }
    
    private function getFallbackResponse($prompt) {
        // Determine if this is a breach or safe scenario based on prompt content
        if (strpos($prompt, 'found NO compromised accounts') !== false) {
            return "Safety Status: Great news! Your email hasn't been found in any known data breaches. This means your accounts appear to be secure and your personal information hasn't been exposed in major security incidents.

Prevention Tips:
1. Use unique, strong passwords for each account and enable two-factor authentication wherever possible
2. Be cautious of phishing emails and never click suspicious links or download attachments from unknown senders
3. Regularly review your account activity and immediately report any suspicious behavior you notice";
        } else {
            return "Threat Summary: Think of this like having copies of your house key floating around - concerning, but completely manageable with the right actions. Data breaches happen to millions of people, and there are proven steps to secure your accounts and protect yourself going forward.

Action Steps:
1. Immediately change passwords for all affected accounts and any other accounts using the same password
2. Enable two-factor authentication on all important accounts (email, banking, social media)
3. Monitor your accounts closely for suspicious activity and consider using a password manager for future security";
        }
    }
}
?>
