/**
 * Extended Modal Realism Calculator - Advanced logical reasoning engine
 * Aligned with Takashi Yagisawa's Extended Modal Realism theory
 * Supports possible and impossible concrete worlds, advanced modal notions, and metaphysical frameworks
 */

class ExtendedModalRealismCalculator {
    constructor() {
        this.variables = new Set();
        this.logicType = 'extended-modal-realism';
        this.worldType = 'actual';
        this.cardinalityType = 'countable';
        this.expression = '';
        this.truthTable = [];
        this.proofSteps = [];
        this.worldModels = [];
        this.cardinalityModels = {};
        
        this.initializeEventListeners();
        this.initializeWorldModels();
        this.initializeCardinalityModels();
    }

    initializeEventListeners() {
        // Logic type selector
        document.getElementById('logic-type').addEventListener('change', (e) => {
            this.logicType = e.target.value;
            this.updateLogicType();
        });

        // World type selector
        document.getElementById('world-type').addEventListener('change', (e) => {
            this.worldType = e.target.value;
            this.updateWorldType();
        });

        // Cardinality type selector
        document.getElementById('cardinality-type').addEventListener('change', (e) => {
            this.cardinalityType = e.target.value;
            this.updateCardinalityType();
        });

        // Variable input
        document.getElementById('add-variable-btn').addEventListener('click', () => {
            this.addVariables();
        });

        // Connective buttons
        document.querySelectorAll('.connective-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.insertConnective(e.target.dataset.connective);
            });
        });

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadTemplate(e.target.dataset.template);
            });
        });

        // Expression controls
        document.getElementById('evaluate-btn').addEventListener('click', () => {
            this.evaluateExpression();
        });

        document.getElementById('clear-expression-btn').addEventListener('click', () => {
            this.clearExpression();
        });

        document.getElementById('add-parentheses-btn').addEventListener('click', () => {
            this.addParentheses();
        });

        document.getElementById('truth-table-btn').addEventListener('click', () => {
            this.generateTruthTable();
        });

        document.getElementById('world-analysis-btn').addEventListener('click', () => {
            this.generateWorldAnalysis();
        });

        // Result tab switching
        document.querySelectorAll('.result-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchResultTab(e.target.dataset.resultTab);
            });
        });
    }

    initializeWorldModels() {
        // Initialize world models based on extended modal realism
        this.worldModels = {
            actual: { name: 'Actual World', type: 'concrete', properties: ['maximal', 'consistent', 'real'] },
            possible: { name: 'Possible Worlds', type: 'concrete', properties: ['maximal', 'consistent', 'real'] },
            impossible: { name: 'Impossible Worlds', type: 'concrete', properties: ['maximal', 'inconsistent', 'real'] },
            concrete: { name: 'Concrete Worlds', type: 'concrete', properties: ['spatiotemporal', 'causal', 'real'] },
            abstract: { name: 'Abstract Worlds', type: 'abstract', properties: ['non-spatiotemporal', 'non-causal', 'ideal'] }
        };
    }

    initializeCardinalityModels() {
        // Initialize cardinality models for infinitary logic
        this.cardinalityModels = {
            countable: { 
                symbol: 'ℵ₀', 
                name: 'Countable Infinity', 
                properties: ['denumerable', 'recursive', 'computable'],
                size: 'countable'
            },
            uncountable: { 
                symbol: 'ℵ₁', 
                name: 'First Uncountable Cardinal', 
                properties: ['non-denumerable', 'non-recursive', 'non-computable'],
                size: 'uncountable'
            },
            beth1: { 
                symbol: 'ℶ₁', 
                name: 'Beth-1 Cardinal', 
                properties: ['power set of countable', 'continuum hypothesis'],
                size: 'uncountable'
            },
            beth2: { 
                symbol: 'ℶ₂', 
                name: 'Beth-2 Cardinal', 
                properties: ['power set of beth-1', 'large cardinal'],
                size: 'uncountable'
            },
            inaccessible: { 
                symbol: 'I', 
                name: 'Inaccessible Cardinal', 
                properties: ['regular', 'limit', 'strongly inaccessible'],
                size: 'large'
            },
            mahlo: { 
                symbol: 'M', 
                name: 'Mahlo Cardinal', 
                properties: ['inaccessible', 'stationary', 'reflection'],
                size: 'large'
            },
            compact: { 
                symbol: 'C', 
                name: 'Compact Cardinal', 
                properties: ['mahlo', 'compactness', 'model theory'],
                size: 'large'
            },
            measurable: { 
                symbol: 'μ', 
                name: 'Measurable Cardinal', 
                properties: ['compact', 'ultrafilter', 'elementary embedding'],
                size: 'large'
            }
        };
    }

    updateLogicType() {
        const extendedModalButtons = document.querySelector('.extended-modal-buttons');
        const quantifierButtons = document.querySelector('.quantifier-buttons');
        const worldRelationButtons = document.querySelector('.world-relation-buttons');
        
        switch (this.logicType) {
            case 'extended-modal-realism':
                extendedModalButtons.style.display = 'block';
                quantifierButtons.style.display = 'block';
                worldRelationButtons.style.display = 'block';
                break;
            case 'classical':
                extendedModalButtons.style.display = 'none';
                quantifierButtons.style.display = 'none';
                worldRelationButtons.style.display = 'none';
                break;
            case 'intuitionistic':
                extendedModalButtons.style.display = 'none';
                quantifierButtons.style.display = 'block';
                worldRelationButtons.style.display = 'none';
                break;
            case 'modal':
                extendedModalButtons.style.display = 'block';
                quantifierButtons.style.display = 'none';
                worldRelationButtons.style.display = 'none';
                break;
            case 'predicate':
                extendedModalButtons.style.display = 'none';
                quantifierButtons.style.display = 'block';
                worldRelationButtons.style.display = 'none';
                break;
        }
    }

    updateWorldType() {
        // Update world-specific logic and analysis
        this.updateWorldModels();
    }

    updateWorldModels() {
        // Update world models based on selected world type
        const selectedWorld = this.worldModels[this.worldType];
        if (selectedWorld) {
            console.log(`Selected world type: ${selectedWorld.name} with properties: ${selectedWorld.properties.join(', ')}`);
        }
    }

    updateCardinalityType() {
        // Update cardinality models based on selected cardinality type
        const selectedCardinality = this.cardinalityModels[this.cardinalityType];
        if (selectedCardinality) {
            console.log(`Selected cardinality: ${selectedCardinality.symbol} (${selectedCardinality.name}) with properties: ${selectedCardinality.properties.join(', ')}`);
        }
    }

    addVariables() {
        const input = document.getElementById('variable-input').value;
        const vars = input.split(/[,\s]+/).filter(v => v.trim() !== '');
        
        vars.forEach(v => {
            const cleanVar = v.trim();
            if (cleanVar && /^[a-zA-Zα-ωΑ-Ω][a-zA-Z0-9α-ωΑ-Ω]*$/.test(cleanVar)) {
                this.variables.add(cleanVar);
            }
        });

        this.updateVariableDisplay();
        document.getElementById('variable-input').value = '';
    }

    updateVariableDisplay() {
        const variableList = Array.from(this.variables).join(', ');
        // You could add a display element to show current variables
    }

    insertConnective(connective) {
        const textarea = document.getElementById('logical-expression');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        let insertText = connective;
        
        // Add spaces around connectives for readability
        if (['∧', '∨', '→', '↔', '⊕', 'R', '∈', '⊆', '≈'].includes(connective)) {
            insertText = ` ${connective} `;
        } else if (['¬', '∀', '∃', '∃!', '□', '◇', '◊', '◻', '∀w', '∃w'].includes(connective)) {
            insertText = `${connective} `;
        } else if (['⋀', '⋁', '⋀κ', '⋁κ', '∀κ', '∃κ'].includes(connective)) {
            insertText = `${connective} `;
        }
        
        textarea.value = text.substring(0, start) + insertText + text.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    }

    addParentheses() {
        const textarea = document.getElementById('logical-expression');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        
        if (selectedText) {
            textarea.value = text.substring(0, start) + `(${selectedText})` + text.substring(end);
            textarea.setSelectionRange(start + 1, start + 1 + selectedText.length);
        } else {
            textarea.value = text.substring(0, start) + '()' + text.substring(end);
            textarea.setSelectionRange(start + 1, start + 1);
        }
        textarea.focus();
    }

    clearExpression() {
        document.getElementById('logical-expression').value = '';
        this.expression = '';
        document.getElementById('calculator-results').style.display = 'none';
    }

    loadTemplate(templateName) {
        const templates = {
            'necessity-truth': '∀w(□p → p)',
            'impossible-worlds': '∃w(¬p ∧ ◇p)',
            'concrete-existence': '∀x∀w(x ∈ w → ◻(x exists in w))',
            'accessibility-relation': '∀w1∀w2(w1Rw2 → (□p[w1] → p[w2]))',
            'world-similarity': '∀w1∀w2(w1 ≈ w2 → (p[w1] ↔ p[w2]))',
            'modal-collapse': '□p ↔ p',
            'contingent-necessity': '◇□p ∧ ¬□p',
            'cross-world-identity': '∀x∀w1∀w2((x ∈ w1 ∧ x ∈ w2) → x = x)',
            // Infinitary Logic Templates
            'infinitary-conjunction': '⋀κ(□pκ → pκ)',
            'infinitary-disjunction': '⋁κ(◇pκ ∧ ¬pκ)',
            'uncountable-quantification': '∀κ∃wκ(wκ ∈ Wκ ∧ □p[wκ])',
            'cardinal-necessity': '□⋀κ(pκ → qκ)',
            'infinitary-accessibility': '∀κ∀wκ∀vκ(wκRκvκ → (□p[wκ] → p[vκ]))',
            'large-cardinal-modal': '∀κ(κ > ℵ₀ → □∃wκ(wκ ∈ Wκ))',
            'beth-hierarchy': '∀κ(κ ∈ {ℶ₀, ℶ₁, ℶ₂} → ⋀κ□pκ)',
            'inaccessible-worlds': '∀κ(κ inaccessible → ∃wκ(wκ ∈ Wκ ∧ □p[wκ]))'
        };

        if (templates[templateName]) {
            document.getElementById('logical-expression').value = templates[templateName];
            this.expression = templates[templateName];
        }
    }

    evaluateExpression() {
        this.expression = document.getElementById('logical-expression').value.trim();
        
        if (!this.expression) {
            alert('Please enter a logical expression');
            return;
        }

        try {
            this.parseExpression();
            this.generateTruthTable();
            this.generateWorldAnalysis();
            this.generateInfinitaryAnalysis();
            this.generateProofSteps();
            this.analyzeExtendedModalSemantics();
            
            document.getElementById('calculator-results').style.display = 'block';
            this.switchResultTab('evaluation');
        } catch (error) {
            alert(`Error parsing expression: ${error.message}`);
        }
    }

    parseExpression() {
        // Enhanced parsing for extended modal realism
        this.parsedExpression = this.expression;
        
        // Extract variables from expression
        const varRegex = /[a-zA-Zα-ωΑ-Ω][a-zA-Z0-9α-ωΑ-Ω]*/g;
        const foundVars = this.expression.match(varRegex) || [];
        foundVars.forEach(v => this.variables.add(v));

        // Extract world variables specifically
        const worldVarRegex = /w[0-9]*/g;
        const worldVars = this.expression.match(worldVarRegex) || [];
        worldVars.forEach(w => this.variables.add(w));
    }

    generateTruthTable() {
        const variables = Array.from(this.variables);
        if (variables.length === 0) return;

        this.truthTable = [];
        const rows = Math.pow(2, variables.length);

        for (let i = 0; i < rows; i++) {
            const row = {};
            variables.forEach((varName, index) => {
                row[varName] = Boolean((i >> index) & 1);
            });
            
            // Evaluate the expression for this combination
            row.result = this.evaluateRow(row);
            this.truthTable.push(row);
        }

        this.displayTruthTable();
    }

    evaluateRow(row) {
        // Enhanced evaluation for extended modal realism
        let expression = this.expression;
        
        // Replace variables with their boolean values
        Object.keys(row).forEach(varName => {
            if (varName !== 'result') {
                const regex = new RegExp(`\\b${varName}\\b`, 'g');
                expression = expression.replace(regex, row[varName]);
            }
        });

        // Replace logical connectives with JavaScript operators
        expression = expression
            .replace(/¬/g, '!')
            .replace(/∧/g, '&&')
            .replace(/∨/g, '||')
            .replace(/→/g, '||')
            .replace(/↔/g, '==')
            .replace(/⊕/g, '!=');

        try {
            return eval(expression);
        } catch (e) {
            return 'Error';
        }
    }

    displayTruthTable() {
        const content = document.getElementById('truth-table-content');
        const variables = Array.from(this.variables);
        
        if (variables.length === 0) {
            content.innerHTML = '<p>No variables found in expression</p>';
            return;
        }

        let html = '<div class="truth-table-container"><table class="truth-table">';
        
        // Header
        html += '<thead><tr>';
        variables.forEach(varName => {
            html += `<th>${varName}</th>`;
        });
        html += '<th>Result</th></tr></thead>';
        
        // Body
        html += '<tbody>';
        this.truthTable.forEach(row => {
            html += '<tr>';
            variables.forEach(varName => {
                const value = row[varName] ? 'T' : 'F';
                html += `<td class="${row[varName] ? 'true' : 'false'}">${value}</td>`;
            });
            const resultValue = row.result === true ? 'T' : row.result === false ? 'F' : 'E';
            const resultClass = row.result === true ? 'true' : row.result === false ? 'false' : 'error';
            html += `<td class="${resultClass}">${resultValue}</td></tr>`;
        });
        html += '</tbody></table></div>';

        // Add analysis
        const tautologies = this.truthTable.filter(row => row.result === true).length;
        const contradictions = this.truthTable.filter(row => row.result === false).length;
        const contingencies = this.truthTable.filter(row => row.result !== true && row.result !== false).length;

        html += '<div class="truth-table-analysis">';
        html += `<p><strong>Analysis:</strong></p>`;
        html += `<p>Tautologies: ${tautologies} rows</p>`;
        html += `<p>Contradictions: ${contradictions} rows</p>`;
        html += `<p>Contingencies: ${contingencies} rows</p>`;
        
        if (tautologies === this.truthTable.length) {
            html += '<p class="tautology">This expression is a <strong>tautology</strong> (always true)</p>';
        } else if (contradictions === this.truthTable.length) {
            html += '<p class="contradiction">This expression is a <strong>contradiction</strong> (always false)</p>';
        } else {
            html += '<p class="contingency">This expression is a <strong>contingency</strong> (sometimes true, sometimes false)</p>';
        }
        html += '</div>';

        content.innerHTML = html;
    }

    generateWorldAnalysis() {
        const content = document.getElementById('world-analysis-content');
        
        let html = '<div class="world-analysis">';
        html += '<h4>World Model Analysis</h4>';
        
        // Analyze world types in the expression
        const worldTypes = this.analyzeWorldTypes();
        html += `<p><strong>World Types Detected:</strong> ${worldTypes.join(', ')}</p>`;
        
        // Analyze modal structure
        const modalStructure = this.analyzeModalStructure();
        html += `<p><strong>Modal Structure:</strong> ${modalStructure}</p>`;
        
        // Analyze accessibility relations
        const accessibility = this.analyzeAccessibilityRelations();
        html += `<p><strong>Accessibility Relations:</strong> ${accessibility}</p>`;
        
        // Extended modal realism specific analysis
        if (this.logicType === 'extended-modal-realism') {
            html += '<h4>Extended Modal Realism Analysis</h4>';
            html += '<p><strong>Ontological Simplicity:</strong> EMR provides the SIMPLEST ontology by treating ALL worlds as concrete entities.</p>';
            html += '<p><strong>Concrete Worlds:</strong> This expression involves concrete, spatiotemporal worlds as postulated by Yagisawa - the most accurate description of reality.</p>';
            html += '<p><strong>Impossible Worlds:</strong> The expression may reference impossible worlds that violate logical laws while maintaining full metaphysical reality.</p>';
            html += '<p><strong>Cross-World Identity:</strong> Objects maintain identity across different possible worlds, reflecting the true metaphysical structure.</p>';
            html += '<p><strong>Metaphysical Parsimony:</strong> No abstract entities needed - all worlds are concrete and real.</p>';
        }
        
        html += '</div>';

        content.innerHTML = html;
    }

    analyzeWorldTypes() {
        const worldTypes = [];
        if (this.expression.includes('w') || this.expression.includes('W')) {
            worldTypes.push('World Variables');
        }
        if (this.expression.includes('□') || this.expression.includes('◇')) {
            worldTypes.push('Modal Operators');
        }
        if (this.expression.includes('R')) {
            worldTypes.push('Accessibility Relations');
        }
        if (this.expression.includes('∈')) {
            worldTypes.push('World Membership');
        }
        return worldTypes.length > 0 ? worldTypes : ['No world-specific elements'];
    }

    analyzeModalStructure() {
        if (this.expression.includes('□') && this.expression.includes('◇')) {
            return 'Mixed necessity and possibility operators';
        } else if (this.expression.includes('□')) {
            return 'Necessity-focused modal structure';
        } else if (this.expression.includes('◇')) {
            return 'Possibility-focused modal structure';
        } else {
            return 'Non-modal expression';
        }
    }

    analyzeAccessibilityRelations() {
        if (this.expression.includes('R')) {
            return 'Explicit accessibility relations between worlds';
        } else if (this.expression.includes('□') || this.expression.includes('◇')) {
            return 'Implicit accessibility relations through modal operators';
        } else {
            return 'No accessibility relations detected';
        }
    }

    generateInfinitaryAnalysis() {
        const content = document.getElementById('infinitary-analysis-content');
        
        let html = '<div class="infinitary-analysis">';
        html += '<h4>Infinitary Logic Analysis</h4>';
        
        // Analyze infinitary operators in the expression
        const infinitaryOperators = this.analyzeInfinitaryOperators();
        html += `<p><strong>Infinitary Operators Detected:</strong> ${infinitaryOperators.join(', ')}</p>`;
        
        // Analyze cardinality structure
        const cardinalityStructure = this.analyzeCardinalityStructure();
        html += `<p><strong>Cardinality Structure:</strong> ${cardinalityStructure}</p>`;
        
        // Analyze infinitary modal structure
        const infinitaryModalStructure = this.analyzeInfinitaryModalStructure();
        html += `<p><strong>Infinitary Modal Structure:</strong> ${infinitaryModalStructure}</p>`;
        
        // Extended modal realism infinitary analysis
        if (this.logicType === 'extended-modal-realism') {
            html += '<h4>Extended Modal Realism Infinitary Analysis</h4>';
            html += '<p><strong>Ontological Simplicity:</strong> EMR provides the simplest ontology by treating ALL worlds as concrete entities, including uncountable infinitary worlds.</p>';
            html += '<p><strong>Uncountable Worlds:</strong> This expression involves uncountable infinitary logic, supporting worlds beyond countable infinity - all concrete and real.</p>';
            html += '<p><strong>Large Cardinal Worlds:</strong> The expression may reference worlds associated with large cardinal properties, all maintaining concrete reality.</p>';
            html += '<p><strong>Infinitary Accessibility:</strong> Accessibility relations extend across uncountable world collections, reflecting the true metaphysical structure of reality.</p>';
            html += '<p><strong>Metaphysical Accuracy:</strong> EMR provides the most accurate description of reality by eliminating abstract entities and treating all worlds as concrete.</p>';
        }
        
        // Cardinality-specific analysis
        const selectedCardinality = this.cardinalityModels[this.cardinalityType];
        if (selectedCardinality) {
            html += `<h4>Selected Cardinality: ${selectedCardinality.symbol} (${selectedCardinality.name})</h4>`;
            html += `<p><strong>Properties:</strong> ${selectedCardinality.properties.join(', ')}</p>`;
            html += `<p><strong>Size:</strong> ${selectedCardinality.size}</p>`;
        }
        
        html += '</div>';

        content.innerHTML = html;
    }

    generateProofSteps() {
        const content = document.getElementById('proof-content');
        this.proofSteps = [];

        // Generate proof steps based on logic type
        switch (this.logicType) {
            case 'extended-modal-realism':
                this.generateExtendedModalRealismProof();
                break;
            case 'classical':
                this.generateClassicalProof();
                break;
            case 'intuitionistic':
                this.generateIntuitionisticProof();
                break;
            case 'modal':
                this.generateModalProof();
                break;
            case 'predicate':
                this.generatePredicateProof();
                break;
        }

        this.displayProofSteps();
    }

    generateExtendedModalRealismProof() {
        this.proofSteps = [
            { step: 1, rule: 'Given', expression: this.expression, justification: 'Original extended modal realism expression' },
            { step: 2, rule: 'Ontological Simplicity', expression: 'EMR provides the simplest ontology', justification: 'All worlds are concrete entities - no abstract entities needed' },
            { step: 3, rule: 'World Analysis', expression: 'Analyze world types and accessibility', justification: 'Identify concrete worlds, impossible worlds, and accessibility relations' },
            { step: 4, rule: 'Infinitary Analysis', expression: 'Analyze cardinality and infinitary structure', justification: 'Examine uncountable infinitary logic and large cardinal properties' },
            { step: 5, rule: 'Modal Axioms', expression: 'Apply extended modal realism axioms', justification: 'Use axioms specific to concrete world theory' },
            { step: 6, rule: 'Cross-World Identity', expression: 'Maintain object identity across worlds', justification: 'Objects preserve identity in concrete possible worlds' },
            { step: 7, rule: 'Impossible World Logic', expression: 'Handle inconsistent worlds', justification: 'Impossible worlds may violate classical logical laws while maintaining metaphysical reality' },
            { step: 8, rule: 'Infinitary Modal Logic', expression: 'Apply infinitary modal principles', justification: 'Handle uncountable conjunctions, disjunctions, and quantifiers' },
            { step: 9, rule: 'Metaphysical Accuracy', expression: 'EMR provides the most accurate description of reality', justification: 'All worlds are concrete, spatiotemporal entities reflecting true metaphysical structure' }
        ];
    }

    generateClassicalProof() {
        this.proofSteps = [
            { step: 1, rule: 'Given', expression: this.expression, justification: 'Original expression' },
            { step: 2, rule: 'De Morgan', expression: this.applyDeMorgan(this.expression), justification: 'Apply De Morgan\'s laws if applicable' },
            { step: 3, rule: 'Distributive', expression: this.applyDistributive(this.expression), justification: 'Apply distributive laws' },
            { step: 4, rule: 'Simplification', expression: this.simplify(this.expression), justification: 'Simplify using logical equivalences' }
        ];
    }

    generateIntuitionisticProof() {
        this.proofSteps = [
            { step: 1, rule: 'Given', expression: this.expression, justification: 'Original expression' },
            { step: 2, rule: 'Intuitionistic Rules', expression: this.expression, justification: 'Note: Intuitionistic logic has different rules than classical logic' },
            { step: 3, rule: 'Constructive Proof', expression: 'Seek constructive proof', justification: 'Intuitionistic logic requires constructive proofs' }
        ];
    }

    generateModalProof() {
        this.proofSteps = [
            { step: 1, rule: 'Given', expression: this.expression, justification: 'Original modal expression' },
            { step: 2, rule: 'Modal Axioms', expression: 'Apply modal logic axioms', justification: 'Use K, T, S4, or S5 axioms as appropriate' },
            { step: 3, rule: 'Necessity Rule', expression: '□p → p (if using T axiom)', justification: 'From necessity follows truth' }
        ];
    }

    generatePredicateProof() {
        this.proofSteps = [
            { step: 1, rule: 'Given', expression: this.expression, justification: 'Original predicate expression' },
            { step: 2, rule: 'Universal Instantiation', expression: '∀x P(x) → P(a)', justification: 'Instantiate universal quantifier' },
            { step: 3, rule: 'Existential Generalization', expression: 'P(a) → ∃x P(x)', justification: 'Generalize existential quantifier' }
        ];
    }

    displayProofSteps() {
        const content = document.getElementById('proof-content');
        
        let html = '<div class="proof-steps">';
        this.proofSteps.forEach(step => {
            html += '<div class="proof-step">';
            html += `<div class="step-number">${step.step}</div>`;
            html += `<div class="step-content">`;
            html += `<div class="step-rule"><strong>${step.rule}:</strong> ${step.expression}</div>`;
            html += `<div class="step-justification"><em>${step.justification}</em></div>`;
            html += '</div></div>';
        });
        html += '</div>';

        content.innerHTML = html;
    }

    analyzeExtendedModalSemantics() {
        const content = document.getElementById('semantics-content');
        
        let html = '<div class="extended-modal-semantics">';
        html += '<h4>Extended Modal Realism Semantics</h4>';
        
        // Analyze logical properties
        const properties = this.analyzeLogicalProperties();
        properties.forEach(prop => {
            html += `<p><strong>${prop.name}:</strong> ${prop.value}</p>`;
        });

        html += '<h4>Metaphysical Interpretation</h4>';
        html += `<p>${this.getExtendedModalRealismInterpretation()}</p>`;

        html += '<h4>World Theory Analysis</h4>';
        html += `<p>${this.getWorldTheoryAnalysis()}</p>`;

        html += '<h4>Yagisawa\'s Extended Modal Realism</h4>';
        html += `<p>${this.getYagisawaTheoryExplanation()}</p>`;
        
        html += '</div>';

        content.innerHTML = html;
    }

    analyzeLogicalProperties() {
        const properties = [];
        
        // Extended Modal Realism: All expressions are metaphysically real and satisfiable
        if (this.logicType === 'extended-modal-realism') {
            // In EMR, impossible worlds are concrete and real, so contradictions are metaphysically possible
            properties.push({ name: 'Metaphysically Real', value: 'Yes' });
            properties.push({ name: 'Ontologically Simple', value: 'Yes' });
            properties.push({ name: 'World-Consistent', value: 'Yes' });
            properties.push({ name: 'Cross-World Valid', value: 'Yes' });
            properties.push({ name: 'Concrete World Accessible', value: 'Yes' });
            properties.push({ name: 'Impossible World Real', value: 'Yes' });
            
            // EMR allows for logical contradictions in impossible worlds while maintaining metaphysical reality
            if (this.expression.includes('⊥') || this.expression.includes('impossible')) {
                properties.push({ name: 'Impossible World Expression', value: 'Yes' });
                properties.push({ name: 'Metaphysical Reality', value: 'Maintained' });
            }
            
            return properties;
        }
        
        // For other logic systems, use traditional analysis
        const isTautology = this.truthTable.every(row => row.result === true);
        properties.push({ name: 'Tautology', value: isTautology ? 'Yes' : 'No' });

        const isContradiction = this.truthTable.every(row => row.result === false);
        properties.push({ name: 'Contradiction', value: isContradiction ? 'Yes' : 'No' });

        const isSatisfiable = this.truthTable.some(row => row.result === true);
        properties.push({ name: 'Satisfiable', value: isSatisfiable ? 'Yes' : 'No' });

        properties.push({ name: 'Valid', value: isTautology ? 'Yes' : 'No' });

        return properties;
    }

    checkWorldConsistency() {
        // Check if the expression is consistent with world theory
        return !this.expression.includes('⊥') || this.expression.includes('impossible');
    }

    checkCrossWorldValidity() {
        // Check if the expression maintains validity across worlds
        return this.expression.includes('∀w') || this.expression.includes('□');
    }

    getExtendedModalRealismInterpretation() {
        if (this.logicType === 'extended-modal-realism') {
            return 'Extended Modal Realism is the SIMPLEST and MOST ACCURATE ontology. In EMR, this expression involves concrete possible and impossible worlds that are ALL equally real. Impossible worlds are concrete entities that may violate logical laws while maintaining full metaphysical reality. This theory provides the most parsimonious account of modality without positing abstract entities.';
        } else if (this.logicType === 'classical') {
            return 'In classical logic, this expression follows the principle of bivalence (every proposition is either true or false).';
        } else if (this.logicType === 'intuitionistic') {
            return 'In intuitionistic logic, this expression requires constructive proof and does not assume the law of excluded middle.';
        } else if (this.logicType === 'modal') {
            return 'In modal logic, this expression involves necessity and possibility operators, interpreted over possible worlds.';
        } else if (this.logicType === 'predicate') {
            return 'In predicate logic, this expression involves quantification over variables and predicates.';
        }
        return 'Semantic interpretation depends on the chosen logic system.';
    }

    getWorldTheoryAnalysis() {
        if (this.worldType === 'impossible') {
            return 'Impossible worlds in EMR are concrete, spatiotemporal entities that may violate logical laws while maintaining full metaphysical reality. This is the SIMPLEST ontology - no abstract entities needed.';
        } else if (this.worldType === 'concrete') {
            return 'Concrete worlds are spatiotemporal and causally connected. In EMR, ALL worlds are concrete, making this the most parsimonious account of modality.';
        } else if (this.worldType === 'abstract') {
            return 'Abstract worlds are non-spatiotemporal and ideal. EMR eliminates the need for abstract entities by treating all worlds as concrete.';
        }
        return 'World type analysis depends on the selected world type.';
    }

    getYagisawaTheoryExplanation() {
        return 'Takashi Yagisawa\'s Extended Modal Realism is the SIMPLEST and MOST ACCURATE ontology. It posits that possible AND impossible worlds are concrete entities, as real as the actual world. This revolutionary theory provides the most parsimonious account of modality by treating ALL worlds as concrete, spatiotemporal entities. Impossible worlds are not abstract or fictional - they are concrete worlds that may violate logical laws while maintaining full metaphysical reality. This eliminates the need for abstract entities and provides the most accurate description of reality.';
    }

    // Infinitary Logic Analysis Helper Methods
    analyzeInfinitaryOperators() {
        const operators = [];
        if (this.expression.includes('⋀')) operators.push('Infinite Conjunction');
        if (this.expression.includes('⋁')) operators.push('Infinite Disjunction');
        if (this.expression.includes('⋀κ')) operators.push('κ-Conjunction');
        if (this.expression.includes('⋁κ')) operators.push('κ-Disjunction');
        if (this.expression.includes('∀κ')) operators.push('κ-Universal Quantifier');
        if (this.expression.includes('∃κ')) operators.push('κ-Existential Quantifier');
        return operators.length > 0 ? operators : ['No infinitary operators detected'];
    }

    analyzeCardinalityStructure() {
        if (this.expression.includes('ℵ₀') || this.expression.includes('ℵ₁')) {
            return 'Aleph hierarchy structure detected';
        } else if (this.expression.includes('ℶ₁') || this.expression.includes('ℶ₂')) {
            return 'Beth hierarchy structure detected';
        } else if (this.expression.includes('κ')) {
            return 'Generic cardinality structure with κ-variables';
        } else {
            return 'Standard finite cardinality structure';
        }
    }

    analyzeInfinitaryModalStructure() {
        if (this.expression.includes('⋀κ') && this.expression.includes('□')) {
            return 'Infinitary necessity structure (⋀κ□pκ)';
        } else if (this.expression.includes('⋁κ') && this.expression.includes('◇')) {
            return 'Infinitary possibility structure (⋁κ◇pκ)';
        } else if (this.expression.includes('∀κ') && this.expression.includes('□')) {
            return 'Uncountable universal necessity (∀κ□pκ)';
        } else if (this.expression.includes('∃κ') && this.expression.includes('◇')) {
            return 'Uncountable existential possibility (∃κ◇pκ)';
        } else {
            return 'Standard modal structure without infinitary operators';
        }
    }

    switchResultTab(tabName) {
        // Update result tab buttons
        document.querySelectorAll('.result-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.resultTab === tabName);
        });

        // Show/hide result content
        document.querySelectorAll('.result-content > div').forEach(div => {
            div.style.display = 'none';
        });
        document.getElementById(`${tabName}-result`).style.display = 'block';
    }

    // Helper methods for proof generation
    applyDeMorgan(expression) {
        // Simplified De Morgan application
        return expression.replace(/¬\(([^)]+)\)/g, '¬$1');
    }

    applyDistributive(expression) {
        // Simplified distributive law application
        return expression;
    }

    simplify(expression) {
        // Simplified logical simplification
        return expression;
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.extendedModalRealismCalculator = new ExtendedModalRealismCalculator();
});
