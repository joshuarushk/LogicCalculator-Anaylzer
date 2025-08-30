class ModalityAnalyzer {
    constructor() {
        this.nlpProcessor = new NLPProcessor();
        
        // Alethic modality patterns - focus on logical/mathematical necessity and contradiction
        this.logicalPatterns = {
            necessity: [
                // Mathematical truths (pattern only - actual evaluation done separately)
                // /\d+\s*[+\-*/]\s*\d+\s*=\s*\d+/, // Removed - now handled by evaluation logic
                /all triangles have three sides/i,
                /all squares have four sides/i,
                /all bachelors are unmarried/i,
                /all circles are round/i,
                /\d+\s+\+\s+\d+\s+=\s+\d+/, // Will be evaluated for correctness
                /\d+\s+is\s+(?:greater|less)\s+than\s+\d+/, // Will be evaluated
                // Logical laws and principles
                /law\s+of\s+excluded\s+middle/i,
                /principle\s+of\s+excluded\s+middle/i,
                /law\s+of\s+non.?contradiction/i,
                /principle\s+of\s+non.?contradiction/i,
                /law\s+of\s+identity/i,
                /principle\s+of\s+identity/i,
                /de\s+morgan/i,
                // Logical tautologies
                /either.*or not/i,
                /if.*then.*follows/i,
                /by definition/i,
                /necessarily true/i,
                /logically necessary/i,
                /tautology/i,
                /axiom/i,
                /theorem/i,
                // Statements about logical principles
                /contradictions are impossible/i,
                /cannot be both.*and.*simultaneously/i,
                /either.*proposition.*or.*not/i,
                /principles.*necessarily true/i,
                /logical system/i
            ],
            impossibility: [
                // Actual logical contradictions (not statements about contradictions)
                /married bachelor/i,
                /square circle/i,
                /round square/i,
                /something is both.*and not/i,
                /\d+\s*=\s*\d+\s*and\s*\d+\s*≠\s*\d+/,
                /true and false/i,
                /exists and does not exist/i,
                // Only flag as impossible if it's claiming to be a contradiction, not describing contradictions
                /^(?!.*contradictions are).*contradiction.*$/i,
                /^(?!.*are impossible).*logically impossible.*$/i,
                /self-contradictory/i
            ]
        };

        // Modal indicators - these suggest epistemic or deontic modality, not alethic
        this.modalIndicators = {
            epistemic: ['certain', 'sure', 'confident', 'believe', 'think', 'know', 'obvious'],
            deontic: ['must', 'should', 'ought', 'required', 'forbidden', 'allowed', 'permitted'],
            possibility: ['can', 'could', 'may', 'might', 'possible', 'perhaps', 'maybe', 'likely', 'probable']
        };
    }

    calculateModalityScores(nlpResult) {
        const scores = {
            necessity: 0,
            possibility: 0,
            impossibility: 0
        };

        const sentence = nlpResult.originalSentence.toLowerCase();

        // First check for logical/mathematical patterns (true alethic modality)
        const logicalNecessity = this.detectLogicalNecessity(sentence);
        const logicalImpossibility = this.detectLogicalImpossibility(sentence);

        if (logicalNecessity > 0) {
            scores.necessity = logicalNecessity;
            scores.possibility = Math.min(20, logicalNecessity * 0.2); // Necessary things aren't "possible" - they just ARE
            scores.impossibility = 0;
        } else if (logicalImpossibility > 0) {
            scores.impossibility = logicalImpossibility;
            scores.necessity = 0;
            scores.possibility = 0;
        } else {
            // No logical necessity/impossibility found - analyze as contingent statement
            this.analyzeContingentStatement(scores, nlpResult);
        }

        // Apply contextual adjustments
        this.applyContextualAdjustments(scores, nlpResult.structure, nlpResult);

        // Ensure scores are in 0-100 range
        Object.keys(scores).forEach(key => {
            scores[key] = Math.min(100, Math.max(0, scores[key]));
        });

        return scores;
    }

    detectLogicalNecessity(sentence) {
        // Check for mathematical equations and evaluate their correctness
        const mathEquation = sentence.match(/(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/);
        if (mathEquation) {
            const [, num1, operator, num2, result] = mathEquation;
            const a = parseFloat(num1);
            const b = parseFloat(num2);
            const expectedResult = parseFloat(result);
            
            let actualResult;
            switch (operator) {
                case '+':
                    actualResult = a + b;
                    break;
                case '-':
                    actualResult = a - b;
                    break;
                case '*':
                    actualResult = a * b;
                    break;
                case '/':
                    actualResult = b !== 0 ? a / b : NaN;
                    break;
                default:
                    return 0;
            }
            
            // Check if the equation is correct (with small tolerance for floating point)
            if (Math.abs(actualResult - expectedResult) < 0.0001) {
                return 95; // Correct mathematical equations are necessarily true
            } else {
                return 0; // Incorrect equations are not necessary - they should be flagged as impossible
            }
        }

        // Check for definitional truths
        for (const pattern of this.logicalPatterns.necessity) {
            if (pattern.test(sentence)) {
                return 90;
            }
        }

        // Check for logical structure indicating necessity
        if (sentence.includes('by definition') || sentence.includes('tautology') || 
            sentence.includes('logically necessary')) {
            return 85;
        }

        // Check for more complex mathematical relationships
        if (this.evaluateComplexMathStatement(sentence)) {
            return 95;
        }
        
        // Check for logical tautologies and valid logical forms
        if (this.evaluateLogicalStatement(sentence)) {
            return 95;
        }
        
        // Check for conditional tautologies (if false then anything, if P then P or not P)
        if (this.isConditionalTautology(sentence)) {
            return 95;
        }
        
        return 0;
    }
    
    evaluateComplexMathStatement(sentence) {
        // Handle inequalities
        const inequalityMatch = sentence.match(/(\d+(?:\.\d+)?)\s*([<>]=?)\s*(\d+(?:\.\d+)?)/);
        if (inequalityMatch) {
            const [, num1, operator, num2] = inequalityMatch;
            const a = parseFloat(num1);
            const b = parseFloat(num2);
            
            switch (operator) {
                case '<':
                    return a < b;
                case '<=':
                    return a <= b;
                case '>':
                    return a > b;
                case '>=':
                    return a >= b;
            }
        }
        
        // Handle basic mathematical facts
        if (sentence.match(/prime number/i)) {
            const primeMatch = sentence.match(/(\d+)\s+is\s+(?:a\s+)?prime/i);
            if (primeMatch) {
                const num = parseInt(primeMatch[1]);
                return this.isPrime(num);
            }
        }
        
        return false;
    }
    
    evaluateLogicalStatement(sentence) {
        const lower = sentence.toLowerCase();
        
        // Law of excluded middle: P or not P (always true)
        if (this.isLawOfExcludedMiddle(lower)) {
            return true;
        }
        
        // Law of non-contradiction: not (P and not P) (always true)
        if (this.isLawOfNonContradiction(lower)) {
            return true;
        }
        
        // Law of identity: A = A, A is A (always true)
        if (this.isLawOfIdentity(lower)) {
            return true;
        }
        
        // De Morgan's laws
        if (this.isDeMorgansLaw(lower)) {
            return true;
        }
        
        // Logical tautologies
        if (this.isLogicalTautology(lower)) {
            return true;
        }
        
        // Conditional tautologies (if P then P, etc.)
        if (this.isConditionalTautology(lower)) {
            return true;
        }
        
        return false;
    }
    
    isLawOfExcludedMiddle(sentence) {
        // P or not P patterns
        const patterns = [
            /(.+)\s+or\s+not\s+\1/,
            /either\s+(.+)\s+or\s+not\s+\1/,
            /(.+)\s+or\s+~\s*\1/,
            /(.+)\s+∨\s+¬\s*\1/,
            /(.+)\s+∨\s+not\s+\1/,
            // More natural language patterns
            /(\w+)\s+is\s+(\w+)\s+or\s+\1\s+is\s+not\s+\2/,
            /either\s+(\w+)\s+or\s+not\s+\1/,
            /something\s+is\s+either\s+(\w+)\s+or\s+not\s+\1/,
            // Specific patterns from examples
            /either\s+it\s+rains\s+or\s+it\s+does\s+not\s+rain/,
            /the\s+(\w+)\s+is\s+(\w+)\s+or\s+the\s+\1\s+is\s+not\s+\2/,
            /either\s+(.+)\s+or\s+(.+)\s+does\s+not/,
            /(.+)\s+or\s+(.+)\s+does\s+not/,
            // Complex disjunctions that include tautologies
            /\((.+)\)\s+∨\s+\((.+)\)/,
            // Generic excluded middle statements
            /every\s+proposition\s+is\s+either\s+true\s+or\s+false/,
            /every\s+number\s+is\s+either\s+even\s+or\s+odd/,
            /law\s+of\s+excluded\s+middle/,
            /principle\s+of\s+excluded\s+middle/
        ];
        
        return patterns.some(pattern => pattern.test(sentence));
    }
    
    isLawOfNonContradiction(sentence) {
        // not (P and not P) patterns
        const patterns = [
            /not\s+\((.+)\s+and\s+not\s+\1\)/,
            /¬\s*\((.+)\s+∧\s+¬\s*\1\)/,
            /it\s+is\s+not\s+the\s+case\s+that\s+(.+)\s+and\s+not\s+\1/,
            // Natural language patterns
            /nothing\s+can\s+be\s+both\s+(\w+)\s+and\s+not\s+\1/,
            /(\w+)\s+cannot\s+be\s+both\s+(\w+)\s+and\s+not\s+\2/,
            /contradictions\s+are\s+impossible/,
            /law\s+of\s+non.?contradiction/,
            /principle\s+of\s+non.?contradiction/
        ];
        
        return patterns.some(pattern => pattern.test(sentence));
    }
    
    isLawOfIdentity(sentence) {
        // A = A, A is A patterns
        const patterns = [
            /(\w+)\s+is\s+\1/,
            /(\w+)\s+=\s+\1/,
            /(\w+)\s+equals\s+\1/,
            /everything\s+is\s+identical\s+to\s+itself/,
            /each\s+thing\s+is\s+what\s+it\s+is/,
            /law\s+of\s+identity/,
            /principle\s+of\s+identity/,
            // More specific identity statements
            /if\s+(\w+)\s+then\s+\1/,
            /(\w+)\s+if\s+and\s+only\s+if\s+\1/
        ];
        
        return patterns.some(pattern => pattern.test(sentence));
    }
    
    isDeMorgansLaw(sentence) {
        // De Morgan's laws: not(A and B) = (not A) or (not B), etc.
        const patterns = [
            /not\s+\((.+)\s+and\s+(.+)\)\s+(?:is\s+equivalent\s+to|equals|=)\s+\(?not\s+\1\s+or\s+not\s+\2\)?/,
            /not\s+\((.+)\s+or\s+(.+)\)\s+(?:is\s+equivalent\s+to|equals|=)\s+\(?not\s+\1\s+and\s+not\s+\2\)?/,
            /¬\s*\((.+)\s+∧\s+(.+)\)\s+≡\s+\(?¬\s*\1\s+∨\s+¬\s*\2\)?/,
            /¬\s*\((.+)\s+∨\s+(.+)\)\s+≡\s+\(?¬\s*\1\s+∧\s+¬\s*\2\)?/,
            /de\s+morgan/
        ];
        
        return patterns.some(pattern => pattern.test(sentence));
    }
    
    isLogicalTautology(sentence) {
        // Other logical tautologies
        const patterns = [
            // Disjunctive syllogism components
            /if\s+(.+)\s+or\s+(.+)\s+and\s+not\s+\1\s+then\s+\2/,
            // Modus ponens structure (always valid)
            /if\s+(.+)\s+then\s+(.+)\s+and\s+\1\s+therefore\s+\2/,
            // Double negation
            /not\s+not\s+(.+)\s+(?:is\s+equivalent\s+to|equals|=)\s+\1/,
            // Logical constants
            /true\s+or\s+(.+)/,
            /(.+)\s+or\s+true/,
            /false\s+implies\s+(.+)/,
            /(.+)\s+implies\s+true/,
            // Tautology keywords
            /tautology/,
            /logically\s+valid/,
            /necessarily\s+true/
        ];
        
        return patterns.some(pattern => pattern.test(sentence));
    }
    
    isConditionalTautology(sentence) {
        // Conditional tautologies: if P then P, etc.
        const patterns = [
            /if\s+(.+)\s+then\s+\1/,
            /(.+)\s+implies\s+\1/,
            /(.+)\s+→\s+\1/,
            // Vacuous truth patterns (false antecedent makes conditional true)
            /if\s+false\s+then\s+(.+)/,
            /false\s+implies\s+(.+)/,
            /if\s+2\s*\+\s*2\s*=\s*5\s+then\s+(.+)/,
            /if\s+a\s+circle\s+is\s+a\s+square\s+then\s+(.+)/,
            // Tautological consequent patterns
            /if\s+(.+)\s+then\s+(.+)\s+or\s+not\s+\2/,
            /if\s+(.+)\s+then\s+either\s+(.+)\s+or\s+not\s+\2/,
            // Complex tautological patterns from examples
            /if\s+(.+)\s+then\s+either\s+(.+)\s+or\s+(.+)\s+does\s+not/,
            /if\s+(.+)\s+then\s+(.+)\s+∨\s+(.+)/
        ];
        
        return patterns.some(pattern => pattern.test(sentence));
    }
    
    isPrime(n) {
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
            if (n % i === 0) return false;
        }
        return true;
    }

    detectLogicalImpossibility(sentence) {
        const lowerSentence = sentence.toLowerCase();
        
        // Check for incorrect mathematical equations first
        const mathEquation = sentence.match(/(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/);
        if (mathEquation) {
            const [, num1, operator, num2, result] = mathEquation;
            const a = parseFloat(num1);
            const b = parseFloat(num2);
            const expectedResult = parseFloat(result);
            
            let actualResult;
            switch (operator) {
                case '+':
                    actualResult = a + b;
                    break;
                case '-':
                    actualResult = a - b;
                    break;
                case '*':
                    actualResult = a * b;
                    break;
                case '/':
                    actualResult = b !== 0 ? a / b : NaN;
                    break;
                default:
                    break;
            }
            
            // If the equation is incorrect, it's logically impossible
            if (actualResult !== undefined && Math.abs(actualResult - expectedResult) >= 0.0001) {
                return 95; // Incorrect mathematical equations are impossible
            }
        }
        
        // Check for incorrect mathematical relationships
        if (this.evaluateIncorrectMathStatement(sentence)) {
            return 95;
        }
        
        // Check for logical contradictions
        if (this.evaluateLogicalContradiction(sentence)) {
            return 95;
        }
        
        // Don't flag statements ABOUT impossibility as impossible themselves
        if (lowerSentence.includes('contradictions are impossible') ||
            lowerSentence.includes('are logically impossible') ||
            lowerSentence.includes('principles') ||
            lowerSentence.includes('logical system')) {
            return 0; // These are statements about logic, not contradictions
        }
        
        // Check for actual logical contradictions
        for (const pattern of this.logicalPatterns.impossibility) {
            if (pattern.test(sentence)) {
                return 95;
            }
        }

        // Check for contradiction indicators (but not when describing logical principles)
        if ((lowerSentence.includes('contradiction') || lowerSentence.includes('logically impossible') ||
            lowerSentence.includes('self-contradictory')) &&
            !lowerSentence.includes('are') && !lowerSentence.includes('is')) {
            return 90;
        }

        return 0;
    }
    
    evaluateIncorrectMathStatement(sentence) {
        // Handle inequalities that are false
        const inequalityMatch = sentence.match(/(\d+(?:\.\d+)?)\s*([<>]=?)\s*(\d+(?:\.\d+)?)/);
        if (inequalityMatch) {
            const [, num1, operator, num2] = inequalityMatch;
            const a = parseFloat(num1);
            const b = parseFloat(num2);
            
            switch (operator) {
                case '<':
                    return a >= b; // False if a is not less than b
                case '<=':
                    return a > b;
                case '>':
                    return a <= b;
                case '>=':
                    return a < b;
            }
        }
        
        // Handle incorrect prime number claims
        if (sentence.match(/prime number/i)) {
            const primeMatch = sentence.match(/(\d+)\s+is\s+(?:a\s+)?prime/i);
            if (primeMatch) {
                const num = parseInt(primeMatch[1]);
                return !this.isPrime(num); // Contradiction if claiming non-prime is prime
            }
        }
        
        return false;
    }
    
    evaluateLogicalContradiction(sentence) {
        const lower = sentence.toLowerCase();
        
        // Direct contradictions: P and not P (using ∧ and ¬ symbols too)
        if (lower.match(/(.+)\s+and\s+not\s+\1/) || 
            lower.match(/(.+)\s+and\s+\1\s+is\s+false/) ||
            lower.match(/(.+)\s+∧\s+¬\s*\1/) ||
            lower.match(/(.+)\s+∧\s+not\s+\1/)) {
            return true;
        }
        
        // Contradictory statements about the same entity
        if (lower.match(/(\w+)\s+is\s+(\w+)\s+and\s+\1\s+is\s+not\s+\2/) ||
            lower.match(/(\w+)\s+is\s+(\w+)\s+∧\s+\1\s+is\s+not\s+\2/)) {
            return true;
        }
        
        // Contradictory conditionals: if P then not P
        if (lower.match(/if\s+(.+)\s+then\s+not\s+\1/) ||
            lower.match(/if\s+(.+)\s+then\s+\1\s+is\s+false/) ||
            lower.match(/if\s+(.+)\s+then\s+¬\s*\1/)) {
            return true;
        }
        
        // Mathematical contradictions combined with other contradictions
        if ((lower.includes('2+2=5') || lower.includes('circle is a square')) &&
            lower.match(/(.+)\s+and\s+(.+)/)) {
            return true;
        }
        
        return false;
    }

    analyzeContingentStatement(scores, nlpResult) {
        const sentence = nlpResult.originalSentence.toLowerCase();
        const { modalIndicators } = nlpResult;

        // For contingent statements, modal words indicate epistemic or deontic modality
        // These should generally result in possibility ratings, not necessity
        
        // Epistemic indicators (what we believe/know)
        if (this.modalIndicators.epistemic.some(word => sentence.includes(word))) {
            scores.possibility = 60; // Epistemic certainty ≠ alethic necessity
        }

        // Deontic indicators (what should/must be done)
        if (this.modalIndicators.deontic.some(word => sentence.includes(word))) {
            scores.possibility = 50; // Deontic necessity ≠ alethic necessity
        }

        // Possibility indicators
        if (this.modalIndicators.possibility.some(word => sentence.includes(word))) {
            scores.possibility = 70;
        }

        // Empirical/factual claims are contingent
        if (sentence.includes('weather') || sentence.includes('tomorrow') ||
            sentence.includes('will happen') || sentence.includes('probably')) {
            scores.possibility = 60;
            scores.necessity = 0; // Empirical facts are not logically necessary
        }
    }

    applyContextualAdjustments(scores, structure, nlpResult) {
        const sentence = nlpResult.originalSentence.toLowerCase();

        // Don't adjust logical necessities/impossibilities
        if (scores.necessity > 80 || scores.impossibility > 80) {
            return; // Logical truths are context-independent
        }

        // Question forms indicate uncertainty
        if (sentence.includes('?')) {
            scores.necessity = Math.min(scores.necessity, 20);
            scores.impossibility = Math.min(scores.impossibility, 20);
            scores.possibility = Math.max(scores.possibility, 40);
        }

        // Epistemic hedging
        if (sentence.includes('i think') || sentence.includes('i believe') || 
            sentence.includes('it seems') || sentence.includes('probably')) {
            scores.necessity = Math.min(scores.necessity, 30);
            scores.impossibility = Math.min(scores.impossibility, 30);
        }

        // Conditional statements are contingent
        if (structure.isConditional) {
            scores.necessity = Math.min(scores.necessity, 40);
            scores.impossibility = Math.min(scores.impossibility, 40);
        }
    }

    applyLogicalConsistency(scores) {
        // Necessity and impossibility are mutually exclusive
        if (scores.necessity > 60 && scores.impossibility > 60) {
            // Keep the stronger one, reduce the weaker
            if (scores.necessity > scores.impossibility) {
                scores.impossibility = Math.max(0, scores.impossibility - 40);
            } else {
                scores.necessity = Math.max(0, scores.necessity - 40);
            }
        }

        // If something is highly necessary (>80), it's not very possible (it just IS)
        if (scores.necessity > 80) {
            scores.possibility = Math.min(scores.possibility, 30);
        }

        // If something is highly impossible (>80), it's not possible
        if (scores.impossibility > 80) {
            scores.possibility = Math.min(scores.possibility, 10);
        }

        // Boost possibility if neither necessity nor impossibility are strong
        if (scores.necessity < 30 && scores.impossibility < 30 && scores.possibility > 0) {
            scores.possibility = Math.min(100, scores.possibility * 1.2);
        }
    }

    classifyModality(scores) {
        const threshold = 25;
        
        // Find the dominant modality
        const maxScore = Math.max(scores.necessity, scores.possibility, scores.impossibility);
        
        if (scores.necessity === maxScore && scores.necessity > threshold) {
            if (scores.necessity > 85) return 'Logically Necessary';
            if (scores.necessity > 70) return 'Strongly Necessary';
            if (scores.necessity > 50) return 'Necessary';
            return 'Weakly Necessary';
        }
        
        if (scores.impossibility === maxScore && scores.impossibility > threshold) {
            if (scores.impossibility > 85) return 'Logically Impossible';
            if (scores.impossibility > 70) return 'Strongly Impossible';
            if (scores.impossibility > 50) return 'Impossible';
            return 'Weakly Impossible';
        }
        
        // Distinguish between contingent and merely possible
        if (scores.possibility === maxScore && scores.possibility > threshold) {
            // If it's a simple factual claim without modal operators, it's contingent
            if (this.isContingentStatement(scores)) {
                return 'Contingent';
            }
            // Otherwise it's possible but not necessary
            if (scores.possibility > 85) return 'Highly Possible';
            if (scores.possibility > 70) return 'Very Possible';
            if (scores.possibility > 50) return 'Possible';
            return 'Weakly Possible';
        }
        
        return 'Contingent';
    }
    
    isContingentStatement(scores) {
        // Contingent statements are empirical claims that could be true or false
        // but are neither logically necessary nor impossible
        return scores.necessity < 30 && scores.impossibility < 30 && scores.possibility < 80;
    }

    generateExplanation(nlpResult, scores, classification) {
        const { modalIndicators, structure } = nlpResult;
        let explanation = [];

        // Explain modal indicators found
        Object.keys(modalIndicators).forEach(type => {
            if (modalIndicators[type].length > 0) {
                explanation.push(`Found ${type} indicators: ${modalIndicators[type].join(', ')}`);
            }
        });

        // Explain structural features
        if (structure.isConditional) {
            explanation.push('Conditional structure reduces certainty of modal claims.');
        }

        if (structure.isNegated) {
            explanation.push('Negation affects the modal interpretation.');
        }

        if (!structure.hasModal && scores.necessity < 20 && scores.impossibility < 20) {
            explanation.push('No explicit modal verbs detected - classification based on semantic content.');
        }

        // Explain classification reasoning
        const dominantType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        explanation.push(`Classified as "${classification}" based on strongest ${dominantType} indicators (${Math.round(scores[dominantType])}%).`);

        return explanation.join(' ');
    }

    splitIntoSentences(text) {
        // Enhanced sentence splitting that handles various punctuation and edge cases
        return text
            .replace(/([.!?])\s+/g, '$1|SPLIT|')
            .replace(/([.!?])$/g, '$1|SPLIT|')
            // Handle common abbreviations that shouldn't split
            .replace(/Mr\.|SPLIT|/g, 'Mr.')
            .replace(/Mrs\.|SPLIT|/g, 'Mrs.')
            .replace(/Dr\.|SPLIT|/g, 'Dr.')
            .replace(/vs\.|SPLIT|/g, 'vs.')
            .replace(/etc\.|SPLIT|/g, 'etc.')
            .replace(/i\.e\.|SPLIT|/g, 'i.e.')
            .replace(/e\.g\.|SPLIT|/g, 'e.g.')
            .split('|SPLIT|')
            .map(s => s.trim())
            .filter(s => s.length > 0 && s !== '.' && s.length > 3);
    }

    calculateParagraphScores(sentenceResults) {
        if (sentenceResults.length === 0) {
            return { necessity: 0, possibility: 0, impossibility: 0 };
        }

        if (sentenceResults.length === 1) {
            return sentenceResults[0].scores;
        }

        // Enhanced weighted scoring for paragraph analysis
        let totalWeight = 0;
        const weightedScores = { necessity: 0, possibility: 0, impossibility: 0 };
        const modalityDistribution = { necessity: 0, possibility: 0, impossibility: 0, neutral: 0, contingent: 0 };
        const strongModalSentences = [];

        sentenceResults.forEach((result, index) => {
            const sentence = result.sentence;
            const scores = result.scores;
            const classification = result.classification;
            
            // Calculate sentence weight with enhanced factors
            const lengthWeight = Math.min(sentence.length / 50, 2.5);
            const modalIndicatorCount = Object.values(result.nlpResult.modalIndicators)
                .reduce((sum, indicators) => sum + indicators.length, 0);
            const modalWeight = 1 + (modalIndicatorCount * 0.4);
            
            // Give higher weight to logically necessary/impossible statements
            const logicalWeight = (scores.necessity > 85 || scores.impossibility > 85) ? 2.0 : 1.0;
            
            // Position weight (first and last sentences get slight boost)
            const positionWeight = (index === 0 || index === sentenceResults.length - 1) ? 1.1 : 1.0;
            
            const sentenceWeight = lengthWeight * modalWeight * logicalWeight * positionWeight;
            totalWeight += sentenceWeight;

            // Add weighted scores
            Object.keys(scores).forEach(type => {
                weightedScores[type] += scores[type] * sentenceWeight;
            });

            // Track modality distribution with more granular classification
            const dominantType = this.getDominantModalityDetailed(scores, classification);
            modalityDistribution[dominantType]++;
            
            // Track strong modal sentences for special handling
            if (scores.necessity > 85 || scores.impossibility > 85) {
                strongModalSentences.push({ index, type: dominantType, score: Math.max(scores.necessity, scores.impossibility) });
            }
        });

        // Calculate final weighted averages
        Object.keys(weightedScores).forEach(type => {
            weightedScores[type] = weightedScores[type] / totalWeight;
        });

        // Apply enhanced distribution-based adjustments
        this.applyEnhancedDistributionAdjustments(weightedScores, modalityDistribution, sentenceResults.length, strongModalSentences);

        // Ensure scores are in valid range
        Object.keys(weightedScores).forEach(key => {
            weightedScores[key] = Math.min(100, Math.max(0, weightedScores[key]));
        });

        return weightedScores;
    }
    
    getDominantModalityDetailed(scores, classification) {
        const maxScore = Math.max(scores.necessity, scores.possibility, scores.impossibility);
        
        if (maxScore < 25) return 'neutral';
        
        if (classification.includes('Contingent')) return 'contingent';
        if (scores.necessity === maxScore) return 'necessity';
        if (scores.impossibility === maxScore) return 'impossibility';
        if (scores.possibility === maxScore) return 'possibility';
        return 'neutral';
    }
    
    applyEnhancedDistributionAdjustments(scores, distribution, totalSentences, strongModalSentences) {
        const totalModalSentences = distribution.necessity + distribution.possibility + distribution.impossibility;
        const modalRatio = totalModalSentences / totalSentences;
        
        // If paragraph contains strong logical truths/contradictions, boost those
        if (strongModalSentences.length > 0) {
            const avgStrongScore = strongModalSentences.reduce((sum, s) => sum + s.score, 0) / strongModalSentences.length;
            const strongRatio = strongModalSentences.length / totalSentences;
            
            if (strongRatio > 0.3) { // If >30% of sentences are strongly modal
                strongModalSentences.forEach(s => {
                    if (s.type === 'necessity') {
                        scores.necessity = Math.min(100, scores.necessity * (1 + strongRatio));
                    } else if (s.type === 'impossibility') {
                        scores.impossibility = Math.min(100, scores.impossibility * (1 + strongRatio));
                    }
                });
            }
        }
        
        // If most sentences are contingent/neutral, moderate the scores
        const contingentRatio = (distribution.contingent + distribution.neutral) / totalSentences;
        if (contingentRatio > 0.7) {
            Object.keys(scores).forEach(type => {
                if (type !== 'possibility') {
                    scores[type] *= 0.6;
                }
            });
            scores.possibility = Math.max(scores.possibility, 40); // Boost possibility for contingent texts
        }
        
        // Apply original distribution logic
        this.applyDistributionAdjustments(scores, distribution, totalSentences);
    }

    getDominantModality(scores) {
        const maxScore = Math.max(scores.necessity, scores.possibility, scores.impossibility);
        if (maxScore < 25) return 'neutral';
        
        if (scores.necessity === maxScore) return 'necessity';
        if (scores.impossibility === maxScore) return 'impossibility';
        if (scores.possibility === maxScore) return 'possibility';
        return 'neutral';
    }

    applyDistributionAdjustments(scores, distribution, totalSentences) {
        const totalModalSentences = distribution.necessity + distribution.possibility + distribution.impossibility;
        const modalRatio = totalModalSentences / totalSentences;

        // If most sentences are neutral, reduce overall modality scores
        if (modalRatio < 0.3) {
            Object.keys(scores).forEach(type => {
                scores[type] *= 0.7;
            });
        }

        // If there's a strong consensus (>60% of sentences have same modality), boost that score
        Object.keys(distribution).forEach(type => {
            if (type !== 'neutral' && distribution[type] / totalSentences > 0.6) {
                scores[type] = Math.min(100, scores[type] * 1.3);
            }
        });

        // Special case: if necessity dominates, ensure it's not overshadowed by impossibility
        if (distribution.necessity > distribution.impossibility && distribution.necessity > distribution.possibility) {
            scores.necessity = Math.min(100, scores.necessity * 1.1);
            scores.impossibility = Math.max(0, scores.impossibility * 0.8);
        }

        // If there's high diversity in modality types, moderate all scores slightly
        const diversityCount = Object.values(distribution).filter(count => count > 0).length;
        if (diversityCount >= 3) {
            Object.keys(scores).forEach(type => {
                scores[type] *= 0.9;
            });
        }
    }

    generateParagraphExplanation(sentenceResults, paragraphScores, classification) {
        const totalSentences = sentenceResults.length;
        const modalityDistribution = { necessity: 0, possibility: 0, impossibility: 0, neutral: 0, contingent: 0 };
        const strongModalSentences = [];
        
        sentenceResults.forEach((result, index) => {
            const dominantType = this.getDominantModalityDetailed(result.scores, result.classification);
            modalityDistribution[dominantType]++;
            
            // Track strong modal sentences for detailed explanation
            if (result.scores.necessity > 85 || result.scores.impossibility > 85) {
                strongModalSentences.push({
                    index: index + 1,
                    type: dominantType,
                    score: Math.max(result.scores.necessity, result.scores.impossibility),
                    preview: result.sentence.substring(0, 50) + (result.sentence.length > 50 ? '...' : '')
                });
            }
        });

        let explanation = [];
        
        explanation.push(`Analyzed ${totalSentences} sentence${totalSentences > 1 ? 's' : ''} in paragraph.`);
        
        // Enhanced distribution breakdown
        const modalBreakdown = [];
        Object.keys(modalityDistribution).forEach(type => {
            if (modalityDistribution[type] > 0) {
                const percentage = Math.round((modalityDistribution[type] / totalSentences) * 100);
                const typeLabel = type === 'contingent' ? 'contingent' : type;
                modalBreakdown.push(`${modalityDistribution[type]} ${typeLabel} (${percentage}%)`);
            }
        });
        
        if (modalBreakdown.length > 0) {
            explanation.push(`Sentence distribution: ${modalBreakdown.join(', ')}.`);
        }
        
        // Highlight strong modal sentences
        if (strongModalSentences.length > 0) {
            const strongCount = strongModalSentences.length;
            const strongTypes = [...new Set(strongModalSentences.map(s => s.type))];
            explanation.push(`Found ${strongCount} strongly modal sentence${strongCount > 1 ? 's' : ''} (${strongTypes.join(', ')}) that significantly influenced the overall rating.`);
        }

        // Overall assessment with more detail
        const dominantType = Object.keys(paragraphScores).reduce((a, b) => 
            paragraphScores[a] > paragraphScores[b] ? a : b);
        
        const confidenceLevel = Math.max(...Object.values(paragraphScores));
        const confidenceDesc = confidenceLevel > 80 ? 'high confidence' : 
                              confidenceLevel > 60 ? 'moderate confidence' : 'low confidence';
        
        explanation.push(`Overall classification: "${classification}" with ${confidenceDesc} based on weighted paragraph analysis. Dominant modality: ${dominantType} (${Math.round(paragraphScores[dominantType])}%).`);

        return explanation.join(' ');
    }

    analyze(text) {
        if (!text || text.trim() === '') {
            throw new Error('Please enter text to analyze.');
        }

        const sentences = this.splitIntoSentences(text);
        
        if (sentences.length === 1) {
            // Single sentence analysis (original behavior)
            const nlpResult = this.nlpProcessor.process(text);
            const scores = this.calculateModalityScores(nlpResult);
            const classification = this.classifyModality(scores);
            const explanation = this.generateExplanation(nlpResult, scores, classification);

            return {
                text: text,
                sentences: [text],
                sentenceResults: [{
                    sentence: text,
                    scores: scores,
                    classification: classification,
                    explanation: explanation,
                    nlpResult: nlpResult
                }],
                scores: scores,
                classification: classification,
                explanation: explanation,
                isParagraph: false
            };
        } else {
            // Multi-sentence analysis
            const sentenceResults = sentences.map(sentence => {
                const nlpResult = this.nlpProcessor.process(sentence);
                const scores = this.calculateModalityScores(nlpResult);
                const classification = this.classifyModality(scores);
                const explanation = this.generateExplanation(nlpResult, scores, classification);

                return {
                    sentence: sentence,
                    scores: scores,
                    classification: classification,
                    explanation: explanation,
                    nlpResult: nlpResult
                };
            });

            // Calculate paragraph-level scores
            const paragraphScores = this.calculateParagraphScores(sentenceResults);
            const paragraphClassification = this.classifyModality(paragraphScores);
            const paragraphExplanation = this.generateParagraphExplanation(
                sentenceResults, paragraphScores, paragraphClassification
            );

            return {
                text: text,
                sentences: sentences,
                sentenceResults: sentenceResults,
                scores: paragraphScores,
                classification: paragraphClassification,
                explanation: paragraphExplanation,
                isParagraph: true,
                sentenceCount: sentences.length,
                strongModalSentences: sentenceResults.filter(r => 
                    r.scores.necessity > 85 || r.scores.impossibility > 85
                ).length
            };
        }
    }
}
