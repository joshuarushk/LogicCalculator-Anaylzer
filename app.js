class ModalityCalculatorApp {
    constructor() {
        this.analyzer = new ModalityAnalyzer();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const analyzeBtn = document.getElementById('analyze-btn');
        const sentenceInput = document.getElementById('sentence-input');

        analyzeBtn.addEventListener('click', () => this.analyzeSentence());
        
        // Allow Enter key to trigger analysis
        sentenceInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.analyzeSentence();
            }
        });

        // Add some example sentences for quick testing
        this.addExampleSentences();
    }

    addExampleSentences() {
        const examples = [
            // Single sentence examples
            "All triangles have three sides.",
            "2 + 2 = 4",
            "There exists a married bachelor.",
            "It might rain tomorrow.",
            "You must complete your homework.",
            
            // Paragraph examples for testing proportional scoring
            "Mathematics is built on logical foundations. All triangles necessarily have three sides. This is true by definition. However, the weather tomorrow is uncertain and might change.",
            
            "Scientific theories can be tested and verified. It is possible that new discoveries will change our understanding. Some hypotheses may prove impossible to validate. Research must continue to advance knowledge.",
            
            "In formal logic, contradictions are impossible. A statement cannot be both true and false simultaneously. Either a proposition holds or it does not. These principles are necessarily true in any logical system.",
            
            "The future remains uncertain in many ways. Climate change might accelerate beyond current predictions. New technologies could revolutionize society. However, some physical laws will always remain constant.",
            
            "Economic markets can fluctuate unpredictably. Investors must carefully analyze potential risks. Some investments may prove impossible to recover. Success requires both skill and favorable conditions."
        ];

        // Create example buttons
        const inputSection = document.querySelector('.input-section');
        const examplesDiv = document.createElement('div');
        examplesDiv.className = 'examples-section';
        examplesDiv.innerHTML = '<p><strong>Try these examples (single sentences and paragraphs):</strong></p>';

        examples.forEach(example => {
            const button = document.createElement('button');
            button.className = 'example-btn';
            button.textContent = example;
            button.addEventListener('click', () => {
                document.getElementById('sentence-input').value = example;
                this.analyzeSentence();
            });
            examplesDiv.appendChild(button);
        });

        inputSection.appendChild(examplesDiv);

        // Add CSS for example buttons
        const style = document.createElement('style');
        style.textContent = `
            .examples-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            .examples-section p {
                margin-bottom: 10px;
                color: #666;
            }
            .example-btn {
                display: block;
                margin: 8px 0;
                padding: 10px 15px;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                line-height: 1.4;
                max-height: 60px;
                overflow: hidden;
                position: relative;
            }
            .example-btn::after {
                content: '';
                position: absolute;
                bottom: 0;
                right: 0;
                width: 30px;
                height: 20px;
                background: linear-gradient(to right, transparent, #f8f9fa);
            }
            .example-btn:hover {
                background: #e9ecef;
                transform: translateY(-1px);
                max-height: none;
                overflow: visible;
            }
            .example-btn:hover::after {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    analyzeSentence() {
        const text = document.getElementById('sentence-input').value.trim();
        
        if (!text) {
            alert('Please enter text to analyze.');
            return;
        }

        try {
            // Show loading state
            this.showLoading();

            // Perform analysis
            const result = this.analyzer.analyze(text);

            // Display results
            this.displayResults(result);

        } catch (error) {
            this.showError(error.message);
        }
    }

    showLoading() {
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;
    }

    showError(message) {
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.textContent = 'Analyze Modality';
        analyzeBtn.disabled = false;
        
        alert('Error: ' + message);
    }

    displayResults(result) {
        // Reset button
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.textContent = 'Analyze Modality';
        analyzeBtn.disabled = false;

        // Show results section
        const resultsSection = document.getElementById('results-section');
        resultsSection.style.display = 'block';

        // Update modality ratings
        this.updateModalityRatings(result.scores);

        // Update classification
        document.getElementById('classification').textContent = result.classification;

        // Display sentence breakdown for paragraphs
        if (result.isParagraph) {
            this.displaySentenceBreakdown(result.sentenceResults);
            // For paragraphs, show aggregated analysis
            this.displayAggregatedAnalysis(result);
        } else {
            // Hide sentence breakdown for single sentences
            document.getElementById('sentence-breakdown').style.display = 'none';
            // Display grammatical analysis for single sentence
            this.displayGrammaticalAnalysis(result.sentenceResults[0].nlpResult);
            // Display modal indicators for single sentence
            this.displayModalIndicators(result.sentenceResults[0].nlpResult.modalIndicators);
        }

        // Display explanation
        document.getElementById('explanation').textContent = result.explanation;

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    updateModalityRatings(scores) {
        // Update necessity
        const necessityBar = document.getElementById('necessity-bar');
        const necessityValue = document.getElementById('necessity-value');
        necessityBar.style.width = `${scores.necessity}%`;
        necessityValue.textContent = `${Math.round(scores.necessity)}%`;

        // Update possibility
        const possibilityBar = document.getElementById('possibility-bar');
        const possibilityValue = document.getElementById('possibility-value');
        possibilityBar.style.width = `${scores.possibility}%`;
        possibilityValue.textContent = `${Math.round(scores.possibility)}%`;

        // Update impossibility
        const impossibilityBar = document.getElementById('impossibility-bar');
        const impossibilityValue = document.getElementById('impossibility-value');
        impossibilityBar.style.width = `${scores.impossibility}%`;
        impossibilityValue.textContent = `${Math.round(scores.impossibility)}%`;
    }

    displayGrammaticalAnalysis(nlpResult) {
        const tokensDisplay = document.getElementById('tokens-display');
        tokensDisplay.innerHTML = '';

        nlpResult.taggedTokens.forEach(taggedToken => {
            const tokenElement = document.createElement('span');
            tokenElement.className = 'token';
            
            // Add specific classes based on POS tags
            if (taggedToken.pos === 'MD') {
                tokenElement.classList.add('modal');
            } else if (taggedToken.pos.startsWith('VB')) {
                tokenElement.classList.add('verb');
            } else if (taggedToken.pos.startsWith('NN')) {
                tokenElement.classList.add('noun');
            } else if (taggedToken.pos.startsWith('JJ')) {
                tokenElement.classList.add('adjective');
            }

            tokenElement.textContent = `${taggedToken.token} (${taggedToken.pos})`;
            tokenElement.title = this.getPOSDescription(taggedToken.pos);
            
            tokensDisplay.appendChild(tokenElement);
        });
    }

    displayModalIndicators(modalIndicators) {
        const indicatorsDisplay = document.getElementById('modal-indicators');
        
        const allIndicators = [];
        Object.keys(modalIndicators).forEach(type => {
            modalIndicators[type].forEach(indicator => {
                allIndicators.push(`<strong>${type}:</strong> ${indicator}`);
            });
        });

        if (allIndicators.length > 0) {
            indicatorsDisplay.innerHTML = allIndicators.join('<br>');
        } else {
            indicatorsDisplay.innerHTML = 'No explicit modal indicators found.';
        }
    }

    displaySentenceBreakdown(sentenceResults) {
        const breakdownSection = document.getElementById('sentence-breakdown');
        const breakdownContent = document.getElementById('sentence-breakdown-content');
        
        breakdownSection.style.display = 'block';
        breakdownContent.innerHTML = '';

        sentenceResults.forEach((result, index) => {
            const sentenceDiv = document.createElement('div');
            sentenceDiv.className = 'sentence-analysis';
            
            const sentenceHeader = document.createElement('h4');
            sentenceHeader.textContent = `Sentence ${index + 1}: "${result.sentence}"`;
            sentenceDiv.appendChild(sentenceHeader);

            // Mini rating bars for each sentence
            const miniRatings = document.createElement('div');
            miniRatings.className = 'mini-ratings';
            miniRatings.innerHTML = `
                <div class="mini-rating-item">
                    <span>Necessity:</span>
                    <div class="mini-rating-bar">
                        <div class="mini-rating-fill necessity" style="width: ${result.scores.necessity}%"></div>
                    </div>
                    <span>${Math.round(result.scores.necessity)}%</span>
                </div>
                <div class="mini-rating-item">
                    <span>Possibility:</span>
                    <div class="mini-rating-bar">
                        <div class="mini-rating-fill possibility" style="width: ${result.scores.possibility}%"></div>
                    </div>
                    <span>${Math.round(result.scores.possibility)}%</span>
                </div>
                <div class="mini-rating-item">
                    <span>Impossibility:</span>
                    <div class="mini-rating-bar">
                        <div class="mini-rating-fill impossibility" style="width: ${result.scores.impossibility}%"></div>
                    </div>
                    <span>${Math.round(result.scores.impossibility)}%</span>
                </div>
            `;
            sentenceDiv.appendChild(miniRatings);

            const classification = document.createElement('p');
            classification.innerHTML = `<strong>Classification:</strong> ${result.classification}`;
            sentenceDiv.appendChild(classification);

            breakdownContent.appendChild(sentenceDiv);
        });
    }

    displayAggregatedAnalysis(result) {
        // Aggregate all modal indicators from all sentences
        const aggregatedIndicators = {
            necessity: new Set(),
            possibility: new Set(),
            impossibility: new Set()
        };

        result.sentenceResults.forEach(sentenceResult => {
            Object.keys(sentenceResult.nlpResult.modalIndicators).forEach(type => {
                sentenceResult.nlpResult.modalIndicators[type].forEach(indicator => {
                    aggregatedIndicators[type].add(indicator);
                });
            });
        });

        // Convert sets back to arrays
        const finalIndicators = {};
        Object.keys(aggregatedIndicators).forEach(type => {
            finalIndicators[type] = Array.from(aggregatedIndicators[type]);
        });

        this.displayModalIndicators(finalIndicators);

        // Display aggregated grammatical analysis (from first sentence as representative)
        if (result.sentenceResults.length > 0) {
            this.displayGrammaticalAnalysis(result.sentenceResults[0].nlpResult);
        }
    }

    getPOSDescription(pos) {
        const descriptions = {
            'NN': 'Noun (singular)',
            'NNS': 'Noun (plural)',
            'NNP': 'Proper noun',
            'VB': 'Verb (base form)',
            'VBD': 'Verb (past tense)',
            'VBG': 'Verb (gerund/present participle)',
            'VBN': 'Verb (past participle)',
            'VBP': 'Verb (present, not 3rd person singular)',
            'VBZ': 'Verb (present, 3rd person singular)',
            'JJ': 'Adjective',
            'RB': 'Adverb',
            'MD': 'Modal verb',
            'PRP': 'Personal pronoun',
            'PRP$': 'Possessive pronoun',
            'DT': 'Determiner',
            'IN': 'Preposition/subordinating conjunction',
            'CC': 'Coordinating conjunction',
            'PUNCT': 'Punctuation'
        };
        
        return descriptions[pos] || 'Unknown part of speech';
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ModalityCalculatorApp();
});
