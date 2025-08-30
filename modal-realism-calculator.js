class ModalRealismCalculator {
    constructor() {
        // Variable mapping system: numbers to alphabetical variables
        this.variableMap = new Map();
        this.reverseVariableMap = new Map();
        this.nextVariableIndex = 0;
        this.alphabet = 'abcdefghijklmnopqrstuvwxyz';
        
        // Modal realism evaluation patterns
        this.modalRealismPatterns = {
            // Possible worlds discourse
            possibleWorlds: [
                /in\s+(?:some|another|other)\s+(?:possible\s+)?world/i,
                /there\s+(?:is|exists)\s+a\s+world\s+where/i,
                /in\s+world\s+\w+/i,
                /across\s+(?:all\s+)?possible\s+worlds/i,
                /in\s+every\s+possible\s+world/i,
                /necessarily\s+true\s+in\s+all\s+worlds/i
            ],
            
            // Modal operators with variables
            necessity: [
                /necessarily\s+(\w+)/i,
                /□\s*(\w+)/i,
                /it\s+is\s+necessary\s+that\s+(\w+)/i,
                /(\w+)\s+must\s+be\s+true/i
            ],
            
            possibility: [
                /possibly\s+(\w+)/i,
                /◇\s*(\w+)/i,
                /it\s+is\s+possible\s+that\s+(\w+)/i,
                /(\w+)\s+might\s+be\s+true/i,
                /(\w+)\s+could\s+be\s+the\s+case/i
            ],
            
            // Counterfactuals
            counterfactuals: [
                /if\s+(\w+)\s+were\s+(?:true|the\s+case),?\s+then\s+(\w+)/i,
                /(\w+)\s+would\s+be\s+true\s+if\s+(\w+)/i,
                /in\s+a\s+world\s+where\s+(\w+),?\s+(\w+)\s+would\s+hold/i
            ],
            
            // Modal logic formulas
            modalFormulas: [
                /□\s*\(\s*(\w+)\s*→\s*(\w+)\s*\)/i,
                /◇\s*\(\s*(\w+)\s*∧\s*(\w+)\s*\)/i,
                /¬\s*□\s*(\w+)/i,
                /□\s*(\w+)\s*→\s*□\s*(\w+)/i
            ]
        };
        
        // Modal realism principles
        this.modalRealismPrinciples = {
            // David Lewis's modal realism tenets
            lewisianPrinciples: [
                'principle of recombination',
                'principle of plenitude', 
                'principle of isolation',
                'principle of ways things could have been'
            ],
            
            // Evaluation criteria
            worldsExist: /(?:possible\s+)?worlds\s+(?:actually\s+)?exist/i,
            worldsAsConcrete: /worlds\s+are\s+(?:concrete|physical|real)/i,
            worldsIsolated: /worlds\s+are\s+(?:causally\s+)?isolated/i,
            indexicalTheory: /our\s+world\s+is\s+(?:merely\s+)?indexical/i
        };
    }
    
    // Convert numbers to alphabetical variables
    numberToVariable(num) {
        if (this.variableMap.has(num)) {
            return this.variableMap.get(num);
        }
        
        const variable = this.generateNextVariable();
        this.variableMap.set(num, variable);
        this.reverseVariableMap.set(variable, num);
        return variable;
    }
    
    generateNextVariable() {
        if (this.nextVariableIndex < 26) {
            return this.alphabet[this.nextVariableIndex++];
        } else {
            // For more than 26 variables, use aa, ab, ac, etc.
            const firstIndex = Math.floor((this.nextVariableIndex - 26) / 26);
            const secondIndex = (this.nextVariableIndex - 26) % 26;
            this.nextVariableIndex++;
            return this.alphabet[firstIndex] + this.alphabet[secondIndex];
        }
    }
    
    // Convert mathematical expressions to use variables
    convertExpression(expression) {
        // Replace numbers with variables
        return expression.replace(/\d+(?:\.\d+)?/g, (match) => {
            const num = parseFloat(match);
            return this.numberToVariable(num);
        });
    }
    
    // Parse modal statements and extract propositions
    parseModalStatement(statement) {
        const propositions = new Set();
        const modalOperators = [];
        const worldReferences = [];
        
        // Extract propositions (simple predicates)
        const propPattern = /([A-Z][a-zA-Z]*)\s*\(\s*([a-z]+)\s*\)/g;
        let match;
        while ((match = propPattern.exec(statement)) !== null) {
            propositions.add(`${match[1]}(${match[2]})`);
        }
        
        // Extract modal operators
        const modalPattern = /([□◇¬])\s*([A-Za-z()]+)/g;
        while ((match = modalPattern.exec(statement)) !== null) {
            modalOperators.push({
                operator: match[1],
                scope: match[2]
            });
        }
        
        // Extract world references
        const worldPattern = /(?:in\s+)?world\s+(\w+)/gi;
        while ((match = worldPattern.exec(statement)) !== null) {
            worldReferences.push(match[1]);
        }
        
        return {
            propositions: Array.from(propositions),
            modalOperators,
            worldReferences,
            originalStatement: statement
        };
    }
    
    // Evaluate modal realism implications
    evaluateModalRealism(statement) {
        const analysis = this.parseModalStatement(statement);
        const scores = {
            modalRealism: 0,
            possibleWorlds: 0,
            necessity: 0,
            possibility: 0,
            counterfactual: 0
        };
        
        const lower = statement.toLowerCase();
        
        // Check for possible worlds discourse
        this.modalRealismPatterns.possibleWorlds.forEach(pattern => {
            if (pattern.test(lower)) {
                scores.possibleWorlds += 25;
                scores.modalRealism += 15;
            }
        });
        
        // Check for modal operators
        this.modalRealismPatterns.necessity.forEach(pattern => {
            if (pattern.test(lower)) {
                scores.necessity += 30;
                scores.modalRealism += 10;
            }
        });
        
        this.modalRealismPatterns.possibility.forEach(pattern => {
            if (pattern.test(lower)) {
                scores.possibility += 30;
                scores.modalRealism += 10;
            }
        });
        
        // Check for counterfactuals
        this.modalRealismPatterns.counterfactuals.forEach(pattern => {
            if (pattern.test(lower)) {
                scores.counterfactual += 40;
                scores.modalRealism += 20;
            }
        });
        
        // Check for modal realism principles
        Object.values(this.modalRealismPrinciples.worldsExist).forEach(pattern => {
            if (typeof pattern === 'object' && pattern.test && pattern.test(lower)) {
                scores.modalRealism += 30;
            }
        });
        
        // Boost score based on complexity
        if (analysis.modalOperators.length > 1) {
            scores.modalRealism += analysis.modalOperators.length * 5;
        }
        
        if (analysis.worldReferences.length > 0) {
            scores.possibleWorlds += analysis.worldReferences.length * 15;
            scores.modalRealism += analysis.worldReferences.length * 10;
        }
        
        // Normalize scores
        Object.keys(scores).forEach(key => {
            scores[key] = Math.min(100, Math.max(0, scores[key]));
        });
        
        return {
            scores,
            analysis,
            classification: this.classifyModalRealism(scores),
            variableMapping: Object.fromEntries(this.variableMap),
            convertedStatement: this.convertExpression(statement)
        };
    }
    
    classifyModalRealism(scores) {
        if (scores.modalRealism > 70) {
            return 'Strong Modal Realism';
        } else if (scores.modalRealism > 50) {
            return 'Moderate Modal Realism';
        } else if (scores.modalRealism > 30) {
            return 'Weak Modal Realism';
        } else if (scores.possibleWorlds > 40 || scores.counterfactual > 40) {
            return 'Modal Discourse';
        } else {
            return 'Non-Modal';
        }
    }
    
    // Generate modal realism explanation
    generateExplanation(result) {
        const { scores, analysis, classification, variableMapping } = result;
        const explanations = [];
        
        if (Object.keys(variableMapping).length > 0) {
            const mappings = Object.entries(variableMapping)
                .map(([num, var_]) => `${num} → ${var_}`)
                .join(', ');
            explanations.push(`Variable mappings: ${mappings}.`);
        }
        
        if (analysis.propositions.length > 0) {
            explanations.push(`Found ${analysis.propositions.length} proposition(s): ${analysis.propositions.join(', ')}.`);
        }
        
        if (analysis.modalOperators.length > 0) {
            const operators = analysis.modalOperators.map(op => `${op.operator}${op.scope}`).join(', ');
            explanations.push(`Modal operators detected: ${operators}.`);
        }
        
        if (analysis.worldReferences.length > 0) {
            explanations.push(`References to ${analysis.worldReferences.length} possible world(s): ${analysis.worldReferences.join(', ')}.`);
        }
        
        if (scores.counterfactual > 30) {
            explanations.push('Contains counterfactual reasoning.');
        }
        
        if (scores.modalRealism > 50) {
            explanations.push('Strong indicators of modal realist commitments.');
        }
        
        explanations.push(`Classification: "${classification}" based on modal realism score of ${Math.round(scores.modalRealism)}%.`);
        
        return explanations.join(' ');
    }
    
    // Analyze complex modal statements
    analyze(statement) {
        if (!statement || statement.trim() === '') {
            throw new Error('Please enter a statement to analyze.');
        }
        
        const result = this.evaluateModalRealism(statement);
        const explanation = this.generateExplanation(result);
        
        return {
            originalStatement: statement,
            convertedStatement: result.convertedStatement,
            scores: result.scores,
            classification: result.classification,
            explanation: explanation,
            analysis: result.analysis,
            variableMapping: result.variableMapping,
            modalRealismLevel: this.getModalRealismLevel(result.scores.modalRealism)
        };
    }
    
    getModalRealismLevel(score) {
        if (score > 80) return 'Extreme Modal Realism';
        if (score > 60) return 'Strong Modal Realism';
        if (score > 40) return 'Moderate Modal Realism';
        if (score > 20) return 'Weak Modal Realism';
        return 'Minimal Modal Commitment';
    }
    
    // Reset variable mappings
    resetVariables() {
        this.variableMap.clear();
        this.reverseVariableMap.clear();
        this.nextVariableIndex = 0;
    }
}
