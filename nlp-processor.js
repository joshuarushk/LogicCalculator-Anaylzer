class NLPProcessor {
    constructor() {
        // Common modal verbs and expressions
        this.modalVerbs = {
            necessity: ['must', 'have to', 'need to', 'ought to', 'should', 'shall', 'required', 'necessary', 'essential', 'inevitable', 'certain'],
            possibility: ['can', 'could', 'may', 'might', 'possible', 'perhaps', 'maybe', 'likely', 'probable', 'potentially'],
            impossibility: ['cannot', 'can\'t', 'impossible', 'never', 'no way', 'unable', 'incapable', 'forbidden', 'prohibited']
        };

        // POS tag mappings (simplified)
        this.posPatterns = {
            // Pronouns
            'i': 'PRP', 'you': 'PRP', 'he': 'PRP', 'she': 'PRP', 'it': 'PRP', 'we': 'PRP', 'they': 'PRP',
            'me': 'PRP', 'him': 'PRP', 'her': 'PRP', 'us': 'PRP', 'them': 'PRP',
            'my': 'PRP$', 'your': 'PRP$', 'his': 'PRP$', 'her': 'PRP$', 'its': 'PRP$', 'our': 'PRP$', 'their': 'PRP$',
            
            // Articles
            'a': 'DT', 'an': 'DT', 'the': 'DT',
            
            // Prepositions
            'in': 'IN', 'on': 'IN', 'at': 'IN', 'by': 'IN', 'for': 'IN', 'with': 'IN', 'to': 'IN', 'of': 'IN',
            'from': 'IN', 'about': 'IN', 'into': 'IN', 'through': 'IN', 'during': 'IN', 'before': 'IN', 'after': 'IN',
            
            // Conjunctions
            'and': 'CC', 'or': 'CC', 'but': 'CC', 'so': 'CC', 'yet': 'CC', 'nor': 'CC',
            'that': 'IN', 'if': 'IN', 'when': 'IN', 'where': 'IN', 'while': 'IN', 'because': 'IN',
            
            // Common verbs
            'is': 'VBZ', 'are': 'VBP', 'was': 'VBD', 'were': 'VBD', 'be': 'VB', 'been': 'VBN', 'being': 'VBG',
            'have': 'VBP', 'has': 'VBZ', 'had': 'VBD', 'having': 'VBG',
            'do': 'VBP', 'does': 'VBZ', 'did': 'VBD', 'doing': 'VBG', 'done': 'VBN',
            'will': 'MD', 'would': 'MD', 'can': 'MD', 'could': 'MD', 'may': 'MD', 'might': 'MD',
            'must': 'MD', 'should': 'MD', 'shall': 'MD', 'ought': 'MD',
            
            // Common adjectives
            'good': 'JJ', 'bad': 'JJ', 'big': 'JJ', 'small': 'JJ', 'new': 'JJ', 'old': 'JJ',
            'first': 'JJ', 'last': 'JJ', 'long': 'JJ', 'short': 'JJ', 'high': 'JJ', 'low': 'JJ',
            'necessary': 'JJ', 'possible': 'JJ', 'impossible': 'JJ', 'certain': 'JJ', 'likely': 'JJ',
            
            // Common adverbs
            'very': 'RB', 'really': 'RB', 'quite': 'RB', 'rather': 'RB', 'too': 'RB',
            'always': 'RB', 'never': 'RB', 'sometimes': 'RB', 'often': 'RB', 'usually': 'RB',
            'certainly': 'RB', 'probably': 'RB', 'possibly': 'RB', 'definitely': 'RB', 'maybe': 'RB'
        };
    }

    tokenize(sentence) {
        // Basic tokenization - split on whitespace and punctuation
        const tokens = sentence.toLowerCase()
            .replace(/[.,!?;:]/g, ' $& ')
            .split(/\s+/)
            .filter(token => token.trim() !== '');
        
        return tokens;
    }

    posTag(tokens) {
        const tagged = [];
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let pos = this.posPatterns[token];
            
            if (!pos) {
                // Simple heuristic-based POS tagging
                if (token.match(/^[.,!?;:]$/)) {
                    pos = 'PUNCT';
                } else if (token.endsWith('ing')) {
                    pos = 'VBG'; // Present participle
                } else if (token.endsWith('ed')) {
                    pos = 'VBD'; // Past tense
                } else if (token.endsWith('ly')) {
                    pos = 'RB'; // Adverb
                } else if (token.endsWith('s') && !token.endsWith('ss')) {
                    // Could be plural noun or third person singular verb
                    pos = i > 0 && this.isArticleOrAdjective(tokens[i-1]) ? 'NNS' : 'VBZ';
                } else if (token.match(/^[A-Z]/)) {
                    pos = 'NNP'; // Proper noun
                } else if (this.isModal(token)) {
                    pos = 'MD'; // Modal verb
                } else {
                    // Default to noun for unknown words
                    pos = 'NN';
                }
            }
            
            tagged.push({ token, pos });
        }
        
        return tagged;
    }

    isArticleOrAdjective(word) {
        const pos = this.posPatterns[word];
        return pos === 'DT' || pos === 'JJ';
    }

    isModal(word) {
        return Object.values(this.modalVerbs).some(modals => 
            modals.some(modal => word.includes(modal) || modal.includes(word))
        );
    }

    findModalIndicators(tokens) {
        const indicators = {
            necessity: [],
            possibility: [],
            impossibility: []
        };

        const sentence = tokens.join(' ').toLowerCase();

        // Check for modal expressions
        Object.keys(this.modalVerbs).forEach(type => {
            this.modalVerbs[type].forEach(modal => {
                if (sentence.includes(modal.toLowerCase())) {
                    indicators[type].push(modal);
                }
            });
        });

        // Check for specific patterns
        if (sentence.match(/it is (necessary|essential|required|certain)/)) {
            indicators.necessity.push('necessity construction');
        }
        
        if (sentence.match(/it is (possible|likely|probable)/)) {
            indicators.possibility.push('possibility construction');
        }
        
        if (sentence.match(/it is (impossible|unlikely|improbable)/)) {
            indicators.impossibility.push('impossibility construction');
        }

        // Check for negation patterns
        if (sentence.match(/not (possible|able|capable)/)) {
            indicators.impossibility.push('negated possibility');
        }

        return indicators;
    }

    analyzeSentenceStructure(taggedTokens) {
        const structure = {
            hasSubject: false,
            hasPredicate: false,
            hasModal: false,
            isConditional: false,
            isNegated: false,
            tense: 'present'
        };

        const sentence = taggedTokens.map(t => t.token).join(' ').toLowerCase();

        // Check for subject (pronouns or nouns before verbs)
        for (let i = 0; i < taggedTokens.length; i++) {
            const tag = taggedTokens[i];
            if (tag.pos.startsWith('PRP') || tag.pos.startsWith('NN')) {
                structure.hasSubject = true;
                break;
            }
        }

        // Check for predicate (verbs)
        structure.hasPredicate = taggedTokens.some(tag => tag.pos.startsWith('VB'));

        // Check for modals
        structure.hasModal = taggedTokens.some(tag => tag.pos === 'MD');

        // Check for conditionals
        structure.isConditional = sentence.includes('if') || sentence.includes('when') || 
                                 sentence.includes('unless') || sentence.includes('provided');

        // Check for negation
        structure.isNegated = sentence.includes('not') || sentence.includes("n't") || 
                             sentence.includes('never') || sentence.includes('no');

        // Determine tense (simplified)
        if (taggedTokens.some(tag => tag.pos === 'VBD' || tag.token === 'was' || tag.token === 'were')) {
            structure.tense = 'past';
        } else if (taggedTokens.some(tag => tag.token === 'will' || tag.token === 'shall')) {
            structure.tense = 'future';
        }

        return structure;
    }

    process(sentence) {
        const tokens = this.tokenize(sentence);
        const taggedTokens = this.posTag(tokens);
        const modalIndicators = this.findModalIndicators(tokens);
        const structure = this.analyzeSentenceStructure(taggedTokens);

        return {
            originalSentence: sentence,
            tokens,
            taggedTokens,
            modalIndicators,
            structure
        };
    }
}
